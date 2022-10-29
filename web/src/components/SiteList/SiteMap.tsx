// https://github.com/googlemaps/js-samples/blob/ba83e1f1f8ecfb6f4e89a1dc1a552a4cb3034b1e/samples/react-map/index.tsx#L154-L168

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { createCustomEqual } from 'fast-equals';
import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import { SearchArea } from '../../generated/graphql';
import {
  Box,
  BoxProps,
  CircularProgress,
  styled,
  SxProps,
  Theme,
} from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

export const MAPS_API_KEY = 'AIzaSyA4iYD91nzR3c4YXwpB9EAcGFugk3jjVPE';
const INITIAL_ZOOM = 14;

const render = (status: Status): React.ReactElement => {
  if (status === Status.FAILURE) return <ErrorIcon />;
  return <CircularProgress />;
};

export type Position = {
  lat: number;
  lon: number;
};

export type MapQuery = {
  address: string;
  area?: SearchArea;
};

export enum ControlPosition {
  BOTTOM_CENTER = 10.0,
  BOTTOM_LEFT = 12.0,
  BOTTOM_RIGHT = 11.0,
  LEFT_BOTTOM = 6.0,
  LEFT_CENTER = 4.0,
  LEFT_TOP = 5.0,
  RIGHT_BOTTOM = 9.0,
  RIGHT_CENTER = 8.0,
  RIGHT_TOP = 7.0,
  TOP_CENTER = 1.0,
  TOP_LEFT = 2.0,
  TOP_RIGHT = 3.0,
}

export type MapControl = {
  element: React.ReactElement;
  position: ControlPosition;
};

const positionToGoogleLatLng = (pos: Position): google.maps.LatLng => {
  return new window.google.maps.LatLng(pos.lat, pos.lon);
};

export type SiteMapProps = {
  positions: Position[];
  onChange?: (
    topLeftLat: number,
    topLeftLon: number,
    bottomRightLat: number,
    bottomRightLon: number,
  ) => void;
  query?: MapQuery;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onQueryResult?: (position: Position) => void;
  centerPosition?: Position;
  controls?: MapControl[];
  sx?: SxProps<Theme>;
};

const Container = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  width: 350,
  height: 350,
}));

export default function SiteMap(props: SiteMapProps) {
  const {
    positions,
    centerPosition,
    query,
    sx,
    controls,
    onChange,
    onClick,
    onQueryResult,
  } = props;

  const onIdle = (m: google.maps.Map) => {
    if (!onChange) return;
    const northEast = m.getBounds()?.getNorthEast();
    const southWest = m.getBounds()?.getSouthWest();
    if (!northEast || !southWest) return;
    onChange(
      northEast.lat(),
      southWest.lng(),
      southWest.lat(),
      northEast.lng(),
    );
  };

  return (
    <Container sx={{ ...sx }}>
      <Wrapper apiKey={MAPS_API_KEY} render={render}>
        <Map
          onIdle={onIdle}
          onClick={onClick}
          onQueryResult={onQueryResult}
          center={
            centerPosition ? positionToGoogleLatLng(centerPosition) : null
          }
          zoom={INITIAL_ZOOM}
          style={{ flexGrow: '1', height: '100%' }}
          query={query}
          streetViewControl={false}
          controls={controls}
        >
          {window.google
            ? positions.map((position, i) => (
                <Marker key={i} position={positionToGoogleLatLng(position)} />
              ))
            : null}
        </Map>
      </Wrapper>
    </Container>
  );
}
export interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  onQueryResult?: (position: Position) => void;
  query?: MapQuery;
  controls?: MapControl[];
  children?: React.ReactNode;
}

export const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  onQueryResult,
  children,
  style,
  query,
  controls,
  ...options
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();
  const [geocoder, setGeocoder] = React.useState<google.maps.Geocoder>();

  React.useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {});
      controls?.forEach((control) => {
        const controlDiv = document.createElement('div');
        ReactDOM.render(control.element, controlDiv);
        newMap.controls[control.position].push(controlDiv);
      });
      setMap(newMap);
    }
  }, [ref, map]);

  React.useEffect(() => {
    if (ref.current && !geocoder) {
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, [ref, geocoder]);

  React.useEffect(() => {
    if (!query || !geocoder || !map) return;
    if (query.area) {
      const centerLat =
        (query.area.topLeftLat + query.area.bottomRightLat) / 2.0;
      const centerLng =
        (query.area.topLeftLon + query.area.bottomRightLon) / 2.0;
      const center = new window.google.maps.LatLng(centerLat, centerLng);
      map.setCenter(center);
      if (onQueryResult) {
        onQueryResult({ lat: centerLat, lon: centerLng });
      }
      return;
    }
    if (!query.address) return;
    const req: google.maps.GeocoderRequest = {
      address: query.address,
    };
    geocoder.geocode(req, (results, status) => {
      if (status !== window.google.maps.GeocoderStatus.OK || !results) return;
      map.setCenter(results[0].geometry.location);
      if (onQueryResult) {
        onQueryResult({
          lat: results[0].geometry.location.lat(),
          lon: results[0].geometry.location.lng(),
        });
      }
    });
  }, [geocoder, map, query]);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  React.useEffect(() => {
    if (map) {
      ['click', 'idle'].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName),
      );

      if (onClick) {
        map.addListener('click', onClick);
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

const deepCompareEqualsForMaps: (a: any, b: any, meta?: undefined) => boolean =
  createCustomEqual(() => ({
    createIsNestedEqual: (deepEqual) => (a: any, b: any) => {
      if (
        isLatLngLiteral(a) ||
        a instanceof window.google.maps.LatLng ||
        isLatLngLiteral(b) ||
        b instanceof window.google.maps.LatLng
      ) {
        return new window.google.maps.LatLng(a).equals(
          new window.google.maps.LatLng(b),
        );
      }

      // TODO extend to other types

      // use fast-equals for other objects
      return deepEqual(a, b);
    },
  }));

function useDeepCompareMemoize(value: any) {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(
  callback: React.EffectCallback,
  dependencies: any[],
) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export {};

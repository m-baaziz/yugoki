// https://github.com/googlemaps/js-samples/blob/ba83e1f1f8ecfb6f4e89a1dc1a552a4cb3034b1e/samples/react-map/index.tsx#L154-L168

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { createCustomEqual } from 'fast-equals';
import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import {
  ClubSportLocation,
  ClubSportLocationSearchQueryInput,
} from '../../generated/graphql';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, CircularProgress } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

const INITIAL_ZOOM = 14;

const render = (status: Status): React.ReactElement => {
  if (status === Status.FAILURE) return <ErrorIcon />;
  return <CircularProgress />;
};

const cslToLatLng = (csl: ClubSportLocation): google.maps.LatLng => {
  return new window.google.maps.LatLng(csl.lat, csl.lon);
};

export type CslMapProps = {
  locations: ClubSportLocation[];
  onChange: (
    topLeftLat: number,
    topLeftLon: number,
    bottomRightLat: number,
    bottomRightLon: number,
  ) => void;
  query?: ClubSportLocationSearchQueryInput;
};

const Container = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  width: 350,
  height: 350,
}));

export default function CslMap(props: CslMapProps) {
  const { locations, onChange, query } = props;

  const onIdle = (m: google.maps.Map) => {
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
    <Container>
      <Wrapper
        apiKey={'AIzaSyA4iYD91nzR3c4YXwpB9EAcGFugk3jjVPE'}
        render={render}
      >
        <Map
          // center={INITIAL_CENTER}
          onIdle={onIdle}
          zoom={INITIAL_ZOOM}
          style={{ flexGrow: '1', height: '100%' }}
          query={query}
        >
          {window.google
            ? locations.map((csl, i) => (
                <Marker key={i} position={cslToLatLng(csl)} />
              ))
            : null}
        </Map>
      </Wrapper>
    </Container>
  );
}
interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  query?: ClubSportLocationSearchQueryInput;
  children?: React.ReactNode;
}

const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  children,
  style,
  query,
  ...options
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();
  const [geocoder, setGeocoder] = React.useState<google.maps.Geocoder>();

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
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
      return;
    }
    const req: google.maps.GeocoderRequest = {
      address: query.address,
    };
    geocoder.geocode(req, (results, status) => {
      if (status !== window.google.maps.GeocoderStatus.OK || !results) return;
      map.setCenter(results[0].geometry.location);
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

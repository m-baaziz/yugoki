import * as React from 'react';
import {
  Box,
  SxProps,
  Theme,
  styled,
  BoxProps,
  TextField,
} from '@mui/material';
import CslMap, { MapQuery, Position } from '../../CslList/CslMap';
import { useTimeout } from '../../../hooks/timeout';

const UPDATE_DELAY_MS = 1000;

export type PositionFormProps = {
  address: string;
  position: Position;
  onChange: (position: Position) => void;
  sx?: SxProps<Theme>;
};

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate:
    "  \
    '   map   .    lat  '  1fr  \
    '   map   .    lon  '  1fr  \
    /   1fr  1em   1fr          \
  ",
}));

export default function PositionForm(props: PositionFormProps) {
  const { address, position, onChange, sx } = props;
  const [mapQuery, setMapQuery] = React.useState<MapQuery>({});
  const timeoutWrapper = useTimeout();

  React.useEffect(() => {
    if (timeoutWrapper.timeout) {
      clearTimeout(timeoutWrapper.timeout);
    }
    const timeout = setTimeout(() => {
      setMapQuery({ address });
    }, UPDATE_DELAY_MS);
    timeoutWrapper.timeout = timeout;
  }, [address]);

  const handleChangeLat = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      onChange({ ...position, lat: parseFloat(e.target.value) });
    } catch (e) {
      console.error(e);
    }
  };
  const handleChangeLon = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      onChange({ ...position, lon: parseFloat(e.target.value) });
    } catch (e) {
      console.error(e);
    }
  };
  const handleClickMap = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    setMapQuery({});
    onChange({ lat: e.latLng.lat(), lon: e.latLng.lng() });
  };
  const handleAddressQuery = (position: Position) => {
    onChange(position);
  };

  return (
    <Container
      sx={{
        ...sx,
      }}
    >
      <Box sx={{ gridArea: 'map' }}>
        <CslMap
          positions={[position]}
          query={mapQuery}
          onClick={handleClickMap}
          onQueryResult={handleAddressQuery}
        />
      </Box>
      <Box sx={{ gridArea: 'lat' }}>
        <TextField
          id="lat"
          label="latitude"
          type="number"
          variant="standard"
          value={position.lat}
          onChange={handleChangeLat}
        />
      </Box>
      <Box sx={{ gridArea: 'lon' }}>
        <TextField
          id="lon"
          label="longitude"
          type="number"
          variant="standard"
          value={position.lon}
          onChange={handleChangeLon}
        />
      </Box>
    </Container>
  );
}

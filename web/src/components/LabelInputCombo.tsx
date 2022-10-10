import * as React from 'react';
import { Box, TextField } from '@mui/material';
import { SxProps } from '@mui/system';

export type LabelInputComboProps = {
  value: string;
  inputLabel: string;
  onChange: (value: string) => void;
  sx?: SxProps;
  disabled?: boolean;
};

export default function LabelInputCombo(
  props: React.PropsWithChildren<LabelInputComboProps>,
) {
  const { value, inputLabel, onChange, sx, disabled, children } = props;
  const [inputMode, setInputMode] = React.useState(false);
  const [tmpValue, setTmpValue] = React.useState('');

  const handleClick = () => {
    if (disabled === true) return;
    setTmpValue(value);
    setInputMode(true);
  };
  const handleBlur = () => {
    setInputMode(false);
    onChange(tmpValue);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTmpValue(event.target.value);
  };

  return (
    <Box sx={sx}>
      {inputMode ? (
        <TextField
          id="standard-basic"
          label={inputLabel}
          variant="standard"
          value={tmpValue}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      ) : (
        <Box onClick={handleClick}>{children}</Box>
      )}
    </Box>
  );
}

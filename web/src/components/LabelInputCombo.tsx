import * as React from 'react';
import { Box, TextField } from '@mui/material';
import { SxProps } from '@mui/system';

export type LabelInputComboProps = {
  value: string;
  inputLabel: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  sx?: SxProps;
  disabled?: boolean;
  fullWidth?: boolean;
};

export default function LabelInputCombo(
  props: React.PropsWithChildren<LabelInputComboProps>,
) {
  const {
    value,
    inputLabel,
    onChange,
    onSubmit,
    sx,
    disabled,
    fullWidth,
    children,
  } = props;
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
  const handleSubmit = (e: React.ChangeEvent<HTMLDivElement>) => {
    e.preventDefault();
    setInputMode(false);
    onChange(tmpValue);
    if (onSubmit) {
      onSubmit(tmpValue);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTmpValue(event.target.value);
  };

  return (
    <Box sx={{ ...sx }}>
      {inputMode ? (
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            id="standard-basic"
            label={inputLabel}
            variant="standard"
            value={tmpValue}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth={fullWidth}
            autoFocus
          />
          <input type="submit" hidden />
        </Box>
      ) : (
        <Box onClick={handleClick}>{children}</Box>
      )}
    </Box>
  );
}

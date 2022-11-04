import * as React from 'react';
import { Box, SxProps, TextField } from '@mui/material';

export type MessageInputProps = {
  onSubmit: (text: string) => void;
  sx?: SxProps;
};

export default function MessageInput(props: MessageInputProps) {
  const { sx, onSubmit } = props;
  const [text, setText] = React.useState('');

  const handleSubmit = (e: React.ChangeEvent<HTMLDivElement>) => {
    e.preventDefault();
    onSubmit(text);
    setText('');
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <Box
      sx={{ height: '100%', width: '100%', ...sx }}
      component="form"
      onSubmit={handleSubmit}
    >
      <TextField
        id="message"
        variant="outlined"
        fullWidth
        value={text}
        onChange={handleTextChange}
      />
      <input type="submit" hidden />
    </Box>
  );
}

import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box, Link } from '@mui/material';

export type IconTextComboProps = {
  icon?: string;
  size: number;
  text: string | React.ReactElement;
  link?: boolean;
};

export default function IconTextCombo(props: IconTextComboProps) {
  const { icon, size, text, link } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        lineHeight: `${size}px`,
      }}
    >
      {icon ? (
        <Box sx={{ margin: 'auto', mr: 0.5 }}>
          <img src={`/icons/80${icon}`} height={size} width={size} />
        </Box>
      ) : null}
      <Box sx={{ flexGrow: 2 }}>
        {typeof text === 'string' ? (
          <Typography
            variant="body2"
            component="div"
            sx={{ alighContent: 'center' }}
          >
            {link ? (
              <Link href={text} color="inherit" target="blank">
                {text}
              </Link>
            ) : (
              text
            )}
          </Typography>
        ) : (
          text
        )}
      </Box>
    </Box>
  );
}

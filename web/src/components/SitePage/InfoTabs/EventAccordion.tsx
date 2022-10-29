import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Event } from '../../../generated/graphql';
import { SxProps, Theme } from '@mui/material';
import IconTextCombo from '../../IconTextCombo';
import { useGetFile } from '../../../hooks/fileUpload';

const IMG_SIZE = 80;

export type EventAccordionProps = {
  event: Event;
  expanded: boolean;
  onExpandedChange: (id: string, isExpanded: boolean) => void;
  sx?: SxProps<Theme>;
};

export default function EventAccordion(props: EventAccordionProps) {
  const { event: clubEvent, expanded, onExpandedChange, sx } = props;
  const { data: imageData } = useGetFile(clubEvent.image || undefined);

  const imageUrl = React.useMemo<string>(
    () =>
      imageData && imageData.getFileUpload.url
        ? imageData.getFileUpload.url
        : '',
    [imageData],
  );

  const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    onExpandedChange(clubEvent.id || '', isExpanded);
  };

  return (
    <Accordion
      key={clubEvent.id}
      expanded={expanded}
      onChange={handleChange}
      sx={{ ...sx }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${clubEvent.id}-content`}
        id={`${clubEvent.id}-header`}
      >
        <Typography sx={{ width: '33%', flexShrink: 0 }}>
          {clubEvent.dateRFC3339}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {clubEvent.title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <IconTextCombo
          size={IMG_SIZE}
          icon={imageUrl}
          text={clubEvent.description}
        />
      </AccordionDetails>
    </Accordion>
  );
}

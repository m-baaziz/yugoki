import * as React from 'react';
import { Box, SxProps, Tab, Tabs, Theme } from '@mui/material';
import { ClubSportLocation } from '../../../generated/graphql';
import Activities from './Activities';

enum InfoTabValue {
  Activities,
  Team,
  Events,
}

const infoSectionLabelMap: Map<InfoTabValue, string> = new Map([
  [InfoTabValue.Activities, 'Activities'],
  [InfoTabValue.Team, 'Team'],
  [InfoTabValue.Events, 'Events'],
]);

const infoSectionToShow: InfoTabValue[] = [
  InfoTabValue.Activities,
  InfoTabValue.Team,
  InfoTabValue.Events,
];

export type InfoTabsProps = {
  csl: ClubSportLocation;
  sx?: SxProps<Theme>;
};

type TabPanelProps = {
  children?: React.ReactNode;
  tab: InfoTabValue;
  showOnTab: InfoTabValue;
};

function TabPanel(props: TabPanelProps) {
  const { children, tab, showOnTab } = props;

  return (
    <div
      role="tabpanel"
      hidden={tab !== showOnTab}
      id={`info-tabpanel-${tab}`}
      aria-labelledby={`info-tab-${tab}`}
    >
      {tab === showOnTab ? <Box sx={{ p: 3 }}>{children}</Box> : null}
    </div>
  );
}

export default function InfoTabs(props: InfoTabsProps) {
  const { sx, csl } = props;
  const [tab, setTab] = React.useState<InfoTabValue>(InfoTabValue.Activities);

  const tabIndex = Math.max(
    infoSectionToShow.findIndex((v) => v === tab),
    0,
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(infoSectionToShow[newValue]);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      <Box sx={{ margin: 'auto' }}>
        <Tabs value={tabIndex} onChange={handleChange}>
          {infoSectionToShow
            .filter((s) => infoSectionLabelMap.has(s))
            .map((s) => (
              <Tab
                key={s}
                id={`info-tab-${s}`}
                aria-controls={`info-tab-${s}`}
                label={infoSectionLabelMap.get(s)}
              />
            ))}
        </Tabs>
      </Box>
      <TabPanel tab={tab} showOnTab={InfoTabValue.Activities}>
        <Activities activities={csl.activities} />
      </TabPanel>
    </Box>
  );
}

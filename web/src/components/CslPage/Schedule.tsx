// use css grid
// calculate number of rows based on max hour granularity
// calculate number of columns based on max same time granularity (multiple activities)

import * as React from 'react';
import { Box, SxProps, Theme, Typography } from '@mui/material';
import { CalendarSpan } from '../../generated/graphql';
import range from 'lodash/range';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Satursday',
  'Sunday',
];

const dayIndex = (arrayIndex: number) => arrayIndex + 1;

const MIN_MINUTE = 6 * 60;
const MAX_MINUTE = 24 * 60;
const STEP_MINUTE = 2 * 60;
const COLUMN_WIDTH = 150;
const COLUMN_HEIGHT = 500;
const HEADER_HEIGHT = 40;
const STEP_HEIGHT = (COLUMN_HEIGHT * STEP_MINUTE) / (MAX_MINUTE - MIN_MINUTE);

export type CalendarEvent = {
  id: string;
  fromMinute: number;
  toMinute: number;
  title: string;
};

export type relativeEventPosition = {
  event: CalendarEvent;
  height: number;
  width: number;
  vOffset: number;
  hOffset: number;
};

type LargestInterval = {
  fromMinute: number;
  toMinute: number;
  events: CalendarEvent[];
};

function computeIntersectingIntervals(
  events: CalendarEvent[],
): LargestInterval[] {
  const intervals: LargestInterval[] = [];
  events.forEach((e) => {
    const intersectingInterval = intervals.find(
      ({ fromMinute, toMinute }) =>
        (e.fromMinute <= fromMinute && e.toMinute > fromMinute) ||
        (e.fromMinute < toMinute && e.toMinute >= toMinute),
    );
    if (intersectingInterval) {
      intersectingInterval.fromMinute = Math.min(
        intersectingInterval.fromMinute,
        e.fromMinute,
      );
      intersectingInterval.toMinute = Math.max(
        intersectingInterval.toMinute,
        e.toMinute,
      );
      intersectingInterval.events.push(e);
    } else {
      intervals.push({
        fromMinute: e.fromMinute,
        toMinute: e.toMinute,
        events: [e],
      });
    }
  });
  return intervals;
}

export function computeEventPositions(
  events: CalendarEvent[],
  minTime: number,
  maxTime: number,
): relativeEventPosition[] {
  const eventPositions: relativeEventPosition[] = [];
  const intervals = computeIntersectingIntervals(events);
  intervals.forEach((interval) => {
    const length = interval.events.length;
    interval.events.forEach((e, i) => {
      const position: relativeEventPosition = {
        event: e,
        height: (e.toMinute - e.fromMinute) / (maxTime - minTime),
        width: 1 / length,
        vOffset: (e.fromMinute - minTime) / (maxTime - minTime),
        hOffset: (i * 1) / length,
      };
      eventPositions.push(position);
    });
  });
  return eventPositions;
}

export function minutesToString(minutes: number): string {
  const hour = Math.floor(minutes / 60) % 24;
  const remainingMinutes = minutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(remainingMinutes).padStart(
    2,
    '0',
  )}`;
}

type DayEventsMap = Map<number, CalendarEvent[]>;
type DayEventsPositionMap = Map<number, relativeEventPosition[]>;

export type ScheduleProps = {
  calendarSpans: CalendarSpan[];
  sx?: SxProps<Theme>;
};

export default function Schedule(props: ScheduleProps) {
  const { calendarSpans, sx } = props;
  const eventPositions: DayEventsPositionMap = React.useMemo(() => {
    const dayEventsMap: DayEventsMap = new Map([]);
    calendarSpans.forEach(({ title, day, fromMinute, toMinute }, i) => {
      if (day < 1 || day > 7) return;
      const calendarEvent: CalendarEvent = {
        id: i.toString(),
        title,
        fromMinute,
        toMinute,
      };
      if (dayEventsMap.has(day)) {
        dayEventsMap.get(day)?.push(calendarEvent);
      } else {
        dayEventsMap.set(day, [calendarEvent]);
      }
    });
    const dayEventsPositionMap: DayEventsPositionMap = new Map([]);
    DAYS.forEach((day, i) => {
      const events = dayEventsMap.get(dayIndex(i));
      if (!events || events.length === 0) {
        dayEventsPositionMap.set(dayIndex(i), []);
      } else {
        dayEventsPositionMap.set(
          dayIndex(i),
          computeEventPositions(events, MIN_MINUTE, MAX_MINUTE),
        );
      }
    });
    return dayEventsPositionMap;
  }, [calendarSpans]);

  console.log('span = ', eventPositions);

  return (
    <Box sx={{ ...sx, display: 'flex', flexDirection: 'row' }}>
      <Box
        sx={{
          height: COLUMN_HEIGHT,
          marginTop: `${HEADER_HEIGHT + 1}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {range(MIN_MINUTE, MAX_MINUTE, STEP_MINUTE).map((minute: number) => (
          <Box
            key={minute}
            sx={{
              borderTop: '0.5px solid',
              height: STEP_HEIGHT,
            }}
          >
            <Typography variant="body2">{minutesToString(minute)}</Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', ...sx }}
      >
        {DAYS.map((day, i) => (
          <Box
            key={day}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              border: '0.2px solid',
              width: COLUMN_WIDTH,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                borderBottom: '0.2px solid',
                height: HEADER_HEIGHT,
              }}
            >
              <Typography variant="h5" sx={{ margin: 'auto' }}>
                {day}
              </Typography>
            </Box>
            <Box
              sx={{
                height: COLUMN_HEIGHT,
                width: '100%',
                position: 'relative',
              }}
            >
              {eventPositions.get(dayIndex(i))?.map((relativeEventPosition) => (
                <Box
                  key={relativeEventPosition.event.id}
                  sx={{
                    borderTop: '0.2px solid',
                    borderBottom: '0.2px solid',
                    position: 'absolute',
                    height: `${relativeEventPosition.height * 100}%`,
                    width: `${relativeEventPosition.width * 100}%`,
                    top: `${relativeEventPosition.vOffset * 100}%`,
                    left: `${relativeEventPosition.hOffset * 100}%`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ margin: 'auto', padding: '5px' }}
                  >
                    {relativeEventPosition.event.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ margin: 'auto', padding: '1px' }}
                  >
                    ({minutesToString(relativeEventPosition.event.fromMinute)} -{' '}
                    {minutesToString(relativeEventPosition.event.toMinute)})
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* eslint-disable jest/no-focused-tests */
import {
  CalendarEvent,
  computeEventPositions,
  relativeEventPosition,
} from './Schedule';

describe.only('Schedule', () => {
  const ev = (
    title: string,
    fromHour: number,
    toHour: number,
  ): CalendarEvent => ({
    id: title,
    title,
    fromMinute: fromHour * 60,
    toMinute: toHour * 60,
  });

  test('grid compute', () => {
    const minTime = 8 * 60;
    const maxTime = 14 * 60;
    const expectedGrid: relativeEventPosition[] = [
      {
        event: ev('BASKT', 9, 11),
        height: 1 / 3,
        width: 1 / 3,
        vOffset: 1 / 6,
        hOffset: 0,
      },
      {
        event: ev('FTBL', 10, 12),
        height: 1 / 3,
        width: 1 / 3,
        vOffset: 1 / 3,
        hOffset: 1 / 3,
      },
      {
        event: ev('U', 9, 11),
        height: 1 / 3,
        width: 1 / 3,
        vOffset: 1 / 6,
        hOffset: 2 / 3,
      },
      {
        event: ev('BOX', 13, 14),
        height: 1 / 6,
        width: 1,
        vOffset: 5 / 6,
        hOffset: 0,
      },
    ];
    const events: CalendarEvent[] = [
      ev('BASKT', 9, 11),
      ev('FTBL', 10, 12),
      ev('U', 9, 11),
      ev('BOX', 13, 14),
    ];
    expect(computeEventPositions(events, minTime, maxTime)).toStrictEqual(
      expectedGrid,
    );
  });
});

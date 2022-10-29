import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { encode } from 'ngeohash';
import { Site, SearchArea, Activity, CalendarSpan } from '../generated/graphql';
import { clubToRecord, parseClub } from './club';
import { parseSport, sportToRecord } from './sport';
import { parseTrainer, trainerToRecord } from './trainer';

export function commonRadical(left: string, right: string): string {
  const minLength = Math.min(left.length, right.length);
  let radical = '';
  for (let i = 0; i < minLength; i++) {
    if (left[i] !== right[i]) return radical;
    else radical += left[i];
  }
  return radical;
}

export function computeAreaGeohash(area: SearchArea): string {
  const encodedTopLeft = encode(area.topLeftLat, area.topLeftLon, 9);
  const encodedBottomRight = encode(
    area.bottomRightLat,
    area.bottomRightLon,
    9,
  );
  return commonRadical(encodedTopLeft, encodedBottomRight);
}

export function parseActivity(item: Record<string, AttributeValue>): Activity {
  return {
    name: item.Name.S,
    description: item.Description.S,
    icon: item.Icon?.S,
  };
}

export function activityToRecord(
  activity: Activity,
): Record<string, AttributeValue> {
  return {
    Name: { S: activity.name },
    Description: { S: activity.description },
    Icon: activity.icon ? { S: activity.icon } : undefined,
  };
}

export function parseCalendarSpan(
  item: Record<string, AttributeValue>,
): CalendarSpan {
  return {
    day: parseInt(item.Day.N),
    fromMinute: parseInt(item.FromMinute.N),
    toMinute: parseInt(item.ToMinute.N),
    title: item.Title.S,
  };
}

export function calendarSpanToRecord(
  calendarSpan: CalendarSpan,
): Record<string, AttributeValue> {
  return {
    Day: { N: calendarSpan.day.toString() },
    FromMinute: { N: calendarSpan.fromMinute.toString() },
    ToMinute: { N: calendarSpan.toMinute.toString() },
    Title: { S: calendarSpan.title },
  };
}

export function parseSite(item: Record<string, AttributeValue>): Site {
  return {
    id: item.SiteId?.S,
    name: item.SiteName.S,
    club: parseClub(item.Club.M),
    sport: parseSport(item.Sport.M),
    address: item.SiteAddress.S,
    lat: parseFloat(item.SiteLat.N),
    lon: parseFloat(item.SiteLon.N),
    phone: item.SitePhone.S,
    website: item.SiteWebsite.S,
    images: item.SiteImages.L.map((im) => im.S),
    description: item.SiteDescription.S,
    activities: item.Activities.L.map((activity) => parseActivity(activity.M)),
    trainers: item.Trainers.L.map((trainer) => parseTrainer(trainer.M)),
    schedule: item.Schedule.L.map((span) => parseCalendarSpan(span.M)),
  };
}

export function siteToRecord(site: Site): Record<string, AttributeValue> {
  return {
    SiteId: { S: site.id },
    SiteName: { S: site.name },
    Club: { M: clubToRecord(site.club) },
    Sport: { M: sportToRecord(site.sport) },
    SiteAddress: { S: site.address },
    SiteLat: { N: site.lat.toString() },
    SiteLon: { S: site.lon.toString() },
    SitePhone: { S: site.phone },
    SiteWebsite: { S: site.website },
    SiteImages: { L: site.images.map((im) => ({ S: im })) },
    SiteDescription: { S: site.description },
    Activities: {
      L: site.activities.map((activity) => ({ M: activityToRecord(activity) })),
    },
    Trainers: {
      L: site.trainers.map((trainer) => ({ M: trainerToRecord(trainer) })),
    },
    Schedule: {
      L: site.schedule.map((span) => ({ M: calendarSpanToRecord(span) })),
    },
  };
}

import { ContextWithDataSources } from '../datasources';
import {
  Site,
  SitePageInfo,
  QueryGetSiteArgs,
  QuerySearchSitesArgs,
  MutationCreateSiteArgs,
  MutationDeleteSiteArgs,
  QueryListSitesByClubArgs,
  QueryGetSiteImagesArgs,
  FileUploadResponse,
} from '../generated/graphql';
import { isUserAuthorized } from '../utils/club';
import { logger } from '../logger';

export async function listSitesByClub(
  _parent: unknown,
  { clubId, first, after }: QueryListSitesByClubArgs,
  { dataSources: { siteAPI } }: ContextWithDataSources,
): Promise<SitePageInfo> {
  try {
    return await siteAPI.listSitesByClub(clubId, first, after);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function searchSites(
  _parent: unknown,
  { query: { sport, address, area }, first, after }: QuerySearchSitesArgs,
  { dataSources: { siteAPI } }: ContextWithDataSources,
): Promise<SitePageInfo> {
  try {
    if (area) {
      return await siteAPI.listSitesBySportAndArea(sport, area, first, after);
    } else if (address) {
      return Promise.reject('Search by address is not supported yet');
    }
    return Promise.reject('Please specify a sport id and an area');
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function getSite(
  _parent: unknown,
  { id }: QueryGetSiteArgs,
  { dataSources: { siteAPI } }: ContextWithDataSources,
): Promise<Site> {
  try {
    return await siteAPI.findSiteById(id);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function getSiteImages(
  _parent: unknown,
  { id }: QueryGetSiteImagesArgs,
  { dataSources: { siteAPI, fileUploadAPI } }: ContextWithDataSources,
): Promise<FileUploadResponse[]> {
  try {
    const site = await siteAPI.findSiteById(id);
    const fileUploadResponses = await Promise.all(
      site.images.map(async (imageId) => {
        try {
          return Promise.resolve({
            file: await fileUploadAPI.findFileUploadById(imageId),
            url: await fileUploadAPI.generateFileUrlGet(imageId),
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }),
    );
    return Promise.resolve(fileUploadResponses);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function createSite(
  _parent: unknown,
  { clubId, input }: MutationCreateSiteArgs,
  { user, dataSources: { siteAPI, sportAPI, clubAPI } }: ContextWithDataSources,
): Promise<Site> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const club = await clubAPI.findClubById(clubId);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const sport = await sportAPI.findSportById(input.sportId);
    return await siteAPI.createSite(club, sport, input);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function deleteSite(
  _parent: unknown,
  { id }: MutationDeleteSiteArgs,
  { user, dataSources: { siteAPI, clubAPI } }: ContextWithDataSources,
): Promise<boolean> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const site = await siteAPI.findSiteById(id);
    const club = await clubAPI.findClubById(site.club.id);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const result = await siteAPI.deleteSite(id);
    return Promise.resolve(result);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  BoxProps,
  CircularProgress,
  Typography,
  SxProps,
  Theme,
  Button,
  TextField,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useParams } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import {
  QueryGetSiteArgs,
  Site,
  FileUploadResponse,
  QueryGetSiteImagesArgs,
  SiteChatRoom,
  MutationCreateSiteChatRoomAndMessageArgs,
} from '../../generated/graphql';

import ContactInfos from './ContactInfos';
import IconTextCombo from '../IconTextCombo';
import InfoTabs from './InfoTabs';
import Images from './Images';
import Schedule from './Schedule';
import SubscriptionOptions from './SubscriptionOptions';
import appContext, { NotificationLevel } from '../../context';

const ICON_SIZE = 20;

const GET_CLUB_SPORT_LOCATION = gql`
  query getSite($id: ID!) {
    getSite(id: $id) {
      id
      club {
        name
        logo
      }
      address
      phone
      website
      images
      description
      activities {
        name
        description
        icon
      }
      trainers {
        id
        firstname
        lastname
        displayname
        description
        photo
      }
      schedule {
        title
        day
        fromMinute
        toMinute
      }
    }
  }
`;

const GET_CLUB_SPORT_LOCATION_IMAGES = gql`
  query getSiteImages($id: ID!) {
    getSiteImages(id: $id) {
      file {
        id
        size
        ext
        kind
      }
      url
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation createSiteChatRoomAndMessage($siteId: ID!, $text: String!) {
    createSiteChatRoomAndMessage(siteId: $siteId, text: $text) {
      id
      createdAtRFC3339
    }
  }
`;

const Container = styled(Box)<BoxProps>(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplate: `  \
    '   .           .              .    '  2em   \
    '   .          name            .    '  ${ICON_SIZE}px  \
    '   .           .              .    '  1em   \
    '   .         contact          .    '  auto  \
    '   .           .              .    '  2em   \
    '   .         images           .    '  auto  \
    '   .           .              .    '  2em   \
    '   .       description        .    '  auto  \
    '   .           .              .    '  2em   \
    '   .          info            .    '  auto  \
    '   .           .              .    '  2em   \
    '   .        schedule          .    '  1fr   \
    '   .           .              .    '  2em   \
    '   .      registration        .    '  auto   \
    '   .           .              .    '  2em   \
    '   .        message           .    '  auto   \
    '   .           .              .    '  1em   \
    /   5%         1fr             5%            \
  `,
}));

export type SitePageProps = {
  sx?: SxProps<Theme>;
};

export default function SitePage(props: SitePageProps) {
  const { sx } = props;
  const { id: siteId } = useParams();
  const { notify } = React.useContext(appContext);
  const [messageText, setMessageText] = React.useState('');

  const { data } = useQuery<{ getSite: Site }, QueryGetSiteArgs>(
    GET_CLUB_SPORT_LOCATION,
    {
      skip: !siteId,
      variables: {
        id: siteId || '',
      },
      fetchPolicy: 'no-cache',
    },
  );
  const { data: imagesData } = useQuery<
    { getSiteImages: FileUploadResponse[] },
    QueryGetSiteImagesArgs
  >(GET_CLUB_SPORT_LOCATION_IMAGES, {
    skip: !siteId,
    variables: {
      id: siteId || '',
    },
    fetchPolicy: 'no-cache',
  });
  const [createSiteChatRoomAndMessage] = useMutation<
    { createSiteChatRoomAndMessage: SiteChatRoom },
    MutationCreateSiteChatRoomAndMessageArgs
  >(CREATE_MESSAGE);

  const images: string[] = React.useMemo(
    () =>
      imagesData?.getSiteImages
        .filter((f) => typeof f.url === 'string' && f.url.length > 0)
        .map((f) => f.url as string) || [],
    [imagesData],
  );

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
  };

  const handleSendMessageClick = async () => {
    try {
      if (!messageText || !siteId) return;
      await createSiteChatRoomAndMessage({
        variables: {
          siteId: siteId,
          text: messageText,
        },
      });
      notify({
        level: NotificationLevel.SUCCESS,
        message: 'message sent successfully',
      });
    } catch (e) {
      notify({ level: NotificationLevel.ERROR, message: `${e}` });
    }
  };

  return (
    <Container sx={{ ...sx }}>
      {data?.getSite ? (
        <>
          <Box
            sx={{
              gridArea: 'name',
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <IconTextCombo
              icon={data.getSite.club.logo || undefined}
              size={20}
              text={
                <Typography
                  variant="h6"
                  sx={{
                    lineHeight: `${ICON_SIZE}px`,
                    alignContent: 'center',
                    marginLeft: 1,
                  }}
                >
                  {data.getSite.club.name}
                </Typography>
              }
            />
          </Box>
          <Box
            sx={{
              gridArea: 'contact',
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <ContactInfos
              address={data.getSite.address}
              phone={data.getSite.phone}
              web={data.getSite.website || undefined}
            />
          </Box>
          <Images
            images={images}
            sx={{ gridArea: 'images', height: '100%', width: '100%' }}
          />
          <Box
            sx={{
              gridArea: 'description',
              height: '100%',
              width: '100%',
            }}
          >
            {data.getSite.description}
          </Box>
          <InfoTabs
            sx={{
              gridArea: 'info',
              height: '100%',
              width: '100%',
            }}
            site={data.getSite}
          />
          <Box
            sx={{
              gridArea: 'schedule',
              height: '100%',
              width: '100%',
              display: 'flex',
            }}
          >
            <Schedule
              calendarSpans={data.getSite.schedule}
              sx={{ margin: 'auto' }}
            />
          </Box>
          <Box
            sx={{
              gridArea: 'registration',
              height: '100%',
              width: '100%',
              display: 'flex',
            }}
          >
            <SubscriptionOptions sx={{ margin: 'auto' }} />
          </Box>
          <Box
            sx={{
              gridArea: 'message',
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <TextField
              id="message"
              label="Message"
              variant="outlined"
              value={messageText}
              onChange={handleMessageChange}
              rows={5}
              multiline
            />
            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSendMessageClick}
              >
                Send
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
}

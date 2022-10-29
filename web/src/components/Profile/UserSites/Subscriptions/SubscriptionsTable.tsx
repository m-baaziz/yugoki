import * as React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  SxProps,
  Theme,
  styled,
  tableCellClasses,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  QueryListSubscriptionsBySiteArgs,
  SubscriptionPageInfo,
} from '../../../../generated/graphql';
import dayjs from 'dayjs';

const SUBSCRIPTION_PAGE_SIZE = 10000;

const LIST_SUBSCRIPTIONS = gql`
  query listSubscriptionsBySite($siteId: ID!, $first: Int!, $after: String) {
    listSubscriptionsBySite(siteId: $siteId, first: $first, after: $after) {
      subscriptions {
        id
        createdAtRFC3339
        subscriptionOption {
          title
          price
        }
        subscriberDetails {
          firstname
          lastname
          gender
          dateOfBirth
          email
        }
      }
      hasNextPage
      endCursor
    }
  }
`;

export type SubscriptionsTableProps = {
  siteId: string;
  sx?: SxProps<Theme>;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const formatDateOfBirth = (isoDate: string) => {
  const dayjsValue = dayjs(isoDate);
  return dayjsValue.isValid() ? dayjsValue.format('DD/MM/YYYY') : 'N/A';
};

export default function SubscriptionsTable(props: SubscriptionsTableProps) {
  const { siteId, sx } = props;

  const { data: subscriptionsData } = useQuery<
    { listSubscriptionsBySite: SubscriptionPageInfo },
    QueryListSubscriptionsBySiteArgs
  >(LIST_SUBSCRIPTIONS, {
    skip: !siteId,
    variables: {
      siteId: siteId || '',
      first: SUBSCRIPTION_PAGE_SIZE,
      after: '',
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <Box sx={{ ...sx }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="subscriptions table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Plan</StyledTableCell>
              <StyledTableCell align="left">First name</StyledTableCell>
              <StyledTableCell align="left">Last name</StyledTableCell>
              <StyledTableCell align="left">Date of birth</StyledTableCell>
              <StyledTableCell align="left">E-mail</StyledTableCell>
              <StyledTableCell align="left">Registration date</StyledTableCell>
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptionsData?.listSubscriptionsBySite.subscriptions.map(
              (subscription, i) => (
                <StyledTableRow key={subscription.id || i}>
                  <StyledTableCell component="th" scope="row">
                    {subscription.subscriptionOption.title}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {subscription.subscriberDetails.firstname}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {subscription.subscriberDetails.lastname}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {formatDateOfBirth(
                      subscription.subscriberDetails.dateOfBirth,
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {subscription.subscriberDetails.email}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {subscription.createdAtRFC3339}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Link
                      to={`${subscription.subscriptionOption.id}/${subscription.id}`}
                    >
                      view
                    </Link>
                  </StyledTableCell>
                </StyledTableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

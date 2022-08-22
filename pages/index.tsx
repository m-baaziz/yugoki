import React from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { Box, BoxProps, Button, TextField, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import sports, { Sport } from "./_sports";
import { grey } from "@mui/material/colors";

const SEARCH_DELAY_MS = 500;

const Container = styled(Box)<BoxProps>(() => ({
  width: "100%",
  height: "100%",
  display: "grid",
  gridTemplate:
    "  \
    '   .        .         .    '  1em  \
    '   .      search      .    '  auto \
    '   .        .         .    '  4em  \
    '   .      list        .    '  auto  \
    '   .        .         .    '  3em  \
    '   .      title       .    '  auto \
    '   .        .         .    '  1em  \
    '   .   description    .    '  auto \
    '   .        .         .    '  1fr  \
    '   .     select       .    '  auto \
    '   .        .         .    '  2em  \
    /  10%      1fr       10%           \
  ",
}));

const SearchContainer = styled(Box)<BoxProps>(() => ({
  width: "100%",
  display: "flex",
  alignItems: "flex-end",
  gridArea: "search",
}));

const filterSport: (search: string) => (sport: Sport) => boolean =
  (search: string) => (sport: Sport) => {
    return (
      search.length === 0 ||
      sport.id.includes(search) ||
      sport.title.includes(search) ||
      sport.tags.some((tag) => tag.includes(search))
    );
  };

const Home: NextPage = () => {
  const [selectedSport, setSelectedSport] = React.useState<Sport | undefined>(
    undefined
  );
  const [search, setSearch] = React.useState<string>("");
  const [searchInputValue, setSearchInputValue] = React.useState<string>("");
  const [searchTimeout, setSearchTimeout] = React.useState<
    NodeJS.Timeout | undefined
  >(undefined);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setSearchInputValue(value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      setSearch(value);
    }, SEARCH_DELAY_MS);
    setSearchTimeout(timeout);
  };

  const filteredSports = React.useMemo(
    () => sports.filter(filterSport(search)),
    [search]
  );

  console.log(filteredSports);

  return (
    <Container>
      <SearchContainer>
        <Search sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          id="input-with-sx"
          variant="standard"
          fullWidth
          value={searchInputValue}
          onChange={handleSearchChange}
        />
      </SearchContainer>
      <Box
        sx={{
          gridArea: "list",
          display: "grid",
          width: "100%",
          gridTemplateColumns: "repeat(auto-fill, 80px)",
          placeContent: "space-between",
          gridGap: "10px 10px",
        }}
      >
        {filteredSports.map((sport) => (
          <Button
            key={sport.id}
            onClick={() => {
              setSelectedSport(sport);
            }}
            aria-label={sport.id}
            variant="outlined"
            sx={{
              borderColor:
                selectedSport?.id === sport.id ? "default" : grey["300"],
            }}
          >
            <Image
              src={`/sport_icons/80/${sport.id}.png`}
              alt={sport.title}
              width={80}
              height={80}
            />
          </Button>
        ))}
      </Box>
      <Typography
        variant="h2"
        sx={{ gridArea: "title", placeSelf: "center" }}
        component="div"
      >
        {selectedSport?.title}
      </Typography>
      <Typography sx={{ gridArea: "description" }} component="div">
        {selectedSport?.description}
      </Typography>
      {selectedSport ? (
        <Box sx={{ gridArea: "select", placeSelf: "center" }}>
          <Button variant="contained">Select</Button>
        </Box>
      ) : null}
    </Container>
  );
};

export default Home;

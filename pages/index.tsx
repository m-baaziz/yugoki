import type { NextPage } from "next";

import { styled } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";

const Container = styled(Box)<BoxProps>(() => ({
  width: "100%",
  height: "100%",
}));

const Home: NextPage = () => {
  return <Container>Yugoki Home</Container>;
};

export default Home;

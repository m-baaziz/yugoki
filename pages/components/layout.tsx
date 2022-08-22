import { styled } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";
import React from "react";
import Head from "next/head";

const Container = styled(Box)<BoxProps>(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

export default function Layout(props: React.PropsWithChildren) {
  const { children } = props;
  return (
    <>
      <Head>
        <title>Yugoki</title>
        <meta name="description" content="Sport clubs ultimate platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}

export default {
  tokenCacheKey: 'token',
  grapqlEndpoint:
    window.location.hostname === 'localhost'
      ? `http://localhost:4000`
      : 'https://78olipvptk.execute-api.eu-west-3.amazonaws.com/dev/api',
  wsEndpoint: 'wss://fz3qt1zaf1.execute-api.eu-west-3.amazonaws.com/dev',
};

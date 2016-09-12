export const CALLS_LIMIT = 25;
export const FILES_ENDPOINT = '/files';
export const PROXY_RULES = [
  {
    autoProxy: true,
    proxy: ['http://localhost:8082/apps/azteca/servlets/opta'],
  },
];

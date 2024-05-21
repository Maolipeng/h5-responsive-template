/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/game/': {
      // target: 'http://yapi.adrd.sohuno.com/mock/62',
      // target: 'http://127.0.0.1:4523/m1/4370019-0-default',
      // target: 'http://10.18.70.63:12422',
      // target: 'http://10.18.39.173:891',
      target: 'http://10.18.70.63:12422/',
      changeOrigin: true,
    },
    '/mock/': {
      target: 'http://yapi.adrd.sohuno.com/mock/62',
      changeOrigin: true,
      pathRewrite: { '/mock/': '' },
    },
  },
};

export const ENV_MAP: Record<string, string> = {
  development: 'dev',
  test: 'test',
};

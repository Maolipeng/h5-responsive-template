import { defineConfig } from 'umi';
import proxy, { ENV_MAP } from './config/proxy';

export default defineConfig({
  routes: [
    { path: '/', redirect: '/question' },
    { path: '/home', component: 'Home' },
    { path: '/question', component: 'QuestionAnswer' },
    { path: '/reward', component: 'Reward' },
  ],

  npmClient: 'pnpm',
  tailwindcss: {},
  model: {},
  clickToComponent: {},
  plugins: [
    '@umijs/plugins/dist/tailwindcss',
    '@umijs/plugins/dist/request',
    '@umijs/plugins/dist/model',
    '@umijs/plugins/dist/valtio',
  ],
  request: {},
  valtio: {},
  // 下面两行代码为了兼容老系统，呜呜
  targets: {
    chrome: 49,
    firefox: 45,
    safari: 10,
    edge: 13,
    ios: 7,
  },
  legacy: {},
  proxy: (proxy as any)[ENV_MAP[process.env.NODE_ENV as any]],
  extraPostCSSPlugins: [
    // require('postcss-pxtorem')({
    //   rootValue: 50,
    //   minPixelValue: 2,
    //   propList: ['*'],
    // }),
    require('postcss-px-to-viewport')({
      unitToConvert: 'px', // 要转化的单位
      viewportWidth: 375, // UI设计稿的宽度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
      selectorBlackList: [], // 指定不转换为视窗单位的类名，
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
      replace: true, // 是否转换后直接更换属性值
      exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
      landscape: false, // 是否处理横屏情况
    }),
  ],
});

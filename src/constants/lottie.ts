import answerJson from '../../public/lottie-duihua/data.json';
import rewordJson from '../../public/lottie/data.json';

console.log('answerJson-util', answerJson);
export const handleLottieAssetsPath = (json: any, path: string) => {
  const lottieConf = JSON.parse(JSON.stringify(json));
  lottieConf.assets.forEach((item: any) => {
    if (item.u) {
      item.u = `/${path}/${item.u}`;
    }
  });
  return lottieConf;
};
export const answerLottieConf = handleLottieAssetsPath(
  answerJson,
  'lottie-duihua',
);
export const rewordLottieConf = handleLottieAssetsPath(rewordJson, 'lottie');

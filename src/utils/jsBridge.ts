// @ts-nocheck

// 请求广告
import { isIOS } from './index';

// 展示广告
function showRewardAd() {
  if (isIOS()) {
    window.webkit.messageHandlers.showRewardAd.postMessage({});
  } else {
    rewardAdApi.showRewardAd();
  }
} // 获取cid
function getCid() {
  if (isIOS()) {
    window.getCidCallback = function (response) {
      window.cid = response.cid;
    };
    window.webkit.messageHandlers.rewardAdGetClientInfo.postMessage(
      { callBack: 'getCidCallback' },
      function (response) {
        window.InjectResponse = response;
      },
    );
  } else {
    const response = rewardAdApi.rewardAdGetClientInfo();
    const data = JSON.parse(response);
    window.InjectResponse = data;
    window.cid = data.cid;
  }
}
// 请求广告
function requestAd() {
  if (isIOS()) {
    window.webkit.messageHandlers.requestRewardAd.postMessage({});
  } else {
    rewardAdApi.requestRewardAd();
  }
}

// 广告关闭后是否激励成功
function rewardAdCloseWithSuccess(res) {
  return res;
}

export default {
  getCid,
  requestAd,
  showRewardAd,
  rewardAdCloseWithSuccess,
};

export const generateAnswerPercent = (
  questionNumber: number,
  initPercent: number = 50,
): number => {
  // 初始百分比
  let percentageNum = initPercent;

  console.log('questionNumber', questionNumber);

  // 从第六题开始增加百分比
  if (questionNumber >= 6) {
    // 计算增加百分比的回合数，每3题增加一次
    // 判断是否达到增加百分比的题目
    if ((questionNumber - 6) % 3 === 0) {
      let increase = 0;
      if (percentageNum < 95) {
        // 如果小于95%，每次增加3%到6%
        increase = Math.random() * 3 + 3;
      } else if (percentageNum < 99.9) {
        // 每次增加 0.1-0.2
        increase = Math.random() * 0.1 + 0.1;
      }
      console.log('increase', increase);

      // 累加到当前回合
      percentageNum = Math.min(percentageNum + increase, 99.9);
    }
  }

  console.log(
    `答得题目：${questionNumber} 当前提示百分比为：${percentageNum.toFixed(
      2,
    )}%`,
  );
  return percentageNum;
};

// reward页面生成百分比
export const generateRewardPercent = (
  num: number,
  intialStore: number = 60,
  increaseStore?: number,
): number => {
  const increasePercent = increaseStore || 5;
  const intialPercent = intialStore || 60;
  // 如果答对题的题号num小于等于6，则奖励为60%
  if (num <= 6) {
    return intialPercent;
  } else {
    // 如果答对题的题号num大于等于5，则奖励为60%+5%*（num-6）,但必须满足差额是3的倍数的时候才开始增加，否则保持原值
    const addStore = Math.floor((num - 6) / 3) * increasePercent;
    console.log('addStore', addStore);
    return intialPercent + addStore > 100 ? 100 : intialPercent + addStore;
  }
};

/**
 * 判断是否为iOS设备
 * @returns {Boolean} 是否为iOS设备
 */
export const isIOS = () => {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
};
/**
 * 判断是否为android设备
 * @returns {Boolean} 是否为android设备
 */
export const isAndroid = () => {
  const ua = navigator.userAgent.toLowerCase();
  return /android/.test(ua);
};

export const isWebkitMessageHandlersPresent = () => {
  //@ts-ignore
  return (
    typeof window !== 'undefined' &&
    window.webkit &&
    window.webkit.messageHandlers
  );
};
export const isAndroidInject = () => {
  //@ts-ignore
  return typeof window.rewardAdApi !== 'undefined';
};

/**
 * 判断是否为跨端
 * @returns {Boolean} 是否为跨端
 */
export const isHybridApp = () => {
  return (
    (isIOS() && isWebkitMessageHandlersPresent()) ||
    (isAndroid() && isAndroidInject())
  );
};

// 定义一个名为 formatNumber 的函数，接受一个 number 类型的参数 num
export const formatNumber = (num: number) => {
  // 将数字四舍五入到小数点后两位
  let roundedNum = num.toFixed(2);

  // 去除尾随的零
  roundedNum = roundedNum.replace(/\.?0+$/, '');

  // 返回处理后的数字字符串
  return roundedNum;
};

export const getIOSVersion = () => {
  const userAgent = navigator.userAgent;
  const iosRegex = /OS (\d+)[_\d]* like Mac OS X/i;
  const iosVersionMatch = userAgent.match(iosRegex);

  if (iosVersionMatch) {
    return parseInt(iosVersionMatch[1], 10);
  } else {
    return 0;
  }
};

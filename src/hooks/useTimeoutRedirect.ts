import { useEffect, useState } from 'react';
import { history } from 'umi';

type UseTimeoutRedirectOptions = {
  timeoutThreshold: number;
  redirectTo: string;
  onRedirect?: () => void; // 定义一个可选的回调函数，用于在跳转前执行
};

function useTimeoutRedirect({
  timeoutThreshold,
  redirectTo,
  onRedirect,
}: UseTimeoutRedirectOptions) {
  // 使用useState来存储定时器ID
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  // 定义一个函数来处理页面可见性变化
  const handleVisibilityChange = () => {
    const isHidden = document.visibilityState === 'hidden';
    console.log('isHidden', isHidden);
    if (isHidden && !timerId) {
      // 如果页面不可见且没有定时器，则启动定时器
      const newTimerId = setTimeout(() => {
        console.log('document.visibilityState', document.visibilityState);
        if (document.visibilityState === 'hidden' && onRedirect) {
          // 如果提供了回调函数，则在跳转前执行它
          onRedirect();
        }
        // 执行跳转
        // window.location.href = redirectTo;
        history.push(redirectTo);
      }, timeoutThreshold);
      setTimerId(newTimerId);
    } else if (!isHidden && timerId) {
      console.log('如果页面变为可见且存在定时器，则清除定时器');
      // 如果页面变为可见且存在定时器，则清除定时器
      clearTimeout(timerId);
      setTimerId(null);
    } else {
      console.log('如果页面变为可见且不存在定时器，则不执行任何操作');
    }
  };

  useEffect(() => {
    // 页面变为可见时，添加事件监听器
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 页面不可见时，启动定时器
    if (document.visibilityState === 'hidden') {
      const newTimerId = setTimeout(() => {
        if (onRedirect) {
          onRedirect();
        }
        console.log('redirectTo', redirectTo);
        // window.location.href = redirectTo;
        history.push(redirectTo);
      }, timeoutThreshold);
      setTimerId(newTimerId);
    }

    // 清理函数，用于清除定时器和事件监听器
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timeoutThreshold, redirectTo, onRedirect]);

  return { timerId };
}

export default useTimeoutRedirect;

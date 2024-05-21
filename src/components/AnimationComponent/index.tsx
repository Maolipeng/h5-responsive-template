import lottie from 'lottie-web';
import React, { useEffect, useRef } from 'react';

interface LottieControlProps {
  animationData: object; // 动画JSON数据
  autoPlay?: boolean; // 组件挂载后是否自动播放
  loop?: boolean; // 是否循环播放动画
  onSegmentComplete?: () => void; // 段落播放完毕后的回调函数
  children?: React.ReactNode; // 子组件
}

const LottieControl: React.FC<LottieControlProps> = ({
  animationData,
  autoPlay = false,
  loop = false,
  onSegmentComplete,
  children,
}) => {
  // const [isPaused, setIsPaused] = useState(!autoPlay);
  const lottieRef = useRef<HTMLDivElement>(null);
  const animationInstance = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current) {
      animationInstance.current = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: 'svg',
        loop: loop,
        autoplay: autoPlay,
        animationData,
      });

      if (onSegmentComplete) {
        animationInstance.current.addEventListener('complete', () => {
          onSegmentComplete();
        });
      }
    }

    return () => {
      if (animationInstance.current) {
        animationInstance.current.destroy(); // Make sure to destroy Lottie on unmount
      }
    };
  }, [animationData, autoPlay, loop, onSegmentComplete]);

  // 控制动画播放或暂停
  // const togglePlay = () => {
  //   if (isPaused) {
  //     animationInstance.current.play();
  //   } else {
  //     animationInstance.current.pause();
  //   }
  //   setIsPaused(!isPaused);
  // };

  return (
    <div style={{ position: 'relative' }}>
      <div ref={lottieRef} />
      {children && (
        // <div style={{ position: 'absolute', top: '120px', left: '130px' }}>
        <div>{children}</div>
      )}
    </div>
  );
};

export default LottieControl;

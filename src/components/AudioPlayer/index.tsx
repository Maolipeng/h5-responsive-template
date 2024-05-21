import { getStateActions, getStoreState } from '@/store';
import { FC, useEffect, useRef } from 'react';

import PauseBtn from '@/assets/pause-music.svg';
import PlayBtn from '@/assets/play-music.svg';
import { useSnapshot } from 'umi';

interface AudioPlayerProps {
  src: string;
  className?: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ src, className = '' }) => {
  const appState = getStoreState({ module: 'app' });
  const { isPlayingBgm, firstTogglePlay } = useSnapshot(appState as any);

  const { changeIsPlayingBgm } = getStateActions({
    module: 'app',
    actions: ['changeIsPlayingBgm'],
  });
  // const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    console.log('Toggle play');
    changeIsPlayingBgm(!isPlayingBgm);
  };
  useEffect(() => {
    let handleVisibilityChange = null;
    if (audioRef) {
      handleVisibilityChange = () => {
        const isVisible = document.visibilityState === 'visible';
        console.log('Visibility state changed to:', isVisible);
        if (!isVisible) {
          audioRef.current?.pause();
        } else {
          if (isPlayingBgm) {
            audioRef.current?.pause();
            audioRef.current?.play();
          } else {
            audioRef.current?.pause();
          }
        }
      };
      // 页面变为可见时，添加事件监听器
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    // 清理函数，用于清除定时器和事件监听器
    return () => {
      if (handleVisibilityChange) {
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange,
        );
      }
    };
  }, [audioRef, isPlayingBgm]);
  useEffect(() => {
    if (!firstTogglePlay) {
      if (isPlayingBgm) {
        audioRef.current?.play();
      } else {
        audioRef.current?.pause();
      }
    }
  }, [isPlayingBgm, audioRef, firstTogglePlay]);

  return (
    <div className={className}>
      <audio ref={audioRef} loop src={src} />
      <span onClick={togglePlay}>
        {isPlayingBgm ? (
          <img src={PlayBtn} alt="play" />
        ) : (
          <img src={PauseBtn} alt="pause" />
        )}
      </span>
    </div>
  );
};

export default AudioPlayer;

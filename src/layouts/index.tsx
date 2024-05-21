import AudioPlayer from '@/components/AudioPlayer';
import { Outlet } from 'umi';
import styles from './index.less';
// import BackHome from '@/assets/home.svg';

export default function Layout() {
  return (
    <div className={styles.navs}>
      <div className={styles.header}>
        {/* <div className={styles.backHome}>
        <img src={BackHome} alt="home" />
      </div> */}
        <AudioPlayer src="/audio/bgm.mp3" className={styles.audioPlayer} />
      </div>
      <Outlet />
    </div>
  );
}

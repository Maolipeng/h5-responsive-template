import { getTopics, unLockTopicsApi } from '@/api';
import CustomModal from '@/components/CustomModal';
import useLocationQuery from '@/hooks/useLocationQuery';
import { getStateActions, getStoreState } from '@/store';
import { isHybridApp } from '@/utils';
import jsBridge from '@/utils/jsBridge';
import { Toast } from 'antd-mobile';
import * as React from 'react';
import { history, useSnapshot } from 'umi';
import styles from './index.less';
const { useMemo, useState, useEffect } = React;

export type Topic = {
  topicId: number;
  topicTitle: string;
  desc: string;
  isLock: boolean;
};
const Home = () => {
  const query = useLocationQuery();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const appState = getStoreState({ module: 'app' });
  const storeSnapshot = useSnapshot(appState as any);
  console.log('storeSnapshot', storeSnapshot);
  const {
    changeCurrentTopic,
    changeIsPlayingBgm,
    changeTopicList,
    resetChangeTopic,
  } = getStateActions({
    module: 'app',
    actions: [
      'changeCurrentTopic',
      'changeIsPlayingBgm',
      'changeTopicList',
      'resetChangeTopic',
    ],
  });

  const fetchTopics = async () => {
    const { code, data } = await getTopics({
      defaultTopic: query.defaultTopic || '1',
      // @ts-ignore
      cid: window.cid,
    });
    if (code === 0) {
      console.log('data', data);
      changeTopicList(data);
      setTopics(data);
    }
  };
  useEffect(() => {
    changeCurrentTopic(query.defaultTopic || '1');
    fetchTopics();
  }, []);
  const handleTopicClick = (val: Topic) => {
    const { isLock, topicId: topicId } = val;
    console.log('Topicxxxx', topicId);
    if (isLock) {
      if (isHybridApp()) {
        jsBridge.requestAd();
      }
      setModalVisible(true);
    } else {
      resetChangeTopic();
      changeCurrentTopic(topicId);
      history.push(`/question`);
    }
  };
  const topicList = useMemo(() => {
    return (
      <div className={styles.topicList}>
        {topics.map((item) => (
          <div
            key={item.topicId}
            onClick={() => handleTopicClick(item)}
            className={styles.topicItem}
            style={{
              backgroundImage: `url(${
                item.isLock
                  ? require('@/assets/lockBg.png')
                  : require('@/assets/unlockBg.png')
              })`,
              color: item.isLock ? '#B3B3B3' : '#fff',
            }}
          >
            {item.topicTitle}
          </div>
        ))}
      </div>
    );
  }, [topics]);
  const unLockTopics = async () => {
    if (isHybridApp()) {
      if (appState.isPlayingBgm) {
        changeIsPlayingBgm(false, false);
      }
      jsBridge.showRewardAd();
      window.rewardAdCloseWithSuccess = async (response: any) => {
        console.log('rewardAdCloseWithSuccess-bridge', response);
        if (appState.preIsPlayingBgm) {
          changeIsPlayingBgm(true, false);
        }
        if (response) {
          //@ts-ignore
          const { code } = await unLockTopicsApi({ cid: window.cid });
          if (code === 0) {
            Toast.show({
              icon: 'success',
              content: '解锁成功',
            });
            setModalVisible(false);
            fetchTopics();
          } else {
            Toast.show({
              icon: 'fail',
              content: '解锁失败',
            });
          }
        } else {
          jsBridge.requestAd();
          Toast.show({
            icon: 'fail',
            content: '解锁失败',
          });
        }
      };
    } else {
      //@ts-ignore
      const { code } = await unLockTopicsApi({ cid: window.cid });
      if (code === 0) {
        Toast.show({
          icon: 'success',
          content: '解锁成功',
        });
        setModalVisible(false);
      }
    }
  };
  return (
    <div className={styles.homeWrap}>
      <div className={styles.homeTitle}>选择主题</div>
      <div className={styles.homeContent}>{topicList}</div>
      <CustomModal
        visible={modalVisible}
        setVisible={setModalVisible}
        modalTitle="看视频解锁全部主题"
        modalDesc="每日观看1次视频"
        onConfirm={unLockTopics}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
};

export default Home;

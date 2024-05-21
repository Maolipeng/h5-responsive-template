import LottieControl from '@/components/AnimationComponent';
import { rewordLottieConf } from '@/constants';
import { getStateActions, getStoreState } from '@/store';
import React from 'react';
import { history, useSnapshot } from 'umi';
import './index.less';
const Reward: React.FC = () => {
  const appState = getStoreState({ module: 'app' });
  const { currentQuesNum } = useSnapshot(appState as any);
  const score: number = appState.rewardPercentNum as number;
  console.log(score, 'score');
  console.log(currentQuesNum, 'currentQuesNum');
  const { resetChangeTopic } = getStateActions({
    module: 'app',
    actions: ['resetChangeTopic'],
  });
  const retryTheSameTopic = () => {
    resetChangeTopic();
    history.push('/question');
  };
  const changeTopicPlay = () => {
    resetChangeTopic();
    history.push('/home');
  };
  return (
    <div className="reward-wrapper">
      <div className="reward-img h-[300px]">
        {rewordLottieConf && (
          <LottieControl autoPlay animationData={rewordLottieConf} />
        )}
      </div>
      <div className="reward-text">
        超过<span className="reward-img-score">{score}%</span>玩家
      </div>
      <div className="reward-btn-wrapper">
        <div
          onClick={retryTheSameTopic}
          className="reward-btn reward-btn-retry"
          style={{
            background: 'linear-gradient(180deg, #3f74ff 0%, #7aafff 100%)',
          }}
        >
          再来一次
        </div>
        <div
          onClick={changeTopicPlay}
          className="reward-btn reward-btn-change-topic"
        >
          换个主题
        </div>
      </div>
    </div>
  );
};

export default Reward;

import { Topic } from '@/pages/Home';
import { isHybridApp } from '@/utils';
import { proxy } from 'umi';

const state = proxy({
  currentTopic: 1,
  topicList: [] as Topic[],
  answerCount: 0,
  rescueTimes: 0,
  answerErrCount: 0,
  remainingRescueCount: 2,
  currentQuesNum: 1,
  preIsPlayingBgm: false,
  isPlayingBgm: false,
  firstTogglePlay: true,
  rewardPercentNum: 0,
});
const actions = {
  changeCurrentTopic(v: number) {
    state.currentTopic = v;
  },
  resetChangeTopic() {
    state.remainingRescueCount = 2;
  },
  changeRewardPercentNum(v: number) {
    state.rewardPercentNum = v;
  },
  changeTopicList(v: Topic[]) {
    state.topicList = v;
  },
  changeIsPlayingBgm(v: boolean, isChangePre: boolean = true) {
    if (state.firstTogglePlay) {
      state.firstTogglePlay = false;
    }
    if (isHybridApp() && isChangePre) {
      state.preIsPlayingBgm = v;
    }
    state.isPlayingBgm = v;
  },
  changeCurrentQuesNum(v: number) {
    state.currentQuesNum = v;
  },
  addAnswerCount() {
    state.answerCount += 1;
  },
  addRescueTimes() {
    state.rescueTimes += 1;
  },
  addAnswerErrCount() {
    state.answerErrCount += 1;
  },
  reduceRescueCount() {
    state.remainingRescueCount -= 1;
  },
  // async getUserInfoAsync(val: string): Promise<void> {

  // },
};

export default {
  state,
  ...actions,
};

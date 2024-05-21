import type { Option, Question } from '@/components/Question';
import QuestionComponent from '@/components/Question';
import useTimeoutRedirect from '@/hooks/useTimeoutRedirect';
import { useCallback, useEffect, useRef, useState } from 'react';
import { history, useSnapshot } from 'umi';

import {
  Options,
  RQuestionData,
  getQuestionsByTopicId,
  postErrQuestionId,
  submitAnswerCount,
} from '@/api';
import LottieControl from '@/components/AnimationComponent';
import CustomModal from '@/components/CustomModal';
import { getStateActions, getStoreState } from '@/store';
import {
  formatNumber,
  generateAnswerPercent,
  getIOSVersion,
  isHybridApp,
} from '@/utils';
import jsBridge from '@/utils/jsBridge';

import { answerLottieConf } from '@/constants';
import { Toast } from 'antd-mobile';
import classNames from 'classnames';
import styles from './index.less';
type QuestionInfo = {
  question: Question;
  options: Option[];
  answer: string;
  topicId: number;
  questionId: number;
  gameUniqueId: string;
};
const iosVersion = getIOSVersion();
console.log('iosVersion', iosVersion);

const QuestionAnswer = () => {
  const [isPlay, setPlay] = useState<boolean>(false);
  const [isAnwserTrue, setIsAnwerTrue] = useState<boolean>(false);
  const [questionList, setQuestionList] = useState<QuestionInfo[]>([]);
  const byPercentRef = useRef<number>(Math.floor(Math.random() * 11 + 50));
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const appState = getStoreState({ module: 'app' });
  const timerRef = useRef<any>();
  const { currentTopic, remainingRescueCount, topicList } = useSnapshot(
    appState as any,
  );
  const {
    reduceRescueCount,
    changeCurrentQuesNum,
    changeIsPlayingBgm,
    changeCurrentTopic,
    changeRewardPercentNum,
  } = getStateActions({
    module: 'app',
    actions: [
      'reduceRescueCount',
      'changeCurrentQuesNum',
      'changeIsPlayingBgm',
      'changeCurrentTopic',
      'changeRewardPercentNum',
    ],
  });
  console.log('currentTopic', currentTopic);
  const questionComponentRef = useRef<any>(null!);
  useEffect(() => {
    (async () => {
      try {
        const { code, data } = await getQuestionsByTopicId({
          topicId: currentTopic,
        });
        if (code === 0) {
          const list = data.map((item: RQuestionData, index) => {
            const {
              topicTitle: category,
              desc: questions,
              questionId,
              gameUniqueId,
              topicId,
            } = item;
            const { question, options: optionsMap, answer } = questions;
            const options = Object.keys(optionsMap).map((key) => ({
              label: optionsMap[key as keyof Options],
              value: key,
            }));
            return {
              question: {
                category,
                number: index + 1,
                text: question,
              },
              options,
              answer,
              questionId,
              gameUniqueId,
              topicId,
            };
          });
          setQuestionList(list);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [currentTopic]);
  // 定义跳转前的回调函数
  const beforeRedirect = useCallback(() => {
    console.log('执行了一些额外的操作');
    changeCurrentTopic(topicList[0]?.topicId);
    setCurrentIndex(0);
    // 可以在这里执行一些额外的逻辑，比如记录日志、发送统计信息等
  }, []);
  useTimeoutRedirect({
    timeoutThreshold: 10 * 60 * 1000,
    redirectTo: '/question',
    onRedirect: beforeRedirect,
  });

  useEffect(() => {
    changeCurrentQuesNum(currentIndex + 1);
  }, [currentIndex]);

  const handleAnswerCorrect = () => {
    // 当用户答对时，加载下一道题目
    setIsAnwerTrue(true);
    if (currentIndex + 1 < questionList.length) {
      setCurrentIndex(
        (prevQuestion) => (prevQuestion + 1) % questionList.length,
      );

      const anwserResultMsg = generateAnswerPercent(
        currentIndex + 1,
        byPercentRef.current,
      );
      // 大于等于第6道题时才会显示
      if (currentIndex >= 5) {
        byPercentRef.current = anwserResultMsg;
      }
      console.log('byPercentRef.current', byPercentRef.current);
      changeRewardPercentNum(formatNumber(byPercentRef.current));
    } else {
      // alert('您答题已经完成');
      const currentQuestion = questionList[currentIndex];
      const { topicId, gameUniqueId } = currentQuestion;
      submitAnswerCount({
        cid: window.cid,
        topicId,
        answerCount: currentIndex + 1,
        gameUniqueId,
      });
      history.push('/reward');
    }
  };
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, [timerRef.current]);
  const onAnswerWrong = async (option: string) => {
    changeRewardPercentNum(formatNumber(byPercentRef.current));
    if (currentIndex + 1 === questionList.length) {
      setTimeout(() => {
        const currentQuestion = questionList[currentIndex];
        const { topicId, gameUniqueId } = currentQuestion;
        submitAnswerCount({
          cid: window.cid,
          topicId,
          answerCount: currentIndex + 1,
          gameUniqueId,
        });
        history.push('/reward');
      }, 1000);
      return;
    }
    try {
      const currentQuestion = questionList[currentIndex];
      const { questionId, topicId, gameUniqueId } = currentQuestion;
      await postErrQuestionId({
        cid: window.cid,
        questionId,
        topicId,
        wrongAnswer: option,
        gameUniqueId,
      });
    } catch (error) {
      console.log(error);
    }
    setIsAnwerTrue(false);
    clearTimer();

    // 剩余复活次数大于0时，弹出提示框
    if (remainingRescueCount > 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        if (isHybridApp()) {
          jsBridge.requestAd();
        }
        setModalVisible(true);
      }, 1000);
    } else {
      history.push('/reward');
    }
  };
  useEffect(() => {
    // console.log('rewordJson', rewordJson)
    // setAnimationData(rewordJson)
    return () => {
      clearTimer();
    };
  }, []);
  useEffect(() => {
    if (isAnwserTrue && currentIndex >= 5 && (currentIndex + 1) % 3 === 0) {
      setPlay(true);
    } else {
      setPlay(false);
    }
  }, [isAnwserTrue, currentIndex]);
  const confirmRescume = () => {
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
          setModalVisible(false);
          reduceRescueCount();
          setCurrentIndex((pre) => pre + 1);
          questionComponentRef?.current.applyUseRescueRetry();
          Toast.show({
            icon: 'success',
            content: '解锁成功',
          });
        } else {
          jsBridge.requestAd();
          Toast.show({
            icon: 'fail',
            content: '解锁失败',
          });
          history.push('/reward');
          // setModalVisible(true);
        }
      };
    } else {
      setModalVisible(false);
      reduceRescueCount();
      questionComponentRef?.current.applyUseRescueRetry();
    }
  };
  const cancelRescume = () => {
    setModalVisible(false);
    const currentQuestion = questionList[currentIndex];
    const { topicId, gameUniqueId } = currentQuestion;
    submitAnswerCount({
      cid: window.cid,
      topicId,
      answerCount: currentIndex + 1,
      gameUniqueId,
    });
    history.push('/reward');
  };

  const currentQuestions = questionList?.[currentIndex];

  return (
    <div>
      {currentQuestions && (
        <QuestionComponent
          ref={questionComponentRef}
          question={currentQuestions.question}
          options={currentQuestions.options}
          correctAnswer={currentQuestions.answer}
          onAnswerCorrect={handleAnswerCorrect}
          onAnswerWrong={onAnswerWrong}
        />
      )}
      <CustomModal
        visible={modalVisible}
        setVisible={setModalVisible}
        confirmText="继续答题"
        modalTitle="解锁复活功能"
        modalDesc={`最多${remainingRescueCount}次复活机会`}
        onConfirm={confirmRescume}
        onCancel={cancelRescume}
      />
      <div
        style={{
          // position: 'fixed',
          // bottom: '0px',
          // left: '0',
          width: '100%',
          // height: '240px',
          marginTop: '-40px',
          zIndex: '100000',
          pointerEvents: 'none',
        }}
      >
        {isPlay && (
          <LottieControl autoPlay animationData={answerLottieConf}>
            <div
              className="bg-no-repeat bg-contain bg-center w-[245px] h-[105px]"
              style={{
                position: 'absolute',
                top: '98px',
                left: '20px',
                backgroundImage: `url(${require('@/assets/glk.png')})`,
              }}
            >
              <div className={classNames(styles.rewardText, 'mt-[10px]')}>
                已超过
                <span className={styles.rewardNum}>
                  {formatNumber(byPercentRef.current)}%
                </span>
                的玩家，请继续努力！！！
              </div>
              {/* <div className={styles.rewardText}>请继续努力！！！</div> */}
            </div>
          </LottieControl>
        )}
      </div>
    </div>
  );
};

export default QuestionAnswer;

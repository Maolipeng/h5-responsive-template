import BackHome from '@/assets/home.svg';
import { Button } from 'antd-mobile';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { history } from 'umi';

import { getStateActions } from '@/store';
import './index.less';

export type Question = {
  category: string;
  number: number;
  text: string;
};

export type Option = {
  label: string;
  value: string;
};

type QuestionComponentProps = {
  question: Question;
  options: Option[];
  correctAnswer: string;
  onAnswerCorrect: () => void; // 答对时的回调函数
  onAnswerWrong: (v: string) => void; // 答错时的回调函数
};
// // 答对音效
const correctSound = new Audio('/audio/correct.mp3');
// // 答错音效
const wrongSound = new Audio('/audio/err.mp3');

const QuestionComponent: React.ForwardRefRenderFunction<
  unknown,
  QuestionComponentProps
> = (
  { question, options, correctAnswer, onAnswerCorrect, onAnswerWrong },
  ref,
) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null!);
  const applyUseRescueRetry = () => {
    setSelectedOption(null);
  };

  useImperativeHandle(ref, () => ({
    applyUseRescueRetry,
  }));
  const { resetChangeTopic } = getStateActions({
    module: 'app',
    actions: ['resetChangeTopic'],
  });

  const handleOptionClick = (option: string) => {
    console.log('selectedOption', selectedOption);
    if (!selectedOption) {
      setSelectedOption(option);
      if (option === correctAnswer) {
        correctSound.play();
        // 异步保持控制
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          // 答对后调用回调函数
          // 重置选择状态
          onAnswerCorrect();
          setSelectedOption(null);
        }, 1000);
      } else {
        wrongSound.play();
        // 答错时显示弹窗
        onAnswerWrong(option);
      }
    }
  };
  useEffect(() => {
    // 组件卸载时的清理函数
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const redirectHome = () => {
    resetChangeTopic();
    history.push('/home');
  };

  return (
    <div className="question-container">
      <div className="back-home">
        <img onClick={redirectHome} src={BackHome} alt="home" />
      </div>
      <div className="question-category">{question.category}</div>
      <div className="question-wrap">
        <div className="question-content">
          <div className="question-number">第 {question.number} 题</div>
          <div className="question-text">{question.text}</div>
          <div className="options">
            <div className="options-content">
              {options.map((option, index) => (
                <Button
                  key={index}
                  className={`option-button ${
                    selectedOption
                      ? option.value === correctAnswer
                        ? 'correct'
                        : option.value === selectedOption
                        ? 'incorrect'
                        : ''
                      : ''
                  }`}
                  onClick={() => handleOptionClick(option.value)}
                  disabled={selectedOption !== null}
                >
                  <div className="option-value">{option.value}</div>
                  <div className="option-label show-ellipsis">
                    {option.label}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="question-bg1 question-bg-item" />
        <div className="question-bg2 question-bg-item" />
      </div>
    </div>
  );
};

export default forwardRef(QuestionComponent);

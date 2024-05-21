import { request } from '@@/plugin-request';
// import type { RequestConfig } from 'umi';

export type CommonResponse<T> = {
  code: number;
  data: T;
  msg: string;
};

// 获取分类列表
export interface TopicParams {
  /**
   * 客户端Id
   */
  cid?: string;
  /**
   * 默认分类
   */
  defaultTopic: string;
}
export const getTopics = (params: TopicParams) =>
  request('/game/topics/getTopics', {
    method: 'GET',
    params,
  });

// 根据分类获取题目
export interface QuestionsByTopicId {
  /**
   * 主题ID
   */
  topicId: number;
}
export interface Questions {
  answer: Answer;
  options: Options;
  question: string;
}

export enum Answer {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export interface Options {
  A: string;
  B: string;
  C: string;
  D: string;
}
export interface RQuestionData {
  questions: Questions;
  /**
   * 所属主题Id
   */
  topicId: number;
  /**
   * 所属主题分类，历史类
   */
  topicTitle: string;
  [property: string]: any;
}

export const getQuestionsByTopicId = (
  params: QuestionsByTopicId,
): Promise<CommonResponse<RQuestionData[]>> =>
  request('/game/questions/getQuestionByTopic', {
    method: 'GET',
    params,
  });

// 解锁分类
export interface RunlockData {
  /**
   * 客户端id
   */
  cid: string;
}
export const unLockTopicsApi = (data: RunlockData) =>
  request('/game/userlocks/createUserLock', {
    method: 'POST',
    data,
  });

// 提交错误题目
export interface PostErrBody {
  cid: string;
  topicId: number;
  questionId: number;
  wrongAnswer: string;
  gameUniqueId: string;
}

export const postErrQuestionId = (data: PostErrBody) =>
  request('/game/questions/createWrongQuestion', {
    method: 'POST',
    data,
  });

// 提交答题数量
export interface SubmitAnswerCountData {
  cid: string;
  topicId: number;
  answerCount: number;
  gameUniqueId: string;
}

export const submitAnswerCount = (data: SubmitAnswerCountData) =>
  request('/game/questions/createAnswerQuestion', {
    method: 'POST',
    data,
  });

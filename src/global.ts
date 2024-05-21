import jsBridge from '@/utils/jsBridge';

import { isHybridApp } from './utils';

const isHybrid = isHybridApp();
console.log('isHybrid', isHybrid);
if (isHybrid) {
  jsBridge.getCid();
  // jsBridge.requestAd();
}

document.title = '趣味知识问答';

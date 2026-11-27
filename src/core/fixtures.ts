import type { DemoAlert, DemoMessage, Post } from './types';

export const DEMO_AUTHOR = { authorId: 'demo-you', authorName: 'daily_warming 이웃' };

export type DemoState = {
  posts: Post[];
  alerts: DemoAlert[];
  messages: DemoMessage[];
};

export function makeDemoState(now = Date.now()): DemoState {
  const atHoursAgo = (hours: number) => new Date(now - hours * 3_600_000).toISOString();

  return {
    posts: [
      {
        id: 'example-seoul-1', authorId: 'example-jiu', authorName: '지우',
        regionId: '1100000000', createdAt: atHoursAgo(1), hearts: 12,
        title: '비 오는 날, 우산을 같이 썼어요',
        body: '정류장까지 같이 걸어 주신 이웃 덕분에 비를 피했어요. 건네주신 인사까지 오래 기억할 것 같아요.',
      },
      {
        id: 'example-busan-1', authorId: 'example-haneul', authorName: '하늘',
        regionId: '2600000000', createdAt: atHoursAgo(4), hearts: 8,
        title: '함께 주운 쓰레기, 한결 깨끗해진 바닷길',
        body: '장갑을 챙겨 온 이웃들과 산책길을 정리했어요. 덕분에 오랜만에 다 같이 바다를 천천히 볼 수 있었어요.',
      },
      {
        id: 'example-seoul-2', authorId: 'example-yujin', authorName: '유진',
        regionId: '1100000000', createdAt: atHoursAgo(20), hearts: 17,
        title: '수리한 자전거를 함께 시험했어요',
        body: '고장 난 자전거를 이웃이 봐주셨어요. 고친 뒤 공원을 한 바퀴 달렸는데 함께 웃었던 순간이 더 기억에 남아요.',
      },
      {
        id: 'example-seoul-3', authorId: 'example-haram', authorName: '하람',
        regionId: '1100000000', createdAt: atHoursAgo(44), hearts: 5,
        title: '문 앞에 놓인 따뜻한 죽 한 그릇',
        body: '몸이 좋지 않던 날 옆집에서 죽을 나눠 주셨어요. 빨리 나으라는 짧은 쪽지가 큰 위로였어요.',
      },
      {
        id: 'example-jeju-1', authorId: 'example-daeun', authorName: '다은',
        regionId: '5000000000', createdAt: atHoursAgo(51), hearts: 9,
        title: '첫 수확을 이웃과 나눴어요',
        body: '작은 텃밭에서 거둔 채소를 이웃에게 건넸어요. 돌아오는 길에 고맙다는 말을 들어 마음이 따뜻했어요.',
      },
    ],
    alerts: [
      { id: 'example-alert-1', read: false, text: '시연 알림이에요. 이웃이 따뜻한 이야기에 공감을 남겼어요.' },
      { id: 'example-alert-2', read: true, text: '지역별 소식에서 다른 동네의 이야기도 만나 보세요.' },
    ],
    messages: [
      { id: 'example-message-1', mine: false, text: '안녕하세요! 어제 함께 정리해 주셔서 고마웠어요.' },
      { id: 'example-message-2', mine: true, text: '저도 덕분에 힘이 났어요. 다음에 또 만나요!' },
    ],
  };
}

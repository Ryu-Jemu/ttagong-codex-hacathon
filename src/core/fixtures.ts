import type { DemoAlert, DemoMessage, MusicRecommendation, Post } from './types';

export const DEMO_AUTHOR = { authorId: 'demo-you', authorName: '따공 이웃' };

export type DemoState = {
  posts: Post[];
  alerts: DemoAlert[];
  messages: DemoMessage[];
  recommendations: MusicRecommendation[];
};

export function makeDemoState(now = Date.now()): DemoState {
  const atHoursAgo = (hours: number) => new Date(now - hours * 3_600_000).toISOString();

  return {
    recommendations: [],
    posts: [
      {
        id: 'example-seoul-1', authorId: 'example-jiu', authorName: '지우',
        regionId: '1100000000', createdAt: atHoursAgo(1), hearts: 12,
        title: '비 오는 날, 우산을 같이 썼어요',
        body: '정류장까지 같이 걸어 주신 이웃 덕분에 비를 피했어요. 건네주신 인사까지 오래 기억할 것 같아요.',
        featuredComment: { authorName: '소담', body: '저도 비 오는 날 우산을 조금 기울여 볼게요.' },
      },
      {
        id: 'example-busan-1', authorId: 'example-haneul', authorName: '하늘',
        regionId: '2600000000', createdAt: atHoursAgo(4), hearts: 8,
        title: '함께 주운 쓰레기, 한결 깨끗해진 바닷길',
        body: '장갑을 챙겨 온 이웃들과 산책길을 정리했어요. 덕분에 오랜만에 다 같이 바다를 천천히 볼 수 있었어요.',
        featuredComment: { authorName: '은서', body: '함께 걷는 길을 돌봐 주셔서 고마워요.' },
      },
      {
        id: 'example-seoul-2', authorId: 'example-yujin', authorName: '유진',
        regionId: '1100000000', createdAt: atHoursAgo(20), hearts: 17,
        title: '수리한 자전거를 함께 시험했어요',
        body: '고장 난 자전거를 이웃이 봐주셨어요. 고친 뒤 공원을 한 바퀴 달렸는데 함께 웃었던 순간이 더 기억에 남아요.',
        featuredComment: { authorName: '도윤', body: '다시 달릴 때 얼마나 기분 좋았을까요.' },
      },
      {
        id: 'example-seoul-3', authorId: 'example-haram', authorName: '하람',
        regionId: '1100000000', createdAt: atHoursAgo(44), hearts: 5,
        title: '문 앞에 놓인 따뜻한 죽 한 그릇',
        body: '몸이 좋지 않던 날 옆집에서 죽을 나눠 주셨어요. 빨리 나으라는 짧은 쪽지가 큰 위로였어요.',
        featuredComment: { authorName: '서하', body: '따뜻한 죽과 쪽지가 마음까지 데워 줬겠어요.' },
      },
      {
        id: 'example-jeju-1', authorId: 'example-daeun', authorName: '다은',
        regionId: '5000000000', createdAt: atHoursAgo(51), hearts: 9,
        title: '첫 수확을 이웃과 나눴어요',
        body: '작은 텃밭에서 거둔 채소를 이웃에게 건넸어요. 돌아오는 길에 고맙다는 말을 들어 마음이 따뜻했어요.',
        featuredComment: { authorName: '민준', body: '첫 수확을 나누는 마음이 참 좋네요.' },
      },
      {
        id: 'example-busan-2', authorId: 'example-seojun', authorName: '서준',
        regionId: '2600000000', createdAt: atHoursAgo(58), hearts: 7,
        title: '잃어버린 장갑을 찾아 주셨어요',
        body: '아침에 떨어뜨린 장갑을 시장 상인분이 챙겨 두셨어요. 덕분에 귀갓길 손이 따뜻했습니다.',
      },
      {
        id: 'example-jeju-2', authorId: 'example-gaeul', authorName: '가을',
        regionId: '5000000000', createdAt: atHoursAgo(64), hearts: 4,
        title: '마을 회관에서 처음 뜨개질을 배웠어요',
        body: '실이 자꾸 엉켰는데 옆자리 이웃이 천천히 풀어 주셨어요. 오늘 배운 방법으로 작은 목도리를 뜨고 있어요.',
      },
      {
        id: 'example-busan-3', authorId: 'example-minseo', authorName: '민서',
        regionId: '2600000000', createdAt: atHoursAgo(71), hearts: 6,
        title: '함께 다듬은 골목 화분',
        body: '바람에 쓰러진 화분을 이웃 세 분과 일으켜 세웠어요. 다음엔 물 주는 날도 함께 정하기로 했습니다.',
      },
      {
        id: 'example-jeju-3', authorId: 'example-yul', authorName: '율',
        regionId: '5000000000', createdAt: atHoursAgo(79), hearts: 3,
        title: '버스 정류장에서 건네받은 귤 한 알',
        body: '버스를 기다리던 이웃이 갓 딴 귤을 나눠 주셨어요. 서로 이름을 묻고 다음에도 인사하기로 했습니다.',
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

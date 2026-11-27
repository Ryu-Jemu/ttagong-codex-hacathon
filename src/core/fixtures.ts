import { makeBadgeAlert, type DemoBadgeId } from './badges.ts';
import { makeRegionalExamplePosts } from './regional-fixtures.ts';
import type { DemoAlert, DemoMessage, MusicRecommendation, Post } from './types';

export const DEMO_AUTHOR = { authorId: 'demo-you', authorName: '따공 이웃' };
export const DEMO_MESSAGE_LIMIT = 7;

export type DemoState = {
  posts: Post[];
  alerts: DemoAlert[];
  earnedBadgeIds: DemoBadgeId[];
  messages: DemoMessage[];
  recommendations: MusicRecommendation[];
};

export function makeDemoState(now = Date.now()): DemoState {
  const atHoursAgo = (hours: number) => new Date(now - hours * 3_600_000).toISOString();

  return {
    recommendations: [
      {
        id: 'example-recommendation-walk', trackId: 'walk', authorName: DEMO_AUTHOR.authorName,
        reason: '비가 그친 부산 바닷길을 이웃과 천천히 걸을 때 듣고 싶은 곡이에요.',
      },
      {
        id: 'example-recommendation-day6', trackId: 'time-of-our-life', authorName: DEMO_AUTHOR.authorName,
        reason: '대전 책방에서 함께 상자를 정리한 날, 수고했다고 말하며 이 노래를 나누고 싶었어요.',
      },
    ],
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
      {
        id: 'example-you-busan', ...DEMO_AUTHOR,
        regionId: '2600000000', createdAt: atHoursAgo(216), hearts: 4,
        title: '골목 화분을 처마 아래로 옮겼어요',
        body: '비바람에 화분이 넘어질까 걱정이었는데 옆 가게 이웃이 나와 함께 옮겨 주셨어요. 비가 그치면 바닷길로 같이 산책 가기로 했어요.',
      },
      {
        id: 'example-you-daejeon', ...DEMO_AUTHOR,
        regionId: '3000000000', createdAt: atHoursAgo(288), hearts: 3,
        title: '책방 앞에서 상자를 함께 날랐어요',
        body: '비를 피할 수 있게 책이 든 상자를 가게 안으로 옮겼어요. 정리를 끝내고 이웃들과 따뜻한 차를 한 잔 나눴습니다.',
      },
      {
        id: 'example-you-jeju', ...DEMO_AUTHOR,
        regionId: '5000000000', createdAt: atHoursAgo(384), hearts: 2,
        title: '산책길에서 잃어버린 모자를 돌려 드렸어요',
        body: '바람에 날린 모자가 제 발 앞에 멈췄어요. 앞서 걷던 분을 불러 건네드렸더니, 어디서 바다가 잘 보이는지도 알려 주셨어요.',
      },
      ...makeRegionalExamplePosts(atHoursAgo),
    ],
    earnedBadgeIds: ['first-story', 'first-song'],
    alerts: [
      { id: 'example-alert-1', kind: 'like', read: false, text: '소담님이 ‘골목 화분을 처마 아래로 옮겼어요’에 좋아요를 눌렀어요.' },
      makeBadgeAlert('first-song'),
      { id: 'example-alert-like-2', kind: 'like', read: true, text: '민준님이 ‘산책길에서 잃어버린 모자를 돌려 드렸어요’에 좋아요를 눌렀어요.' },
      makeBadgeAlert('first-story', true),
    ],
    messages: [
      { id: 'example-message-1', mine: false, text: '안녕하세요! 어제 함께 정리해 주셔서 고마웠어요.' },
      { id: 'example-message-2', mine: true, text: '저도 덕분에 힘이 났어요. 다음에 또 만나요!' },
      { id: 'example-message-3', mine: false, text: '처마 밑으로 옮긴 화분은 밤새 무사했어요.' },
      { id: 'example-message-4', mine: true, text: '다행이에요. 비가 그치면 바닷길도 같이 걸어요.' },
      { id: 'example-message-5', mine: false, text: '좋아요. 걸으면서 백예린의 ‘산책’을 듣고 싶어요.' },
      { id: 'example-message-6', mine: true, text: '저도 그 곡 추천 글을 남겼어요. 느긋하게 걷기에 잘 어울려요.' },
    ],
  };
}

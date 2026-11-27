import type { Post } from './types.ts';

type RegionalStory = Omit<Post, 'regionId' | 'createdAt' | 'authorId'> & { hoursAgo: number };

// Fictional stories for the demo. A few areas only have older stories to show the seven-day window.
const storiesByRegion: Record<string, readonly RegionalStory[]> = {
  '1100000000': [ // 서울
    {
      id: 'mangwon-recipe', authorName: '버들차', hoursAgo: 225, hearts: 5,
      title: '망원시장에서 배운 무 한 조각 쓰는 법',
      body: '시장 이웃에게 무가 조금 남으면 뭐 해 먹느냐고 여쭸어요. 손바닥만 한 종이에 들기름을 넣고 볶으라며 순서를 적어 주셨어요.',
    },
    {
      id: 'jungnang-walk', authorName: '한걸음', hoursAgo: 317, hearts: 3,
      title: '오늘은 달리지 않아도 된다고 해 줬어요',
      body: '중랑천에서 함께 달리기로 한 날, 제가 기운이 없어 보였대요. 이웃이 운동 기록을 끄고 갈대밭까지 천천히 걷자고 했어요.',
    },
    {
      id: 'nakwon-applause', authorName: '종이별', hoursAgo: 459, hearts: 7,
      title: '끝까지 들어 준 첫 관객이 생겼어요',
      body: '낙원동에서 어설프게 연습한 곡을 친구 앞에서 처음 쳤어요. 지나가던 이웃이 곡이 끝날 때까지 기다렸다가 조용히 박수를 보내 줬어요.',
    },
  ],
  '1200000000': [ // 전남광주
    {
      id: 'yangnim-sketch', authorName: '수풀', hoursAgo: 94, hearts: 5,
      title: '바람 부는 골목에서 빌린 작은 집게',
      body: '광주 양림동에서 골목을 그리는데 바람에 종이가 계속 넘어갔어요. 옆에 앉은 이웃이 집게를 빌려 주셔서 지붕 선을 끝까지 그렸습니다.',
    },
    {
      id: 'suncheon-pump', authorName: '물비늘', hoursAgo: 125, hearts: 3,
      title: '동천 산책길에서 빌린 펌프',
      body: '순천 동천에서 자전거 바퀴가 주저앉았어요. 지나가던 분이 휴대용 펌프를 꺼내고 제가 바람을 넣는 동안 자전거를 잡아 주셨어요.',
    },
    {
      id: 'mokpo-rope', authorName: '해무', hoursAgo: 198, hearts: 2,
      title: '종이 상자를 묶어 준 노끈',
      body: '목포에서 재활용 상자를 내놓는데 바람에 자꾸 흩어졌어요. 옆집 이웃이 노끈을 나눠 주고 같이 묶어 주셨어요.',
    },
    {
      id: 'yeosu-tide-lesson', authorName: '물결결', hoursAgo: 250, hearts: 7,
      title: '여수 바다에서 배가 방향을 바꾸는 이유를 알려 주셨어요',
      body: '종포 쪽에서 아이가 같은 배가 왜 자꾸 방향을 바꾸냐고 했어요. 근처에서 바다를 보던 이웃이 물살을 가리키며 같이 관찰해 주셨어요.',
    },
    {
      id: 'damyang-dry-paper', authorName: '대숲사이', hoursAgo: 345, hearts: 4,
      title: '소나기 속에서 아이 그림을 지켜 준 장바구니',
      body: '담양에서 아이가 그린 그림을 들고 가다 소나기를 맞았어요. 처마 아래 이웃이 자기 장바구니에 그림을 넣고 정류장까지 같이 가 주셨어요.',
    },
    {
      id: 'gwangsan-new-neighbor', authorName: '포근밤', hoursAgo: 475, hearts: 4,
      title: '광주로 이사 온 날 동네 가게를 알려 주셨어요',
      body: '광주 광산구로 처음 이사 온 날 종량제 봉투를 어디서 사는지 몰랐어요. 옆집에서 가까운 판매점과 동네에 물어볼 곳을 쪽지에 적어 주셨어요.',
    },
  ],
  '2600000000': [ // 부산
    {
      id: 'yeongdo-bag-tag', authorName: '푸른돛', hoursAgo: 226, hearts: 5,
      title: '영도 나들이에 헷갈리지 않는 가방표를 만들었어요',
      body: '체험을 같이 온 아이들 가방이 모두 비슷했어요. 옆 가족이 여분의 천 끈을 꺼내 줘 아이들이 저마다 좋아하는 색을 달았어요.',
    },
    {
      id: 'choryang-schedule', authorName: '언덕길', hoursAgo: 336, hearts: 4,
      title: '초량 골목 청소 순서를 바꿔 주셨어요',
      body: '골목을 쓸기로 한 날 아침 일찍 집을 비워야 했어요. 사정을 들은 이웃이 자기 날과 바꾸고 남은 낙엽 자루도 현관에 가져다주셨어요.',
    },
    {
      id: 'gwangalli-listen', authorName: '릴리잔', hoursAgo: 440, hearts: 3,
      title: '광안리에서 이야기하기 편한 자리로 옮겼어요',
      body: '바닷가 쪽에 앉으니 친구 목소리가 파도 소리에 묻혔어요. 옆 테이블 이웃이 한결 조용한 자리가 비었음을 손짓으로 알려 주셨어요.',
    },
  ],
  '2700000000': [ // 대구
    {
      id: 'suseongmot-photo', authorName: '라온', hoursAgo: 83, hearts: 6,
      title: '가족사진에 할머니도 함께 담았어요',
      body: '수성못에서 할머니가 자꾸 사진 밖으로 물러나셨어요. 산책하던 분이 먼저 찍어 주겠다고 해서 모처럼 모두 한 장에 담겼습니다.',
    },
    {
      id: 'sincheon-chalk', authorName: '새봄', hoursAgo: 110, hearts: 2,
      title: '분필 한 조각으로 함께 그린 마을',
      body: '신천 근처 놀이터에서 아이가 분필을 떨어뜨려 부러뜨렸어요. 옆에서 그림을 그리던 아이가 자기 분필을 반으로 나눠 줘 두 아이가 집을 한 채씩 그렸어요.',
    },
    {
      id: 'seomun-bag', authorName: '단추', hoursAgo: 137, hearts: 4,
      title: '장바구니를 빌려주고 다음 날 만났어요',
      body: '서문시장에서 짐을 담은 봉투가 찢어졌어요. 자주 지나치는 가게에서 튼튼한 장바구니를 빌려 주셔서 다음 날 돌려드리며 감사 인사를 했습니다.',
    },
    {
      id: 'dalseong-coat-seam', authorName: '실오라기', hoursAgo: 227, hearts: 5,
      title: '달성에서 배운 단추를 단단히 다는 법',
      body: '마을 모임에서 외투 단추가 곧 떨어질 것 같다며 보여 드렸어요. 이웃이 천과 단추 사이에 공간을 남기는 법을 직접 보여 주며 같이 달아 주셨어요.',
    },
    {
      id: 'dongseongro-return-note', authorName: '노란메모', hoursAgo: 312, hearts: 4,
      title: '동성로에서 건네받은 잃어버린 편지',
      body: '친구에게 줄 편지를 어디에 뒀는지 모르고 왔던 길을 되짚었어요. 카페 이웃이 벤치에서 주운 봉투라며 봉한 그대로 건네주셨어요.',
    },
    {
      id: 'ap-san-water-pack', authorName: '나무그늘', hoursAgo: 442, hearts: 6,
      title: '앞산 모임에서 무거운 물만 나눠 들었어요',
      body: '마을 이웃들과 걷는데 처음 온 분의 가방이 유독 무거워 보였어요. 쉬는 곳에서 물병 두 개를 나눠 담고 나머지 길을 함께 걸었어요.',
    },
  ],
  '2800000000': [ // 인천
    {
      id: 'sorae-bench', authorName: '노을빛', hoursAgo: 98, hearts: 5,
      title: '젖은 벤치를 함께 닦았어요',
      body: '소래포구 쪽을 걷다가 어르신이 잠시 쉬고 싶어 하셨어요. 지나가던 이웃과 손수건으로 빗물을 닦아 앉을 자리를 마련했어요.',
    },
    {
      id: 'songdo-leaf', authorName: '푸른잎', hoursAgo: 119, hearts: 3,
      title: '잎사귀 이름을 적어 건네주셨어요',
      body: '송도 센트럴파크에서 아이가 주운 잎의 이름을 궁금해했어요. 산책하던 이웃이 나무를 가리키며 종잇조각에 이름을 써 주셨습니다.',
    },
    {
      id: 'wolmi-scarf', authorName: '솔바람', hoursAgo: 184, hearts: 2,
      title: '바람에 날린 목도리를 잡아 주셨어요',
      body: '월미도 바닷길에서 풀린 목도리가 뒤로 날아갔어요. 뒤따라 걷던 분이 손을 뻗어 난간에 걸리기 전에 잡아 주셨어요.',
    },
    {
      id: 'baedari-book-box', authorName: '책등', hoursAgo: 245, hearts: 6,
      title: '배다리에서 책 상자를 놓아 둘 곳을 내어 주셨어요',
      body: '나눌 책을 담은 상자가 무거워 잠깐 쉬고 싶었어요. 책방 이웃이 문 앞에 자리를 내어 주고 안에서 숨을 돌리라고 했어요.',
    },
    {
      id: 'bupyeong-stage-guide', authorName: '아래음', hoursAgo: 339, hearts: 4,
      title: '부평 공연장에서 자막이 보이는 자리를 찾았어요',
      body: '친구와 동네 공연을 보러 갔는데 앞사람에 가려 자막이 잘 안 보였어요. 옆자리 분이 자기 쪽 빈자리를 가리켜 주셔서 마지막 곡까지 같이 봤어요.',
    },
    {
      id: 'ganghwa-map-fold', authorName: '바다종이', hoursAgo: 494, hearts: 5,
      title: '강화 시장에서 다음 정류장만 표시했어요',
      body: '큰 지도를 오래 살피던 이웃이 시장만 나가면 길을 알겠다고 하셨어요. 종이를 한 번 접어 바깥쪽에 다음 정류장 이름과 방향만 그려 드렸습니다.',
    },
  ],
  '3000000000': [ // 대전
    {
      id: 'gapcheon-guide', authorName: '느티', hoursAgo: 88, hearts: 4,
      title: '갑천에서 내려가는 길을 함께 찾았어요',
      body: '갑천을 걷다 강변으로 내려갈 완만한 길을 찾는 분을 만났어요. 제가 평소 이용하는 길까지 같이 걷고 다리 아래를 가리켜 드렸습니다.',
    },
    {
      id: 'yuseong-ticket', authorName: '초승', hoursAgo: 187, hearts: 2,
      title: '발매기 앞에서 기다려 준 사람',
      body: '유성온천역에서 표를 사는데 화면 글씨가 잘 보이지 않았어요. 뒤에 서 있던 분이 서두르지 않아도 된다며 글씨를 읽어 주셨어요.',
    },
    {
      id: 'daejeon-station-route', authorName: '느린별', hoursAgo: 251, hearts: 4,
      title: '대전역 앞에서 막 떠난 친구에게 안부를 보냈어요',
      body: '나눠 주려고 들고 나온 빵을 친구가 떠난 뒤에야 손에 든 걸 알았어요. 함께 배웅한 이웃이 빵은 우리가 먹고, 도착할 때 읽도록 인사를 남기자고 했어요.',
    },
    {
      id: 'hanbat-seed-packet', authorName: '보리씨', hoursAgo: 379, hearts: 3,
      title: '한밭수목원 벤치에서 꽃씨를 나눴어요',
      body: '이웃에게 나눠 줄 봉선화 씨를 봉투에 나누어 담고 있었어요. 옆에서 관심을 보이신 분에게 한 봉투를 드리고 언제 심을지도 같이 적었어요.',
    },
  ],
  '3100000000': [ // 울산
    {
      id: 'taehwa-seat', authorName: '해찬', hoursAgo: 104, hearts: 6,
      title: '강을 볼 수 있는 자리를 비켜 주셨어요',
      body: '태화강 산책 중 아이와 잠깐 쉬려는데 벤치가 가득했어요. 앉아 계시던 분들이 조금씩 옆으로 옮겨 저희 자리를 만들어 주셨어요.',
    },
    {
      id: 'jujeon-shoe', authorName: '몽글', hoursAgo: 133, hearts: 3,
      title: '몽돌해변에서 잃어버린 신발 한 짝',
      body: '주전에서 물가를 보다가 아이 신발 한 짝이 멀리 굴러갔어요. 가까이 있던 이웃이 주워 올려 주고 물기를 털어 건네주셨어요.',
    },
    {
      id: 'jangsaengpo-order', authorName: '파도새', hoursAgo: 175, hearts: 2,
      title: '빵 봉투를 받아 막차에 올랐어요',
      body: '장생포에서 빵을 사던 중 막차가 올 시간이 다 됐어요. 사정을 들은 이웃이 막 포장된 제 빵을 받아 입구까지 가져다주셨어요.',
    },
    {
      id: 'ulsan-dark-turn', authorName: '반딧길', hoursAgo: 248, hearts: 5,
      title: '울산대공원에서 발밑을 비춰 주셨어요',
      body: '해 질 무렵 산책을 마치고 나가는데 턱이 잘 안 보였어요. 뒤에서 오던 분이 휴대전화 불빛으로 앞을 비춰 주셨어요.',
    },
    {
      id: 'daewangam-button', authorName: '매듭달', hoursAgo: 334, hearts: 3,
      title: '대왕암에서 헤어진 장갑 두 짝이 만났어요',
      body: '공원 입구에서 벗어 둔 장갑을 찾는데 한 짝만 남아 있었어요. 근처에 주운 장갑을 모아 놓은 쪽지가 있어 다른 한 짝도 찾았습니다.',
    },
    {
      id: 'eonyang-apron', authorName: '고추잠', hoursAgo: 476, hearts: 6,
      title: '언양에서 처음 담그는 김치에 앞치마를 빌렸어요',
      body: '이웃과 김치를 담그기로 했는데 옷을 갈아입고 오지 못했어요. 마당에 나온 분이 빨아서 접어 둔 앞치마를 가져다주셨어요.',
    },
  ],
  '3600000000': [ // 세종
    {
      id: 'sejong-fountain', authorName: '은결', hoursAgo: 92, hearts: 5,
      title: '호수공원에서 같이 찾은 물 마시는 곳',
      body: '호수공원에서 물을 다 마신 아이가 목이 마르다고 했어요. 벤치에 있던 분이 가까운 음수대까지 함께 걸어 주셨어요.',
    },
    {
      id: 'jochiwon-sprout', authorName: '미루', hoursAgo: 180, hearts: 4,
      title: '공동 텃밭에 남겨 둔 모종 세 개',
      body: '조치원 공동 텃밭에서 제가 심은 모종이 시들었어요. 옆 구역 이웃이 남은 상추 모종 세 개를 건네며 심을 깊이까지 알려 주셨어요.',
    },
    {
      id: 'boram-reservation', authorName: '달팽', hoursAgo: 247, hearts: 1,
      title: '읽고 싶던 책을 예약하는 법을 배웠어요',
      body: '보람동 도서관에서 읽으려던 책이 대출 중이었어요. 옆자리 이웃이 예약 화면을 천천히 보여 주신 덕분에 제 차례를 기다릴 수 있게 됐어요.',
    },
    {
      id: 'dodam-pot-label', authorName: '깃털콩', hoursAgo: 347, hearts: 5,
      title: '도담동 공동 화단에 이름표를 달았어요',
      body: '아침마다 보는 화분이 무슨 꽃인지 궁금하다는 분이 계셨어요. 이름을 아는 이웃과 방수가 되는 종이로 작은 표를 만들어 꽂았어요.',
    },
    {
      id: 'geumgang-crooked-sign', authorName: '강쪽', hoursAgo: 455, hearts: 4,
      title: '금강 산책길에서 임시 안내판을 다시 세웠어요',
      body: '바람에 산책길 우회 안내판이 돌아가 뒤쪽을 향하고 있었어요. 걸음을 멈춘 이웃과 글씨가 보이게 바로 놓고 받침을 단단히 눌렀어요.',
    },
  ],
  '4100000000': [ // 경기
    {
      id: 'suwon-hill', authorName: '소리나무', hoursAgo: 116, hearts: 4,
      title: '성곽 아래 언덕에서 손수레를 밀어 드렸어요',
      body: '수원 화성 근처 언덕에서 손수레가 조금씩 밀려 내려왔어요. 뒤에서 함께 밀어 올리니 평평한 곳까지 금방 도착했어요.',
    },
    {
      id: 'paju-bookmark', authorName: '연두콩', hoursAgo: 191, hearts: 3,
      title: '빌린 책에 끼워 주신 작은 책갈피',
      body: '파주 동네 도서관에서 책장을 자꾸 접는 아이를 보셨대요. 이웃이 두꺼운 종이로 작은 책갈피를 만들어 건네주셨습니다.',
    },
    {
      id: 'ansan-stroller', authorName: '봄이랑', hoursAgo: 239, hearts: 5,
      title: '계단 앞에서 유모차를 같이 들었어요',
      body: '안산 산책길에 짧은 계단이 나와 유모차를 세웠어요. 마주 오던 분이 먼저 잠금장치를 확인하고 반대쪽 손잡이를 들어 주셨어요.',
    },
    {
      id: 'yongin-shared-postcard', authorName: '둥근글', hoursAgo: 267, hearts: 6,
      title: '용인에서 삐뚤삐뚤한 엽서를 함께 썼어요',
      body: '동네 행사에서 어르신이 멀리 사는 손녀에게 문장을 쓰고 싶다고 하셨어요. 말씀하시는 대로 옆에 적어 드리니 끝에 직접 작은 하트를 그리셨어요.',
    },
    {
      id: 'hanam-kite-coil', authorName: '솔마디', hoursAgo: 352, hearts: 4,
      title: '하남 강변에서 뒤엉킨 연줄을 풀었어요',
      body: '바람이 세게 불어 두 아이의 연줄이 꼬였어요. 옆 가족과 각자 한쪽 연을 낮춰 한 가닥씩 풀고 다시 띄웠어요.',
    },
    {
      id: 'hwaseong-silent-lunch', authorName: '찬밥달', hoursAgo: 410, hearts: 5,
      title: '바쁜 화성 이웃에게 먹기 편한 한 끼를 건넸어요',
      body: '일을 마무리하느라 저녁을 못 챙겼다는 이웃에게 주먹밥을 몇 개 건넸어요. 다음 날 빈 그릇과 잘 먹었다는 쪽지가 함께 돌아왔어요.',
    },
    {
      id: 'goyang-street-song', authorName: '겨를', hoursAgo: 512, hearts: 3,
      title: '고양에서 첫 동네 합창에 자리를 내어 주셨어요',
      body: '동네 합창 모임에 처음 갔는데 어느 줄에 서야 할지 몰랐어요. 단원 한 분이 자기 옆자리를 조금 비켜 주고 첫 음을 함께 불러 주셨어요.',
    },
  ],
  '4300000000': [ // 충북
    {
      id: 'musimcheon-spare-lace', authorName: '하늬', hoursAgo: 107, hearts: 3,
      title: '산책길에서 건네받은 여분의 신발 끈',
      body: '청주 무심천을 걷다가 신발 끈이 끊어졌어요. 달리기를 나오신 분이 가방에서 여분의 끈을 꺼내 주셔서 집까지 걸어왔습니다.',
    },
    {
      id: 'tangeumdae-rest', authorName: '나란히', hoursAgo: 140, hearts: 4,
      title: '오르막에서 제 속도에 맞춰 걸어 주셨어요',
      body: '충주 탄금대 오르막에서 숨이 차 잠시 서 있었어요. 앞에서 걷던 이웃이 느긋하게 가자며 돌아와 나란히 걸어 주셨습니다.',
    },
    {
      id: 'uirimji-glass', authorName: '잔물결', hoursAgo: 214, hearts: 2,
      title: '산책로의 유리 조각을 함께 치웠어요',
      body: '제천 의림지 길에 깨진 병 조각이 보여 아이들이 돌아가도록 안내했어요. 집게와 봉투를 가져온 이웃이 함께 정리해 주셨어요.',
    },
    {
      id: 'okcheon-crayon-box', authorName: '골목종', hoursAgo: 352, hearts: 4,
      title: '옥천 그림 모임에서 먼저 써 보라고 건넨 색연필',
      body: '처음 간 그림 모임에서 색연필이 없다고 했더니 이웃이 자기 통을 가운데로 밀었어요. 짧아진 색연필을 골라 서로의 그림에 한 줄씩 그렸습니다.',
    },
    {
      id: 'eumseong-bus-stop', authorName: '돌고개', hoursAgo: 483, hearts: 4,
      title: '음성 장터에서 버스가 올 때까지 있어 주셨어요',
      body: '장이 끝나 사람은 없고 버스 도착 표시는 비어 있었어요. 정류장 옆 가게 이웃이 불을 끄지 않고 차가 올 때까지 이야기를 나눠 주셨어요.',
    },
  ],
  '4400000000': [ // 충남
    {
      id: 'gongju-paper', authorName: '해사', hoursAgo: 171, hearts: 5,
      title: '강가에서 접던 종이배가 두 척이 됐어요',
      body: '공주 금강변 벤치에서 아이가 종이배 접는 법을 어려워했어요. 옆자리 이웃이 한 번씩 접어 보여 주셔서 완성한 배 두 척을 집으로 가져왔습니다.',
    },
    {
      id: 'onyang-seat', authorName: '마루끝', hoursAgo: 212, hearts: 4,
      title: '온양에서 받은 잠깐의 자리',
      body: '온양 시장을 한 바퀴 돌고 서서 버스를 기다렸어요. 짐이 많은 걸 본 이웃이 접이식 의자를 펼쳐 잠깐 앉아도 된다고 하셨어요.',
    },
    {
      id: 'yesan-thread', authorName: '자투리', hoursAgo: 283, hearts: 2,
      title: '가방의 뜯어진 손잡이를 꿰맸어요',
      body: '예산에서 장을 보던 중 천 가방 손잡이가 뜯어졌어요. 지나가던 이웃이 바늘과 실을 빌려주셔서 벤치에서 두어 번 단단하게 꿰맸습니다.',
    },
    {
      id: 'taean-dry-socks', authorName: '갯내음', hoursAgo: 353, hearts: 5,
      title: '태안에서 발이 젖었을 때 마른 양말을 건네받았어요',
      body: '바닷가에서 발을 헛디뎌 양말이 흠뻑 젖었어요. 산책을 같이 온 이웃이 가방에서 깨끗한 여분을 꺼내 줘 돌아오는 길이 덜 추웠어요.',
    },
    {
      id: 'nonsan-morning-tray', authorName: '이슬받이', hoursAgo: 461, hearts: 3,
      title: '논산 아침 모임에서 차를 쏟은 자리를 같이 닦았어요',
      body: '처음 간 모임에서 쟁반을 들다가 차를 쏟아서 당황했어요. 옆의 이웃이 수건을 건네고 같이 닦은 뒤 같은 자리에 차를 다시 따라 주셨어요.',
    },
  ],
  '4700000000': [ // 경북
    {
      id: 'gyeongju-ramp', authorName: '토담', hoursAgo: 118, hearts: 6,
      title: '문턱 앞에서 판을 놓아 주셨어요',
      body: '경주 황리단길에서 유모차 바퀴가 가게 문턱에 걸렸어요. 가게 이웃이 단단한 판을 깔아 주셔서 아이를 깨우지 않고 들어갔어요.',
    },
    {
      id: 'andong-water', authorName: '모래별', hoursAgo: 186, hearts: 3,
      title: '낙동강을 걷다가 빌린 강아지 물그릇',
      body: '안동 낙동강변에서 접이식 물그릇을 깜빡한 걸 알았어요. 강아지와 산책하던 분이 여분 그릇을 빌려주셔서 가져온 물을 먹일 수 있었어요.',
    },
    {
      id: 'yeongildae-cleanup', authorName: '은모래', hoursAgo: 222, hearts: 4,
      title: '영일대에서 모은 작은 뚜껑들',
      body: '포항 영일대에서 산책하다 모래에 박힌 플라스틱 뚜껑을 봤어요. 옆을 걷던 이웃과 발밑을 살피며 주워 한 봉투에 담았습니다.',
    },
    {
      id: 'gumi-spare-cable', authorName: '조그만전등', hoursAgo: 295, hearts: 6,
      title: '구미에서 꺼져 가는 전화에 충전기를 빌렸어요',
      body: '마중 나온 가족에게 전화해야 하는데 배터리가 거의 없었어요. 가까운 가게 이웃이 계산대 옆 충전기를 빌려 주고 전화할 자리를 내어 주셨어요.',
    },
    {
      id: 'cheongdo-persimmons', authorName: '감잎빛', hoursAgo: 357, hearts: 5,
      title: '청도에서 가장 잘 익은 감을 건네받았어요',
      body: '아래에 떨어진 감을 피해서 걷고 있으니 마당의 이웃이 저를 불렀어요. 잘 익은 감을 골라 주시며 집에 가서 드셔 보라고 하셨어요.',
    },
    {
      id: 'yeongju-first-pottery', authorName: '손바닥흙', hoursAgo: 501, hearts: 3,
      title: '영주에서 무너진 흙그릇을 다시 빚었어요',
      body: '흙그릇을 빚다가 옆면을 잘못 눌러 모양이 무너졌어요. 먼저 마친 이웃이 물을 덜 쓰며 두 손으로 받치는 법을 옆에서 보여 줬어요.',
    },
  ],
  '4800000000': [ // 경남
    {
      id: 'tongyeong-boat-directions', authorName: '새벽등', hoursAgo: 99, hearts: 5,
      title: '항구에서 같은 방향으로 걸어 주셨어요',
      body: '통영 항구에서 서로 다른 선착장 표시를 보고 한참 서 있었어요. 같은 방향으로 가는 이웃이 계단 앞까지 같이 걸어 주셨어요.',
    },
    {
      id: 'jinhae-zipped-pocket', authorName: '파릇', hoursAgo: 122, hearts: 3,
      title: '열린 배낭을 조용히 알려 줬어요',
      body: '창원 진해루 근처를 걷는데 앞사람의 배낭이 열려 수첩이 빠질 듯했어요. 옆으로 다가가 알려 드렸더니 수첩을 안쪽에 넣고 웃으며 인사하셨어요.',
    },
    {
      id: 'jinju-score', authorName: '저녁별', hoursAgo: 200, hearts: 3,
      title: '남강에서 함께 세어 본 줄넘기',
      body: '진주 남강변에서 아이가 혼자 줄넘기 숫자를 세다 자꾸 잊어버렸어요. 쉬고 계시던 이웃이 박수를 치며 스무 번까지 함께 세어 주셨어요.',
    },
    {
      id: 'gimhae-apartment-cart', authorName: '작은바퀴', hoursAgo: 278, hearts: 5,
      title: '김해 아파트에서 접이식 손수레를 빌렸어요',
      body: '장을 보고 돌아오는데 현관까지 옮길 짐이 많았어요. 지나가던 이웃이 손수레를 빌려 주고 다 옮긴 뒤에 자기 집 앞에 두라고 하셨습니다.',
    },
    {
      id: 'yangsan-fern-lantern', authorName: '은고사리', hoursAgo: 345, hearts: 3,
      title: '양산 마을 모임에서 이웃과 등을 달았어요',
      body: '모임을 마치고 내려가는 골목이 어두워 보였어요. 먼저 집에 가던 이웃이 작은 등을 가져와 사람들이 돌아갈 때까지 현관에 달아 두셨어요.',
    },
    {
      id: 'namhae-memory-tide', authorName: '남쪽물', hoursAgo: 427, hearts: 4,
      title: '남해에서 기억나지 않는 노랫말을 이어 줬어요',
      body: '바닷가를 걸으며 예전에 들었던 노래를 흥얼거리다 한참 막혔어요. 같이 걷던 이웃이 나머지 구절을 불러 줘 둘이 끝까지 따라 불렀어요.',
    },
    {
      id: 'hadong-tea-pouring', authorName: '찻잎새', hoursAgo: 508, hearts: 6,
      title: '하동에서 첫 차를 따라 보는 순서를 양보받았어요',
      body: '차를 나누는 모임에서 처음 온 분을 찾길래 손을 들었어요. 이웃이 찻주전자를 제 앞으로 건네고 물을 따르는 속도를 손짓으로 알려 주셨어요.',
    },
  ],
  '5100000000': [ // 강원
    {
      id: 'chuncheon-mittens', authorName: '산들', hoursAgo: 95, hearts: 5,
      title: '공지천에서 주운 장갑을 난간에 걸어 두었어요',
      body: '춘천 공지천 길에 작은 장갑이 떨어져 있었어요. 눈에 띄는 난간에 걸어 두니 되돌아온 가족이 장갑을 찾아갈 수 있었어요.',
    },
    {
      id: 'anmok-shells', authorName: '조개구름', hoursAgo: 182, hearts: 4,
      title: '해변을 걸으며 빈 양동이를 빌렸어요',
      body: '강릉 안목에서 아이가 조개껍데기를 줍는데 담을 데가 없었어요. 산책하던 가족이 작은 양동이를 빌려줘 모래에 무늬를 찍고 돌려드렸어요.',
    },
    {
      id: 'wonju-market-scale', authorName: '귤차', hoursAgo: 264, hearts: 3,
      title: '시장에서 고른 사과를 몇 알 나눴어요',
      body: '원주 중앙시장에서 산 사과가 혼자 먹기에는 많았어요. 옆의 이웃에게 몇 알을 건넸더니 가장 고운 사과는 제 봉투에 다시 넣어 주셨어요.',
    },
    {
      id: 'sokcho-warm-towel', authorName: '등대옆', hoursAgo: 300, hearts: 4,
      title: '속초 바닷가에서 아이에게 수건을 빌려주셨어요',
      body: '파도가 예상보다 높아 아이의 바지 끝이 젖었어요. 곁에 있던 분이 자기 가족 몫으로 가져온 수건을 나눠 주셨어요.',
    },
    {
      id: 'pyeongchang-long-rest', authorName: '높은쉼표', hoursAgo: 403, hearts: 3,
      title: '평창 마을길에서 느린 걸음에 맞춰 주셨어요',
      body: '걷기 모임에서 뒤처질까 봐 쉬고 싶다는 말을 못 했어요. 앞서던 이웃이 먼저 풍경을 더 보고 싶다며 모두 쉬어 가자고 해 주셨어요.',
    },
    {
      id: 'taebaek-shovel', authorName: '새벽눈', hoursAgo: 479, hearts: 6,
      title: '태백에서 빌린 눈삽으로 두 집 앞에 길을 냈어요',
      body: '밤에 조금 쌓인 눈 때문에 집 앞 턱이 잘 안 보였어요. 옆집에서 빌린 삽으로 양쪽 현관 앞의 눈을 한데 모아 길을 냈어요.',
    },
  ],
  '5200000000': [ // 전북
    {
      id: 'jeonju-hanok-map', authorName: '고운결', hoursAgo: 173, hearts: 6,
      title: '쉬어 갈 만한 길에 동그라미를 그려 주셨어요',
      body: '전주 한옥마을에서 부모님과 천천히 걸을 길을 찾고 있었어요. 가게 이웃이 종이지도에 완만한 길과 중간에 쉴 자리를 표시해 주셨어요.',
    },
    {
      id: 'gunsan-album', authorName: '빈필름', hoursAgo: 224, hearts: 3,
      title: '새로 이사 온 이웃과 동네 사진을 봤어요',
      body: '군산 근대문화거리 사진을 현상하는 동안 옆에서 기다리던 분이 옛 골목 사진을 보여 주셨어요. 사진 속 빵집이 어디였는지도 함께 찾아봤습니다.',
    },
    {
      id: 'iksan-door', authorName: '오늘비', hoursAgo: 274, hearts: 2,
      title: '짐을 두 손에 들고 있을 때 문을 잡아 주셨어요',
      body: '익산에서 도서관에 책을 돌려주러 갔는데 두 손이 가득했어요. 먼저 나가던 이웃이 돌아서서 제가 들어갈 때까지 문을 잡아 주셨어요.',
    },
    {
      id: 'namwon-pedal-reminder', authorName: '곁벗', hoursAgo: 321, hearts: 4,
      title: '남원에서 멈춰 서는 법을 연습할 때 함께해 주셨어요',
      body: '오랜만에 자전거를 타니 출발보다 멈춰 서는 게 어려웠어요. 마주친 이웃이 빈 공터에서 손잡이를 부드럽게 잡는 법을 몇 번 같이 연습해 주셨어요.',
    },
    {
      id: 'gimje-chair-fix', authorName: '들녘수선', hoursAgo: 402, hearts: 5,
      title: '김제 마을회관의 흔들리는 의자를 같이 고쳤어요',
      body: '마을회관에 앉다가 의자 다리 하나가 짧은 걸 알았어요. 이웃이 가져온 얇은 받침을 양면테이프로 붙여 다음 사람도 편하게 앉을 수 있었어요.',
    },
    {
      id: 'buan-extra-dishes', authorName: '모퉁이밥상', hoursAgo: 488, hearts: 5,
      title: '부안에서 미처 챙기지 못한 그릇이 모였어요',
      body: '함께 밥을 먹는 모임에 사람이 더 와서 그릇이 부족했어요. 가까이 사는 분들이 하나씩 가져와 처음 온 이웃도 한 상에 둘러앉았어요.',
    },
  ],
  '5000000000': [ // 제주
    {
      id: 'aewol-drawing-card', authorName: '돌담끝', hoursAgo: 336, hearts: 5,
      title: '애월 돌담길에서 아이의 개를 종이에 그려 주셨어요',
      body: '산책 중 아이가 집에 있는 강아지를 자꾸 보고 싶어 했어요. 작은 스케치북을 가지고 있던 이웃이 이야기를 들으며 강아지 모습을 같이 그렸어요.',
    },
  ],
};

export function makeRegionalExamplePosts(atHoursAgo: (hours: number) => string): Post[] {
  return Object.entries(storiesByRegion).flatMap(([regionId, stories]) =>
    stories.map(({ id, hoursAgo, ...story }) => ({
      ...story,
      id: `example-region-${id}`,
      authorId: `example-regional-author-${id}`,
      regionId,
      createdAt: atHoursAgo(hoursAgo),
    })),
  );
}

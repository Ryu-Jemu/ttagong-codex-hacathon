# 문제 해결

## 글쓰기나 게시 심사 버튼이 보이지 않을 때

Vercel과 `npm run preview`에서 여는 화면은 예시 콘텐츠를 탐색하는 정적 시연입니다. 글쓰기와 Codex 게시 심사는 `npm run dev`로 여는 로컬 개발 화면에서 체험할 수 있습니다. [정적 미리보기와 로컬 개발 서버를 구분한 변경](https://github.com/Ryu-Jemu/ttagong-codex-hacathon/commit/ee12dec)

1. 정적 버전을 보려면 `npm ci` 후 `npm run build && npm run preview`를 실행합니다.
2. 실제 게시 심사를 보려면 `codex login status`로 CLI 로그인 상태를 확인하고 `npm run dev`를 실행합니다.
3. 개발 서버가 출력하는 루프백 주소로 접속합니다. 기본값은 `http://127.0.0.1:5173`입니다. **글쓰기 → 게시 심사 요청** 또는 **노래 추천 → 추천 글 쓰기**에서 합성 예문으로 확인할 수 있습니다.

## 로컬 브라우저에서 심사를 완료하지 못했을 때

- 터미널에서 `codex --version`과 `codex login status`가 실행되는지 확인합니다. 개발 서버를 시작한 터미널의 `PATH`에서 Codex CLI를 찾을 수 있어야 합니다.
- 개발 서버가 안내한 루프백 주소에서 다시 시도합니다. 심사 미들웨어는 같은 주소의 `Origin`에서 보낸 JSON 요청을 받습니다. 글 제목과 본문의 길이는 각각 100자와 1,000자, 노래 추천 이유는 500자까지입니다. 이 길이는 JavaScript 문자열의 UTF-16 코드 단위로 셉니다.
- **게시 차단**과 **심사 보류**는 정책 판정입니다. 표시된 안내에 맞춰 글을 수정하고 다시 요청합니다. **지금 심사를 완료할 수 없어요**가 뜨면 CLI가 실행되는지 확인하고 잠시 뒤 요청합니다. 입력은 작성 화면에서 이어서 수정할 수 있습니다.

[심사 미들웨어](../dev/moderate.ts) · [로컬 심사 추가](https://github.com/Ryu-Jemu/ttagong-codex-hacathon/commit/ee12dec) · [노래 추천 심사 추가](https://github.com/Ryu-Jemu/ttagong-codex-hacathon/commit/5e4f7f7)

## 지도에서 점수와 이웃 지역 이름이 붙어 보일 때

지역마다 숫자를 붙이면서 충북·세종·대전과 울산·부산 주변에서 한 지역의 점수가 다음 지역 이름에 가까워졌습니다. [행정경계 컴포넌트](../src/ui/BoundaryMap.tsx)의 `labelOffsets`에서 충북, 대전, 울산의 표기 위치를 옮겼습니다. 지역 경계와 집계 로직은 각각 [원본 SVG](../src/regions/reference/krmap-sido-boundaries.svg)와 [온기 계산 코드](../src/regions/index.ts)에 있습니다.

모바일에서 홈 아래 지도를 열고 텍스트를 확대해 해당 지역의 지명과 숫자를 확인합니다. 지도를 바로 탭하기 어려우면 지도 아래 **행정구역 선택**과 **소식 보기**로 해당 지역을 엽니다. [지도 표기 위치 조정](https://github.com/Ryu-Jemu/ttagong-codex-hacathon/commit/deb87a2)

## 글자를 키우면 홈 바로가기 제목이 가려질 때

좁은 화면에서 글자 크기를 키우면 읽기 전용 배지가 다음 줄로 넘어가 상단 바가 높아집니다. 고정된 높이만큼 내리면 **이웃 이야기 읽기**를 눌렀을 때 목적지 제목의 일부가 상단 바 뒤에 들어가게 됩니다. [App.tsx](../src/ui/App.tsx)에서 `ResizeObserver`로 실제 높이를 측정해 [스크롤 여백](../src/ui/styles.css)에 반영했습니다.

320px 너비에서 글자를 200%로 키우고 **이웃 이야기 읽기**를 선택합니다. **이웃 소식** 제목이 상단 바 아래에 보이고, 키보드로 한 번 더 이동하면 **최신**에 초점이 잡혀야 합니다. [홈 바로가기와 스크롤 수정](https://github.com/Ryu-Jemu/ttagong-codex-hacathon/commit/c72083a)

## 마지막 예시 답장 뒤 초점을 잃을 때

로컬 대화는 예시 메시지 여섯 개로 시작합니다. 마지막 답장을 보내 메시지가 일곱 개가 되면 입력 폼이 닫힙니다. **보내기** 버튼에 있던 초점은 **시연 메시지 7개를 모두 표시했어요.** 안내로 이동합니다. 키보드로 답장을 보내고 다음 Tab이 하단 메뉴의 **홈**으로 가는지 확인할 수 있습니다. [대화 완료 초점 수정](https://github.com/Ryu-Jemu/ttagong-codex-hacathon/commit/be5c95c)

## 소스 검증

```bash
npm run check
npm test
npm run build
python3 scripts/krmap-tiles.py --check
```

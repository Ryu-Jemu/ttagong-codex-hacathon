# 자료 출처와 라이선스

따공의 자체 코드는 [MIT 라이선스](LICENSE)를 따릅니다. 아래 제3자 자료의 조건은 각 출처에서 확인할 수 있습니다.

| 자료 | 공개본에서 쓰는 범위와 출처 |
| --- | --- |
| 이야기, 프로필 활동, 대화, 알림 | 실행 시 앱이 만드는 합성 예시입니다. 저장소에는 예시를 만드는 코드가 있습니다. |
| 행정구역 지도 | `src/regions/reference/`의 경계와 타일은 [krmap의 고정 커밋](https://github.com/worlyung/krmap/tree/8d6b1df4628ed01fa44ab03ff052dd6d5b9e0d02)에서 가져왔습니다. 원본 데이터는 통계청 통계지리정보서비스(SGIS) 행정구역 경계와 vuski/admdongkor 가공본입니다. 공공누리 제1유형과 CC BY 4.0 출처 조건을 따릅니다. 따공은 표시 여백, 지명 위치, 색과 선택 동작을 추가했습니다. [krmap 자료 고지](https://github.com/worlyung/krmap/blob/8d6b1df4628ed01fa44ab03ff052dd6d5b9e0d02/NOTICE.md) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| 주민등록 인구 | `src/regions/index.ts`에 2026년 10월 말 시도별 총인구 집계를 수록했습니다. 공개 월간 표의 등록구분 ‘전체’ 열을 지도 점수의 분모로 사용합니다. 집계값은 주민등록 거주자, 거주불명자, 재외국민을 포함하며 외국인은 제외합니다. [행정안전부 월간 통계표](https://jumin.mois.go.kr/statMonth.do) |
| Pretendard | Pretendard Variable 1.3.9를 수정 없이 포함합니다. Copyright (c) 2021, Kil Hyung-jin. [배포처](https://github.com/orioncactus/pretendard/releases/tag/v1.3.9) · [SIL Open Font License 1.1](public/fonts/OFL-Pretendard.txt) |
| 사진과 프로필 | 홈과 샘플 카드의 사진은 이미지 생성 도구로 만든 가상 장면입니다. 공개 소스의 프로필은 따공 아이콘을 사용합니다. |
| 노래 | 예시 선곡에는 곡명, 아티스트명, 합성 추천 이유와 공식 재생 링크가 들어 있습니다. 음원과 앨범 이미지는 링크가 가리키는 서비스에서 제공됩니다. |

## 데이터 확인

- Python 3로 `python3 scripts/krmap-tiles.py --check`를 실행하면 포함된 타일 SVG의 지역 이름과 위치가 앱의 목록 데이터와 일치하는지 검사합니다. 생성된 목록을 갱신하려면 `--check`를 빼고 실행합니다.
- 월간 통계표에서 **2026년 10월 → 전국 시도 → 등록구분 전체**를 내려받아 `src/regions/index.ts`의 행정구역 코드와 인구 집계를 확인할 수 있습니다. 행정경계와 인구는 같은 시점의 구역 범위를 사용합니다.

따공은 Codex Community Hackathon – Seoul 참가자가 독립적으로 만든 프로젝트입니다. 브랜드명은 각 권리자에게 귀속됩니다. [행사 안내](https://luma.com/p8l79x8m)

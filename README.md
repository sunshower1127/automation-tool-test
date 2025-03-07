# 웹 자동화 툴 성능비교

## 요약

go의 chromedp하고
node js의 playwright가 서로 비슷한 성능을 보여줌

0.217
0.081

0.180
0.117

아무래도 go-routine이 비동기 로직보다 빠르기때문인듯
중요한건 go 자체의 언어의 난이도와, chromedp의 난이도가
js의 playwright하고 비교하기엔 너무 어렵다는 것.

go-chromedp로 강의 자동화 프로그램 만들려다가 결국 포기함.

---

## 결론

js의 playwright -> 편의성, 성능, 유지보수, docs까지 모두 다 잡음
심지어 동시성 로직도 async로 짜기 매우 쉬움
앞으로 웹 자동화는 **js의 playwright**를 사용할 것임.

---

find and send_key \* 100번

### go-chromedp

동기 테스트 : 0.217160875초
비동기 테스트 : 0.081121291초

### go-rod

동기 테스트: 3.40439075초
비동기 테스트 -> 동시성 설계 X

### python-playwright

동기 테스트 : 0.291864초
비동기 테스트 : 0.131671초

### python-selenium

동기 테스트 : 0.903222초
비동기 테스트 -> 동시성 설계 X

### js-playwright (node)

동기 테스트 : 0.234000초
비동기 테스트 : 0.133000초

### js-playwright type대신 fill사용 (node)

동기 테스트: 0.180000초
비동기 테스트: 0.117000초

### python-playwright type대신 fill사용

동기 테스트: 0.213226초
비동기 테스트: 0.178948초

### js-puppeteer

에러나서 돌리지도 못함 맥 아키텍쳐 이슈인가

### js-cypress

얘는 용도가 다른느낌. 되게 테스트코드 짜기 쉽게 해놓긴함. 일반인도 잘 짤 수 있게 하고
근데 웹 자동화 툴이 아니라 테스트용 툴인 느낌. 실행 속도도 매우 느림.
비동기도 PromiseLike로 지원함. then밖에 없음.

---

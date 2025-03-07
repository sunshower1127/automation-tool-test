import puppeteer from "puppeteer";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  // 자동화 탐지를 피하기 위한 세팅들
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled", // 자동화 제어 기능 비활성화
      "--disable-infobars", // 정보 표시줄 비활성화
      "--window-size=1920,1080", // 창 크기 설정
      "--start-maximized", // 창 최대화
      "--disable-extensions", // 확장 프로그램 비활성화
      "--disable-notifications", // 알림 비활성화
      "--disable-dev-shm-usage", // 공유 메모리 사용 비활성화
      "--lang=ko-KR,ko", // 언어 설정 (한국어)
    ],
    ignoreDefaultArgs: ["--enable-automation"], // 자동화 기본 인수 무시
    defaultViewport: null,
  });

  try {
    // 새 페이지 생성 및 UserAgent 설정
    const page = await browser.newPage();

    // User-Agent 설정 (일반 크롬 브라우저로 위장)
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");

    // 타임아웃 설정
    await page.setDefaultNavigationTimeout(60000);

    // 페이지로 이동
    await page.goto("https://google.com/");

    console.log("done");

    sleep(100000);

    // // 화면 크기 설정
    // await page.setViewport({ width: 1080, height: 1024 });

    // // 검색창에 입력
    // await page.locator(".devsite-search-field").fill("automate beyond recorder");

    // // 첫 번째 결과 클릭
    // await page.locator(".devsite-result-item-link").click();

    // // 제목 찾기
    // const textSelector = await page.locator("text/Customize and automate").waitHandle();
    // const fullTitle = await textSelector?.evaluate((el) => el.textContent);

    // // 제목 출력
    // console.log('The title of this blog post is "%s".', fullTitle);
  } catch (error) {
    console.error("오류 발생:", error);
  } finally {
    // 브라우저 종료
    await browser.close();
  }
})();

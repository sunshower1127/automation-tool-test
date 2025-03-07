import { chromium } from "playwright";

async function runPlaywrightTests() {
  console.log("=== Playwright 테스트 시작 ===");

  // 동기 방식 테스트
  await testSequential();

  // 비동기 방식 테스트
  await testConcurrent();

  console.log("=== Playwright 테스트 완료 ===\n");
}

async function testSequential() {
  console.log("Playwright - 순차적 실행 100번 타이핑:");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.google.com");

  const startTime = Date.now();

  // 순차적으로 100번 타이핑
  for (let i = 0; i < 100; i++) {
    await page.locator('textarea[name="q"]').textContent();
  }

  const duration = (Date.now() - startTime) / 1000;
  console.log(`완료 시간: ${duration.toFixed(6)}초`);

  await browser.close();
  return duration;
}

async function testConcurrent() {
  console.log("Playwright - 비동기 실행 100번 타이핑:");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.google.com");

  const startTime = Date.now();

  // 비동기로 100개 작업 생성
  const tasks = Array(100)
    .fill()
    .map(() => page.locator('textarea[name="q"]').textContent());

  // 모든 작업 병렬 실행
  await Promise.all(tasks);

  const duration = (Date.now() - startTime) / 1000;
  console.log(`완료 시간: ${duration.toFixed(6)}초`);

  await browser.close();
  return duration;
}

// 테스트 실행
(async () => {
  await runPlaywrightTests();
})();

const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

async function runAllTests() {
  console.log("=== 모든 테스트를 실행합니다 ===\n");

  try {
    // Playwright 테스트 실행
    console.log("Playwright 테스트 실행 중...");
    const playwrightResult = await execPromise("node playwright-test.js");
    console.log(playwrightResult.stdout);

    // Puppeteer 테스트 실행
    console.log("Puppeteer 테스트 실행 중...");
    const puppeteerResult = await execPromise("node puppeteer-test.js");
    console.log(puppeteerResult.stdout);

    // Cypress는 별도의 방식으로 실행해야 함
    console.log("Cypress는 별도로 다음 명령어로 실행하세요:");
    console.log("npx cypress run --spec cypress-test.js");

    console.log("\n=== 모든 테스트가 완료되었습니다 ===");
  } catch (error) {
    console.error("테스트 실행 중 오류 발생:", error);
  }
}

runAllTests();

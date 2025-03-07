// Cypress는 테스트 러너 내에서 실행되므로, 아래 코드는 cypress/integration/ 폴더 내에 넣어야 합니다.
// 이 파일은 Cypress 테스트 정의만 포함합니다.

describe("Cypress 타이핑 테스트", () => {
  it("순차적 실행 100번 타이핑", () => {
    cy.visit("https://www.google.com");

    const startTime = Date.now();

    // Cypress는 기본적으로 순차적 실행만 지원
    // 100번 타이핑 수행
    for (let i = 0; i < 100; i++) {
      cy.get('textarea[name="q"]').type("a");
    }

    // Cypress에서 시간 측정은 테스트 완료 후 수동으로 확인해야 함
    cy.then(() => {
      const duration = (Date.now() - startTime) / 1000;
      console.log(`Cypress 순차적 실행 완료 시간: ${duration.toFixed(6)}초`);
    });
  });

  // Cypress는 기본적으로 비동기 병렬 실행을 지원하지 않음
  // 대신 cypress-parallel 같은 플러그인을 사용하거나
  // Cypress의 각 명령어는 기본적으로 Promise 체인으로 동작함
  it("최적화된 타이핑 (단일 명령으로 100자 입력)", () => {
    cy.visit("https://www.google.com");

    const startTime = Date.now();

    // 한 번의 명령어로 100개 문자 입력 (대안적 방법)
    cy.get('textarea[name="q"]').type("a".repeat(100));

    cy.then(() => {
      const duration = (Date.now() - startTime) / 1000;
      console.log(`Cypress 최적화 실행 완료 시간: ${duration.toFixed(6)}초`);
    });
  });
});

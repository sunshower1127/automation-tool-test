describe("Playwright 테스트를 Cypress로 변환", () => {
  // 시간을 측정하기 위한 헬퍼 함수
  const timeStart = () => new Date().getTime();
  const timeEnd = (startTime) => (new Date().getTime() - startTime) / 1000;

  it("테스트 1: 단일 실행으로 100개 액션 처리", () => {
    cy.visit("https://www.google.com");

    // 시간 측정 시작
    let startTime;
    cy.then(() => {
      startTime = timeStart();
      console.log("=== 테스트 1: 단일 실행에 100개 액션 넣기 ===");
    });

    // 100번 'a' 입력 (한번에 모든 액션)
    let actions = cy.get('textarea[name="q"]');
    for (let i = 0; i < 100; i++) {
      actions = actions.type("a");
    }

    // 시간 측정 종료 및 결과 출력
    actions.then(() => {
      const duration = timeEnd(startTime);
      console.log(`완료 시간: ${duration.toFixed(6)}초`);
      cy.wrap(duration).as("time1");
    });
  });

  it("테스트 2: 여러 실행으로 각각 하나의 액션 처리", () => {
    cy.visit("https://www.google.com");

    // 시간 측정 시작
    let startTime;
    cy.then(() => {
      startTime = timeStart();
      console.log("\n=== 테스트 2: 여러 실행에 각각 하나의 액션 넣기 ===");
    });

    // 타입 작업을 순차적으로 실행
    const typeActions = Array(100)
      .fill()
      .map(() => {
        return () => cy.get('textarea[name="q"]').type("a");
      });

    // 순차적으로 실행
    let chain = cy.wrap(null);
    typeActions.forEach((action) => {
      chain = chain.then(action);
    });

    // 시간 측정 종료 및 결과 출력
    chain.then(() => {
      const duration = timeEnd(startTime);
      console.log(`완료 시간: ${duration.toFixed(6)}초`);
      cy.wrap(duration).as("time2");
    });
  });

  it('테스트 3: "동시" 실행 (Cypress 방식으로 최대한 근접)', () => {
    cy.visit("https://www.google.com");

    // 시간 측정 시작
    let startTime;
    cy.then(() => {
      startTime = timeStart();
      console.log("\n=== 테스트 3: Cypress 방식 최적화 ===");
    });

    // 참고: Cypress는 진정한 병렬 실행을 지원하지 않지만,
    // 가능한 최적화된 방식으로 구현
    cy.get('textarea[name="q"]').then(($input) => {
      // DOM 요소를 직접 조작하여 최대한 빠르게 텍스트 입력
      const value = "a".repeat(100);
      $input.val($input.val() + value);
      $input[0].dispatchEvent(new Event("input", { bubbles: true }));
    });

    // 시간 측정 종료 및 결과 출력
    cy.then(() => {
      const duration = timeEnd(startTime);
      console.log(`완료 시간: ${duration.toFixed(6)}초`);
      cy.wrap(duration).as("time3");
    });
  });

  // 결과 비교를 위한 추가 테스트
  it("결과 비교", () => {
    cy.get("@time1").then((time1) => {
      cy.get("@time2").then((time2) => {
        cy.get("@time3").then((time3) => {
          console.log("\n=== 결과 비교 ===");
          console.log(`테스트 1 (단일 실행, 100 액션): ${time1.toFixed(6)}초`);
          console.log(`테스트 2 (100 실행, 각 1 액션): ${time2.toFixed(6)}초`);
          console.log(`테스트 3 (Cypress 최적화): ${time3.toFixed(6)}초`);
        });
      });
    });
  });
});

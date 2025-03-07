import asyncio
import concurrent.futures
import time

from playwright.async_api import async_playwright


async def test1_single_run_many_actions():
    """테스트 1: 단일 실행으로 100개 액션 처리"""
    print("=== 테스트 1: 단일 실행에 100개 액션 넣기 ===")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Google로 이동
        await page.goto("https://www.google.com")

        # 시간 측정 시작
        start_time = time.time()

        # 검색창에 100번 'a' 입력 (한번에 액션 모음)
        for i in range(100):
            await page.locator('textarea[name="q"]').text_content()

        duration = time.time() - start_time
        print(f"완료 시간: {duration:.6f}초")

        await browser.close()
        return duration


async def test2_multiple_runs_single_action():
    """테스트 2: 여러 실행으로 각각 하나의 액션 처리"""
    print("\n=== 테스트 2: 여러 실행에 각각 하나의 액션 넣기 ===")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Google로 이동
        await page.goto("https://www.google.com")

        # 시간 측정 시작
        start_time = time.time()

        # 각각 별도로 실행
        for i in range(100):
            await page.locator('textarea[name="q"]').text_content()

        duration = time.time() - start_time
        print(f"완료 시간: {duration:.6f}초")

        await browser.close()
        return duration


async def run_action(page):
    """테스트 3에서 사용할 단일 액션"""
    await page.locator('textarea[name="q"]').text_content()


async def test3_concurrent_runs():
    """테스트 3: 동시 실행으로 각각 하나의 액션 처리"""
    print("\n=== 테스트 3: 비동기로 여러 실행에 각각 하나의 액션 넣기 ===")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Google로 이동
        await page.goto("https://www.google.com")

        # 시간 측정 시작
        start_time = time.time()

        # 100개 작업을 동시에 실행
        tasks = [run_action(page) for _ in range(100)]
        await asyncio.gather(*tasks)

        duration = time.time() - start_time
        print(f"완료 시간: {duration:.6f}초")

        await browser.close()
        return duration


async def main():
    """메인 함수: 모든 테스트 실행 및 결과 비교"""
    time1 = await test1_single_run_many_actions()
    time2 = await test2_multiple_runs_single_action()
    time3 = await test3_concurrent_runs()

    # 결과 비교
    print("\n=== 결과 비교 ===")
    print(f"테스트 1 (단일 실행, 100 액션): {time1:.6f}초")
    print(f"테스트 2 (100 실행, 각 1 액션): {time2:.6f}초")
    print(f"테스트 3 (비동기 100 작업, 각 1 액션): {time3:.6f}초")


if __name__ == "__main__":
    asyncio.run(main())

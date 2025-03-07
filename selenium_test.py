import asyncio
import concurrent.futures
import time

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By


def test1_single_run_many_actions():
    """테스트 1: 단일 실행으로 100개 액션 처리"""
    print("=== 테스트 1: 단일 실행에 100개 액션 넣기 ===")

    # Chrome 옵션 설정
    options = Options()
    options.add_argument("--headless")

    # 웹드라이버 초기화
    driver = webdriver.Chrome(options=options)

    # Google로 이동
    driver.get("https://www.google.com")

    # 검색창 찾기
    search_box = driver.find_element(By.NAME, "q")

    # 시간 측정 시작
    start_time = time.time()

    # 검색창에 100번 'a' 입력 (한번에 액션 모음)
    for i in range(100):
        search_box.send_keys("a")

    duration = time.time() - start_time
    print(f"완료 시간: {duration:.6f}초")

    driver.quit()
    return duration


def test2_multiple_runs_single_action():
    """테스트 2: 여러 실행으로 각각 하나의 액션 처리"""
    print("\n=== 테스트 2: 여러 실행에 각각 하나의 액션 넣기 ===")

    # Chrome 옵션 설정
    options = Options()
    options.add_argument("--headless")

    # 웹드라이버 초기화
    driver = webdriver.Chrome(options=options)

    # Google로 이동
    driver.get("https://www.google.com")

    # 검색창 찾기
    search_box = driver.find_element(By.NAME, "q")

    # 시간 측정 시작
    start_time = time.time()

    # 각각 별도로 실행
    for i in range(100):
        search_box.send_keys("a")

    duration = time.time() - start_time
    print(f"완료 시간: {duration:.6f}초")

    driver.quit()
    return duration


def run_action(driver):
    """테스트 3에서 사용할 단일 액션"""
    search_box = driver.find_element(By.NAME, "q")
    search_box.send_keys("a")


def test3_concurrent_runs():
    """테스트 3: 병렬 실행으로 각각 하나의 액션 처리"""
    print("\n=== 테스트 3: 병렬로 여러 실행에 각각 하나의 액션 넣기 ===")

    # Chrome 옵션 설정
    options = Options()
    options.add_argument("--headless")

    # 웹드라이버 초기화
    driver = webdriver.Chrome(options=options)

    # Google로 이동
    driver.get("https://www.google.com")

    # 시간 측정 시작
    start_time = time.time()

    # ThreadPoolExecutor를 사용하여 병렬로 작업 실행
    # 참고: Selenium은 기본적으로 스레드 안전하지 않으므로, 실제로는 병렬로 동작하지 않을 수 있음
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(run_action, driver) for _ in range(100)]
        concurrent.futures.wait(futures)

    duration = time.time() - start_time
    print(f"완료 시간: {duration:.6f}초")

    driver.quit()
    return duration


def main():
    """메인 함수: 모든 테스트 실행 및 결과 비교"""
    time1 = test1_single_run_many_actions()
    time2 = test2_multiple_runs_single_action()
    time3 = test3_concurrent_runs()

    # 결과 비교
    print("\n=== 결과 비교 ===")
    print(f"테스트 1 (단일 실행, 100 액션): {time1:.6f}초")
    print(f"테스트 2 (100 실행, 각 1 액션): {time2:.6f}초")
    print(f"테스트 3 (병렬 100 작업, 각 1 액션): {time3:.6f}초")


if __name__ == "__main__":
    main()

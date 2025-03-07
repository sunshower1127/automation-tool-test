package main

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
)

func main() {
	// 각 테스트 실행
	fmt.Println("=== 테스트 1: 순차적으로 100개 액션 실행하기 ===")
	syncTime := runSynchronousActions()

	fmt.Println("\n=== 테스트 2: Goroutine으로 100개 액션 병렬 실행하기 ===")
	asyncTime := runAsynchronousActions()

	// 결과 비교
	fmt.Println("\n=== 결과 비교 ===")
	fmt.Printf("테스트 1 (순차 실행, 100 액션): %v\n", syncTime)
	fmt.Printf("테스트 2 (Goroutine 병렬 실행, 100 액션): %v\n", asyncTime)
}

// 테스트 1: 순차적으로 100개 액션 실행하기
func runSynchronousActions() time.Duration {
	// 브라우저 시작 - 자동화 감지 회피 설정
	url := launcher.New().
		Set("disable-blink-features", "AutomationControlled").
		MustLaunch()

	browser := rod.New().ControlURL(url).MustConnect()
	defer browser.MustClose()

	// 새 페이지 열기
	page := browser.MustPage("https://www.google.com")

	// 검색창 찾기
	searchBox := page.MustElement(`textarea[name="q"]`)

	// 시간 측정 시작
	start := time.Now()

	// 순차적으로 100번 입력
	for i := 0; i < 100; i++ {
		searchBox.MustInput("a")
	}

	duration := time.Since(start)
	fmt.Printf("완료 시간: %v\n", duration)
	return duration
}

// 테스트 2: Goroutine으로 100개 액션 병렬 실행하기
func runAsynchronousActions() time.Duration {
	// 브라우저 시작 - 자동화 감지 회피 설정
	url := launcher.New().
		Set("disable-blink-features", "AutomationControlled").
		MustLaunch()

	browser := rod.New().ControlURL(url).MustConnect()
	defer browser.MustClose()

	// 새 페이지 열기
	page := browser.MustPage("https://www.google.com")

	// 검색창 찾기
	searchBox := page.MustElement(`textarea[name="q"]`)

	var wg sync.WaitGroup
	wg.Add(100)

	// 시간 측정 시작
	start := time.Now()

	// 고루틴으로 100개 병렬 실행
	for i := 0; i < 100; i++ {
		go func() {
			defer wg.Done()
			// Rod는 쓰레드 안전(thread-safe)하지 않을 수 있으므로 주의 필요
			err := searchBox.Input("a")
			if err != nil {
				log.Printf("오류 발생: %v", err)
			}
		}()
	}

	wg.Wait()

	duration := time.Since(start)
	fmt.Printf("완료 시간: %v\n", duration)
	return duration
}

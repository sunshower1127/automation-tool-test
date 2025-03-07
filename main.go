package main

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/chromedp/chromedp"
)

func main() {
	// 각 테스트 실행
	fmt.Println("=== 테스트 1: 단일 Run에 100개 액션 넣기 ===")
	singleRunTime := runSingleRunManyActions()

	fmt.Println("\n=== 테스트 2: 여러 Run에 각각 하나의 액션 넣기 ===")
	multipleRunTime := runMultipleRunSingleAction()

	fmt.Println("\n=== 테스트 3: Goroutine으로 여러 Run에 각각 하나의 액션 넣기 ===")
	goroutineTime := runMultipleRunWithGoroutines()

	// 결과 비교
	fmt.Println("\n=== 결과 비교 ===")
	fmt.Printf("테스트 1 (단일 Run, 100 액션): %v\n", singleRunTime)
	fmt.Printf("테스트 2 (100 Run, 각 1 액션): %v\n", multipleRunTime)
	fmt.Printf("테스트 3 (100 Goroutine, 각 1 액션): %v\n", goroutineTime)
}

// 테스트 1: 단일 Run에 100개 액션 넣기
func runSingleRunManyActions() time.Duration {

	// 브라우저 설정
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("disable-blink-features", "AutomationControlled"), // 자동화 흔적 없애기 -> 구글 검색 뚫기
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	// Google로 이동하는 기본 작업
	if _, err := chromedp.RunResponse(ctx, chromedp.Navigate("https://www.google.com")); err != nil {
		log.Fatal(err)
	}

	// 100개 SendKeys 액션 준비
	var actions []chromedp.Action
	for i := 0; i < 100; i++ {
		actions = append(actions, chromedp.SendKeys(`textarea[name="q"]`, "a", chromedp.ByQuery))
	}

	start := time.Now()
	// 모든 액션을 한 번의 Run으로 실행
	if err := chromedp.Run(ctx, actions...); err != nil {
		log.Fatal(err)
	}

	duration := time.Since(start)
	fmt.Printf("완료 시간: %v\n", duration)
	return duration
}

// 테스트 2: 여러 Run에 각각 하나의 액션 넣기
func runMultipleRunSingleAction() time.Duration {

	// 브라우저 설정
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("disable-blink-features", "AutomationControlled"), // 자동화 흔적 없애기 -> 구글 검색 뚫기
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	// Google로 이동
	if _, err := chromedp.RunResponse(ctx, chromedp.Navigate("https://www.google.com")); err != nil {
		log.Fatal(err)
	}

	start := time.Now()
	// 100번 각각 Run 호출하여 SendKeys 실행
	for i := 0; i < 100; i++ {
		if err := chromedp.Run(ctx, chromedp.SendKeys(`textarea[name="q"]`, "a", chromedp.ByQuery)); err != nil {
			log.Fatal(err)
		}
	}

	duration := time.Since(start)
	fmt.Printf("완료 시간: %v\n", duration)
	return duration
}

// 테스트 3: Goroutine으로 여러 Run에 각각 하나의 액션 넣기
func runMultipleRunWithGoroutines() time.Duration {

	// 브라우저 설정
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("disable-blink-features", "AutomationControlled"), // 자동화 흔적 없애기 -> 구글 검색 뚫기
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	// Google로 이동
	if _, err := chromedp.RunResponse(ctx, chromedp.Navigate("https://www.google.com")); err != nil {
		log.Fatal(err)
	}

	var wg sync.WaitGroup
	wg.Add(100)

	start := time.Now()
	// 100개의 goroutine으로 SendKeys 실행
	for i := 0; i < 100; i++ {
		go func() {
			defer wg.Done()
			if err := chromedp.Run(ctx, chromedp.SendKeys(`textarea[name="q"]`, "a", chromedp.ByQuery)); err != nil {
				log.Printf("오류 발생: %v", err)
			}
		}()
	}

	wg.Wait()

	duration := time.Since(start)
	fmt.Printf("완료 시간: %v\n", duration)
	return duration
}

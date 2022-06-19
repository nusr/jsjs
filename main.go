package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"os"
	"runtime/debug"
	"sync"
	"time"
)

func reply() {
	input := bufio.NewScanner(os.Stdin)
	fmt.Print("> ")
	environment := NewEnvironment(nil)
	for input.Scan() {
		line := input.Text()
		if line == ".exit" {
			break
		}
		interpret(line, environment)
		fmt.Print("> ")
	}
}

func runFile(fileName string) {
	content, err := ioutil.ReadFile(fileName)
	if err != nil {
		fmt.Printf("can not open file \"%s\", error: %v", fileName, err)
		return
	}
	environment := NewEnvironment(nil)
	interpret(string(content), environment)
}

func isTestEnv() bool {
	return len(os.Args) >= 2 && os.Args[1] == "test"
}

var filePaths []string

func readFiles(dirPath string) {
	dirs, err := ioutil.ReadDir(dirPath)
	if err != nil {
		fmt.Println(err)
		return
	}
	for _, item := range dirs {
		filePath := dirPath + "/" + item.Name()
		if item.IsDir() {
			readFiles(filePath)
		} else {
			filePaths = append(filePaths, filePath)
		}
	}

}

func writeTestResult(total int, fail int) {
	fileName := "./scripts/go-test.log"
	content, err := ioutil.ReadFile(fileName)
	if err != nil {
		fmt.Println(err)
		return
	}
	message := []byte(fmt.Sprintf("total: %d,success: %d, time: %v\n", total, total-fail, time.Now()))
	message = append(message, content...)
	err = ioutil.WriteFile(fileName, message, 0644)
	if err != nil {
		fmt.Println(err)
	}
}

func runTest() {
	var fail = 0
	filePaths = nil
	startDir := "test"
	if len(os.Args) == 3 {
		startDir = os.Args[2]
	}
	readFiles(startDir)
	wg := sync.WaitGroup{}
	wg.Add(20)
	for _, filePath := range filePaths {
		go func(t string) {
			defer func() {
				if err := recover(); err != nil {
					fail++
					fmt.Printf("runTest filePath:%s, err: %s, stack: %s\n", t, err, debug.Stack())
				}
			}()
			runFile(t)
			wg.Done()
		}(filePath)
	}
	wg.Wait()
	total := len(filePaths)
	fmt.Printf("total:%d,success: %d\n", total, total-fail)
	writeTestResult(total, fail)
}

func main() {
	if isTestEnv() {
		runTest()
		return
	}
	argc := len(os.Args)
	if argc == 1 {
		reply()
	} else if argc == 2 {
		runFile(os.Args[1])
	} else {
		fmt.Println("Usage: lox [path]")
		os.Exit(64)
	}
}

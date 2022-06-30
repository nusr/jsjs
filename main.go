package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"os"
	"strings"
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

func writeTestResult(text string) {
	fileName := "./scripts/go-test.log"
	content, err := ioutil.ReadFile(fileName)
	if err != nil {
		fmt.Println(err)
		return
	}
	message := []byte(text)
	message = append(message, content...)
	err = ioutil.WriteFile(fileName, message, 0644)
	if err != nil {
		fmt.Println(err)
	}
}

func isBlackList(filePath string) bool {
	blackList := []string{"inheritance", "function", "if/", "for/"}
	for _, item := range blackList {
		if strings.Contains(filePath, item) {
			return true
		}
	}
	return false
}

func runTest() {
	var fail = 0
	filePaths = nil
	startDir := "test"
	if len(os.Args) == 3 {
		startDir = os.Args[2]
	}
	readFiles(startDir)
	//wg := sync.WaitGroup{}
	//wg.Add(20)
	for _, filePath := range filePaths {
		if isBlackList(filePath) {
			continue
		}
		func() {
			defer func() {
				if err := recover(); err != any(nil) {
					fail++
					fmt.Printf("runTest filePath: %s\n", filePath)
				}
			}()
			runFile(filePath)
			//wg.Done()
		}()
	}
	//wg.Wait()
	total := len(filePaths)
	text := fmt.Sprintf("total: %d,success: %d,expect-success: %d,expect-fail: %d,time: %v\n", total, total-fail, globalExpect.success, globalExpect.fail, time.Now())
	fmt.Println(text)
	if len(os.Args) == 2 {
		writeTestResult(text)
	}
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

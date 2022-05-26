package main

import (
	"fmt"
	"io/ioutil"
	"os"
)

func reply() {
	var line string
	for {
		fmt.Print("> ")
		_, err := fmt.Scanln(&line)
		if err != nil {
			fmt.Println(err)
			break
		}
		interpret(line)
	}
}

func funFile(fileName string) {
	content, err := ioutil.ReadFile(fileName)
	if err != nil {
		fmt.Printf("can not open file \"%s\", error: %v", fileName, err)
		return
	}
	interpret(string(content))
}

func main() {
	argc := len(os.Args)
	if argc == 1 {
		reply()
	} else if argc == 2 {
		funFile(os.Args[1])
	} else {
		fmt.Println("Usage: lox [path]")
		os.Exit(64)
	}
}

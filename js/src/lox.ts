import Scanner from './scanner';

class Lox {
  public run(text: string) {
    const scanner = new Scanner(text);
    const tokens = scanner.scanTokens();
    for (const item of tokens) {
      console.log(item);
    }
  }
}

export default Lox;

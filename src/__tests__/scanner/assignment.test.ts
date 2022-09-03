import Scanner from "../../scanner";
import Token from "../../token";
import { TokenType } from "../../tokenType";
type TestItem = {
  input: string;
  exepct: Token[];
  name: string;
};
describe("assignment.test.ts", () => {
  const list: TestItem[] = [
    {
      input: 'var a = "a";',
      exepct: [
        new Token(TokenType.VAR, "var", 1),
        new Token(TokenType.IDENTIFIER, "a", 1),
        new Token(TokenType.EQUAL, "=", 1),
        new Token(TokenType.STRING, "a", 1),
        new Token(TokenType.SEMICOLON, ";", 1),
        new Token(TokenType.EOF, "", 1),
      ],
      name: "baisc",
    },
  ];
  for (const item of list) {
    test(item.name, () => {
      expect(new Scanner(item.input).scanTokens()).toEqual(item.exepct);
    });
  }
});

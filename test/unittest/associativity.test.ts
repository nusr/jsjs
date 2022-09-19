import Parser from '../../src/parser';
import Scanner from '../../src/scanner';

describe('associativity.test.ts', () => {
  const list: Array<{ input: string; expect: string }> = [
    {
      input: `1 + 2 * 3`,
      expect: '(1 + (2 * 3))',
    },
    {
      input: `1 + 2 - 3`,
      expect: '((1 + 2) - 3)',
    },
  ];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    test(`associativity ${i + 1}`, () => {
      const scanner = new Scanner(item.input);
      const tokens = scanner.scanTokens();
      const parser = new Parser(tokens);
      const statements = parser.parse();
      const result: string[] = [];
      for (const item of statements) {
        result.push(item.toString().replace(';', ''));
      }
      expect(result.join('')).toEqual(item.expect);
    });
  }
});
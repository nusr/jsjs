import path from 'path';
import fs from 'fs';

function defineAST(fileName: string, list: string[], imports: string) {
  const realFileName = fileName[0].toLowerCase() + fileName.slice(1);
  const filePath = path.join(process.cwd(), 'src', `${realFileName}.ts`);
  const params = list.map((item) => {
    const [className, temp] = item.split('#');
    const names = temp.split(',').map((v) => v.trim());

    return {
      className: className.trim(),
      names: names.map((v) => v.trim()),
    };
  });
  const visitor = params
    .map((item) => {
      const { className } = item;
      return `  visit${className}${fileName}: (${realFileName}: ${className}${fileName}) => LiteralType;`;
    })
    .join('\n');
  const visitorName = `${fileName}Visitor`;
  const classList = params.map((item) => {
    const { className, names } = item;
    const temp = names.map((t) => t.split(':').shift());
    return `export class ${className}${fileName} extends ${fileName} {
${names.map((v) => `  readonly ${v};`).join('\n')}
  constructor(${names.join(', ')}) {
    super();
${temp.map((v) => `    this.${v} = ${v};`).join('\n')}
  }
  accept(visitor: ${visitorName}): LiteralType {
    return visitor.visit${className}${fileName}(this);
  }
}`;
  });

  const text = `${imports};\nexport interface ${visitorName} {\n${visitor}\n}\nexport abstract class ${fileName} {
  abstract accept(visitor: ${visitorName}): LiteralType;
}\n${classList.join('\n')}
  `;
  fs.writeFile(filePath, text, 'utf-8', (error) => {
    if (error) {
      console.log('generateAST error: ', error);
    }
  });
}

const expressionName = 'Expression';

defineAST(
  'Expression',
  [
    `Assign # name: Token, value: ${expressionName}`,
    `Binary # left: ${expressionName}, operator: Token, right: ${expressionName}`,
    `Call # callee: ${expressionName}, paren: Token, argumentList: ${expressionName}[]`,
    `Get # object: ${expressionName}, name: Token`,
    `Set # object: ${expressionName}, name: Token, value: ${expressionName}`,
    `Grouping # expression: ${expressionName}`,
    `Literal # value: LiteralType`,
    `Logical # left: ${expressionName}, operator: Token, right: ${expressionName}`,
    `Super # keyword: Token, value: ${expressionName}`,
    `This # keyword: Token`,
    `Unary # operator: Token, right: ${expressionName}`,
    `Variable # name: Token`,
  ],
  "import type Token from './token';\nimport type { LiteralType } from './type';",
);

const StatementName = 'Statement';

defineAST(
  'Statement',
  [
    `Block # statements: ${StatementName}[]`,
    `Class # name: Token, superClass: VariableExpression, methods: FunctionStatement[]`,
    `Expression # expression: ${expressionName}`,
    `Function # name: Token, body: BlockStatement, params: Token[]`,
    `If # condition: ${expressionName}, thenBranch: ${StatementName}, elseBranch: ${StatementName} | null`,
    `Print # expression: ${expressionName}, comment: Token | null`,
    `Return # keyword: Token, value: ${expressionName} | null`,
    `Variable # name: Token, initializer: ${expressionName} | null`,
    `While # condition: ${expressionName}, body: ${StatementName}`,
  ],
  "import type Token from './token';\nimport type { Expression, VariableExpression } from './expression';\nimport type { LiteralType } from './type';",
);

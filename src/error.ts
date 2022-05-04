import type Token from './Token';
function errorHandler() {
  const errorList: string[] = [];
  let hadError = false;
  const report = (line: number, where: string, message: string) => {
    const msg = `[line ${line}] Error ${where} : ${message} `;
    errorList.push(msg);
    console.log(msg);
    hadError = true;
  };
  const error = (line: number, message: string) => {
    report(line, '', message);
  };
  const get = () => {
    return hadError;
  };
  const reset = () => {
    if (errorList.length > 0) {
      console.log('error list:', errorList);
    }
    hadError = false;
  };
  return {
    error,
    get,
    reset,
  };
}

class RuntimeError extends Error {
  constructor(token: Token, message: string) {
    super(`runtime error: ${token.toString()},message: ${message}`);
  }
}

const defaultErrorHandler = errorHandler();
export { defaultErrorHandler, errorHandler, RuntimeError };

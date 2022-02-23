function errorHandler() {
  let hadError = false;
  const report = (line: number, where: string, message: string) => {
    console.log(`[line ${line}] Error ${where} : ${message} `);
    hadError = true;
  };
  const error = (line: number, message: string) => {
    report(line, '', message);
  };
  const get = () => {
    return hadError;
  };
  const set = (value: boolean) => {
    hadError = value;
  };
  return {
    error,
    get,
    set,
  };
}

const defaultErrorHandler = errorHandler();
export { defaultErrorHandler, errorHandler };

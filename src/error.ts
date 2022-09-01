import type Token from './token';

class RuntimeError extends Error {
  constructor(token: Token, message: string) {
    super(`runtime error: ${token.toString()},message: ${message}`);
  }
}

export { RuntimeError };

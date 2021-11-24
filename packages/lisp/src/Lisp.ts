type TokenType = 'LEFT' | 'RIGHT' | 'STRING' | 'NUMBER' | 'NAME' | 'SPACE';
interface IBaseToken {
  source: string;
  type: TokenType;
}
interface ILeftToken extends IBaseToken {
  type: 'LEFT';
}
interface IRightToken extends IBaseToken {
  type: 'RIGHT';
}
interface IStringToken extends IBaseToken {
  type: 'STRING';
  value: string;
}
interface INumberToken extends IBaseToken {
  type: 'NUMBER';
  value: number;
}
interface INameToken extends IBaseToken {
  type: 'NAME';
}
interface ISpaceToken extends IBaseToken {
  type: 'SPACE';
}
type IToken =
  | ILeftToken
  | IRightToken
  | IStringToken
  | INumberToken
  | INameToken
  | ISpaceToken;
interface IException {
  type: IToken;
  params: IException[];
}
export class Lisp {
  public static ctx: Record<string, unknown> = {};
  private static makeToken(token: string): IToken {
    if (token === '(') {
      return { type: 'LEFT', source: token };
    }
    if (token === ')') {
      return { type: 'RIGHT', source: token };
    }
    if (token === ' ') {
      return { type: 'SPACE', source: token };
    }
    if (token.startsWith('"') && token.endsWith('"')) {
      return {
        type: 'STRING',
        value: token.substr(1, token.length - 2),
        source: token
      };
    }
    if (
      /[0-9]/.test(token[0]) ||
      (token[0] === '-' && /[0-9]/.test(token[1]))
    ) {
      return {
        type: 'NUMBER',
        value: parseFloat(token),
        source: token
      };
    }
    return { type: 'NAME', source: token } as INameToken;
  }
  private static ate(tokenList: IToken[], offset = 0, end = 0) {
    const result: IToken[] = [];
    let level = 0;
    for (
      let index = offset;
      index < (end !== 0 ? end : tokenList.length);
      index++
    ) {
      const token = tokenList[index];
      if (result.length === 0 && token.type === 'SPACE') {
        continue;
      }
      result.push(token);
      if (token.type === 'LEFT') {
        level++;
      }
      if (token.type === 'RIGHT') {
        level--;
      }
      if (token.type === 'SPACE' && level === 0) {
        break;
      }
    }
    return result;
  }
  private static compile(tokenList: IToken[]) {
    while (tokenList[0].type === 'SPACE') {
      tokenList.splice(0, 1);
    }
    while (tokenList[tokenList.length - 1].type === 'SPACE') {
      tokenList.splice(tokenList.length - 1, 1);
    }
    if (tokenList.length === 1) {
      return { type: tokenList[0], params: [] } as IException;
    }
    const exception = { type: tokenList[1], params: [] } as IException;
    let current = 2;
    while (current < tokenList.length - 2) {
      const paramList = this.ate(tokenList, current, tokenList.length - 1);
      current += paramList.length;
      exception.params.push(this.compile(paramList));
    }
    return exception;
  }
  private static split(code: string) {
    const result: IToken[] = [];
    let tmp = '';
    const arr = code.split('');
    let flag = false;
    arr.forEach((item, index) => {
      if (item === '"') {
        flag = !flag;
      }
      tmp += item;
      const next = arr[index + 1];
      if (
        next === undefined ||
        ((next === '(' || next === ')' || next === ' ') && !flag)
      ) {
        result.push(Lisp.makeToken(tmp));
        tmp = '';
      } else {
        if (tmp === '(' || tmp === ')' || tmp === ' ') {
          result.push(Lisp.makeToken(tmp));
          tmp = '';
        }
      }
    });
    return result;
  }
  private static exec(expr: IException, ctx: Record<string, unknown>): unknown {
    switch (expr.type.type) {
      case 'NUMBER':
        return expr.type.value;
      case 'STRING':
        return expr.type.value;
      case 'NAME':
        const value = ctx[expr.type.source];
        if (typeof value === 'function') {
          return value(...expr.params.map((p) => this.exec(p, ctx)));
        } else {
          return value;
        }
    }
  }

  public static eval(code: string, ctx: Record<string, unknown>) {
    const tokenList = this.split(code);
    const expr = this.compile(tokenList);
    return this.exec(expr, { ...Lisp.ctx, ...ctx });
  }
}

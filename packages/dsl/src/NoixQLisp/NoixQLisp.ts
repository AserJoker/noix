import { NoixQLispNode } from './NoixQLispNode';

interface IPatten {
  name: string;
  type: 'symbol' | 'string' | 'token' | 'number' | 'boolean';
}
export class NoixQLisp {
  public static ResolveToPatten(qlisp: string): IPatten[] {
    const res: IPatten[] = [];
    for (let index = 0; index < qlisp.length; index++) {
      if (['(', ')'].includes(qlisp.charAt(index))) {
        res.push({
          name: qlisp.charAt(index),
          type: 'symbol'
        });
      } else if (qlisp.charAt(index) === '"') {
        let inString = false;
        const pat = { name: '', type: 'string' } as IPatten;
        for (; index < qlisp.length; index++) {
          pat.name += qlisp.charAt(index);
          if (qlisp[index] === '"') {
            inString = !inString;
            if (!inString) {
              break;
            }
          }
        }
        res.push(pat);
      } else if (/\d/.test(qlisp.charAt(index))) {
        const pat = { name: '', type: 'number' } as IPatten;
        for (; index < qlisp.length; index++) {
          pat.name += qlisp.charAt(index);
          if (/\D/.test(qlisp.charAt(index + 1))) {
            break;
          }
        }
        res.push(pat);
      } else if (/[a-z]|[A-Z]|_/.test(qlisp.charAt(index))) {
        const pat = { name: '', type: 'token' } as IPatten;
        for (; index < qlisp.length; index++) {
          pat.name += qlisp.charAt(index);
          if (!/[a-z]|[A-Z]|[0-9]|_/.test(qlisp.charAt(index + 1))) {
            break;
          }
        }
        if (pat.name === 'true' || pat.name === 'false') {
          pat.type === 'boolean';
        }
        res.push(pat);
      }
    }
    return res;
  }
  private static CreateNodeTree(pats: IPatten[]): NoixQLispNode {
    const node = new NoixQLispNode();
    const pat = pats[0];
    if (
      pat.type === 'boolean' ||
      pat.type === 'number' ||
      pat.type === 'string'
    ) {
      node.name = pat.name;
    } else if (pat.type === 'token') {
      node.name = '$' + pat.name;
    } else {
      if (pat.name === '(') {
        pats = pats.splice(1, pats.length - 2);
        node.name = 'object';
        let level1 = 0;
        let cache: IPatten[] = [];
        for (let index = 0; index < pats.length; index++) {
          if (pats[index].name === '(') {
            level1++;
          }
          if (pats[index].name === ')') {
            level1--;
          }
          if (!level1) {
            if (cache.length) {
              cache.push(pats[index]);
              node.children.push(this.CreateNodeTree(cache));
              cache = [];
            } else {
              node.children.push(this.CreateNodeTree([pats[index]]));
            }
          } else {
            cache.push(pats[index]);
          }
        }
      }
    }
    return node;
  }
  public static Compile(qlisp: string) {
    const pats = this.ResolveToPatten(qlisp);
    return this.CreateNodeTree(pats);
  }

  public static ToSQL(qlispNode: NoixQLispNode): string {
    if (qlispNode.name === 'object') {
      const operator = qlispNode.children[0].name.substr(1);
      const params = qlispNode.children.splice(1).map((q) => this.ToSQL(q));
      switch (operator) {
        case 'EQU':
          return `${params[0]} = ${params[1]}`;
        case 'NOT_EQU':
          return `${params[0]} <> ${params[1]}`;
        case 'GT':
          return `${params[0]} > ${params[1]}`;
        case 'LT':
          return `${params[0]} < ${params[1]}`;
        case 'GE':
          return `${params[0]} >= ${params[1]}`;
        case 'LE':
          return `${params[0]} <= ${params[1]}`;
        case 'LIKE':
          return `${params[0]} LIKE ${params[1]}`;
        case 'IN':
          return `${params[0]} IN ${params[1]}`;
        case 'AND':
          return `${params[0]} AND ${params[1]}`;
        case 'OR':
          return `${params[0]} OR ${params[1]}`;
        case 'LIST':
          return `(${params.join(',')})`;
      }
      return '';
    } else {
      if (qlispNode.name.startsWith('$')) {
        return qlispNode.name.substr(1);
      }
      if (qlispNode.name.startsWith('"')) {
        return qlispNode.name;
      }
      return `${qlispNode.value}`;
    }
  }
  public static Exec(
    qlispNode: NoixQLispNode,
    record: Record<string, unknown>
  ): unknown {
    if (
      typeof qlispNode.value === 'number' ||
      typeof qlispNode.value === 'boolean'
    ) {
      return qlispNode.value;
    }
    if (qlispNode.name.startsWith('$')) {
      const name = qlispNode.name.substr(1);
      return record[name];
    } else if (qlispNode.name !== 'object') {
      return qlispNode.value;
    }
    const opt = qlispNode.children[0].name.substr(1);
    const params = qlispNode.children.map((c) => this.Exec(c, record));
    switch (opt) {
      case 'AND':
        return params[1] && params[2];
      case 'OR':
        return params[1] && params[2];
      case 'LIST':
        return params.splice(1);
      case 'EQU':
        return params[1] == params[2];
      case 'NOT_EQU':
        return params[1] != params[2];
      case 'GT':
        return (params[1] as number) > (params[2] as number);
      case 'LT':
        return (params[1] as number) < (params[2] as number);
      case 'GE':
        return (params[1] as number) >= (params[2] as number);
      case 'LE':
        return (params[1] as number) <= (params[2] as number);
      case 'IN': {
        const list = params[2] as unknown[];
        return list.includes(params[1]);
      }
      case 'LIKE': {
        const str = params[2] as string;
        const strc = params[1] as string;
        if (str.endsWith('%') && !str.startsWith('%')) {
          return strc.startsWith(str.substr(0, str.length - 1));
        }
        if (!str.endsWith('%') && str.startsWith('%')) {
          return strc.endsWith(str.substr(1, str.length));
        }
        if (str.startsWith('%') && str.endsWith('%')) {
          return strc.includes(str.substr(1, str.length - 1));
        }
        return strc === str;
      }
    }
  }
}

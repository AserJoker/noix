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
      if (qlispNode.children[0].name.startsWith('$')) {
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
        }
        return '';
      } else {
        return `(${qlispNode.children.map((q) => this.ToSQL(q)).join(',')})`;
      }
    } else {
      if (qlispNode.name.startsWith('$')) {
        return qlispNode.name.substr(1);
      }
      return `${qlispNode.value}`;
    }
  }
}

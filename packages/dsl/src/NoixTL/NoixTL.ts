import { NoixTLNode } from './NoixTLNode';

interface IPatten {
  name: string;
  type: 'symbol' | 'string' | 'token';
}

export class NoixTL {
  private static IsStringPatten(template: string) {
    return template.startsWith('"');
  }
  private static IsSymbolPatten(template: string) {
    return ['$', '#', '[', ']', '=', ','].includes(template.charAt(0));
  }
  private static IsTokenPatten(template: string) {
    const c = template.charAt(0);
    return /[a-z]|[A-Z]|_/.test(c);
  }
  private static ResolveSymbolPatten(
    template: string,
    partten: IPatten
  ): string {
    partten.type = 'symbol';
    partten.name = template.charAt(0);
    return template.substr(partten.name.length);
  }
  private static ResolveStringPatten(
    template: string,
    partten: IPatten
  ): string {
    partten.type = 'string';
    partten.name = '"';
    for (let index = 1; index < template.length; index++) {
      partten.name += template[index];
      if (template[index] === '"' && template[index - 1] !== '\\') {
        break;
      }
    }
    return template.substr(partten.name.length);
  }
  private static ResolveTokenPatten(
    template: string,
    partten: IPatten
  ): string {
    partten.type = 'token';
    partten.name = '';
    for (let index = 0; index < template.length; index++) {
      if (!/[a-z]|[A-Z]|_|[0-9]/.test(template[index])) {
        break;
      }
      partten.name += template[index];
    }
    return template.substr(partten.name.length);
  }
  private static ResolvePattens(template: string): IPatten[] {
    const res: IPatten[] = [];
    while (template.length) {
      const pat = {} as IPatten;
      if (this.IsStringPatten(template)) {
        template = this.ResolveStringPatten(template, pat);
      } else if (this.IsSymbolPatten(template)) {
        template = this.ResolveSymbolPatten(template, pat);
      } else if (this.IsTokenPatten(template)) {
        template = this.ResolveTokenPatten(template, pat);
      }
      res.push(pat);
      template = template.trim();
    }
    return res;
  }

  public static GetTagNode(pattens: IPatten[]): IPatten[] {
    const res: IPatten[] = [];
    let level = 0;
    for (let index = 0; index < pattens.length; index++) {
      res.push(pattens[index]);
      if (pattens[index].name === '$') {
        level++;
      }
      if (pattens[index].name === '#') {
        level--;
        if (level === 0) {
          res.push(pattens[index + 1]);
          break;
        }
      }
    }
    return res;
  }
  public static GetAttrsNode(pattens: IPatten[]): IPatten[] {
    const res: IPatten[] = [];
    for (let index = 0; index < pattens.length; index++) {
      res.push(pattens[index]);
      if (pattens[index].name === ']') break;
    }
    return res;
  }
  public static CompileAttr(pattens: IPatten[]): Record<string, string> {
    const res: Record<string, string> = {};
    for (let index = 0; index < pattens.length; index++) {
      if (pattens[index].name !== ',') {
        const tagName = pattens[index].name;
        let value = 'true';
        if (pattens[index + 1] && pattens[++index].name === '=') {
          value = pattens[++index].name;
          value = value.substr(1, value.length - 2);
        }
        res[tagName] = value;
      }
    }
    return res;
  }
  public static CompileNode(pattens: IPatten[]): NoixTLNode {
    const res = new NoixTLNode();
    res.name = pattens[1].name;
    res.attributes = {};
    res.children = [];
    pattens.splice(0, 2);
    pattens.splice(pattens.length - 2);
    const attrPattens = this.GetAttrsNode(pattens);
    pattens.splice(0, attrPattens.length);
    attrPattens.splice(0, 1);
    attrPattens.splice(attrPattens.length - 1);
    res.attributes = this.CompileAttr(attrPattens);
    res.children = this.CompilePattens(pattens);
    return res;
  }
  public static CompilePattens(pattens: IPatten[]): NoixTLNode[] {
    const res: NoixTLNode[] = [];
    while (pattens.length) {
      const nodepats = this.GetTagNode(pattens);
      pattens.splice(0, nodepats.length);
      res.push(this.CompileNode(nodepats));
    }
    return res;
  }
  public static Compile(template: string): NoixTLNode {
    const pats = this.ResolvePattens(template).filter((p) => p.name);
    return this.CompilePattens(pats)[0];
  }
}

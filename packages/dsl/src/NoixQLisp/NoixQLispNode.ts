export class NoixQLispNode {
  public name: string = '';
  public children: NoixQLispNode[] = [];
  public get value() {
    if (this.name.startsWith('"')) {
      return this.name.substr(1, this.name.length - 2);
    } else if (/[1-9]/.test(this.name.charAt(0))) {
      return new Number(this.name);
    } else if (this.name === 'true') {
      return true;
    } else if (this.name === 'false') {
      return false;
    }
    return this.name;
  }
}

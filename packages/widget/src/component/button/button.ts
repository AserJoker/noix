import { Attribute, BaseWidget, Component, Prop, Watch } from '../../base';
@Component()
export default class Button extends BaseWidget {
  @Attribute({ reactive: true })
  private get value() {
    return this.obj.num;
  }

  @Attribute({ reactive: true })
  private obj = { num: 0 };

  @Watch('obj', { handle: (obj) => obj.num })
  private onValueChange(newValue: number, oldValue: number) {
    console.log(newValue, oldValue);
  }

  @Prop()
  private text!: string;

  @Attribute()
  private click() {
    this.obj.num++;
  }

  // protected static render = comp.render;
}

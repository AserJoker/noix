import { ref } from '@vue/reactivity';
import { BaseWidget, Component, Watch } from '../../base';
@Component
export default class Button extends BaseWidget {
  private value = ref(0);
  private obj = ref({ num: 1 });

  @Watch('obj.num')
  private onValueChange(newValue: number, oldValue: number) {
    console.log(newValue, oldValue);
  }

  protected setup() {
    return {
      value: this.value,
      click: () => this.obj.value.num++,
      obj: this.obj
    };
  }
}

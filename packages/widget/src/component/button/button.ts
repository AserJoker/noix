import { defineComponent } from 'vue';
import { BaseWidget } from '../../base';
class ButtonWidget extends BaseWidget {
  public setup() {
    return { text: 'button', click: () => console.log('click') };
  }
}
export default defineComponent(new ButtonWidget());

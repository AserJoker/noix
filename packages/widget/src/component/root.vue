<template>
  <Button @buttonClick="onButtonClick"></Button>
</template>
<script lang="ts">
import { Attribute, BaseWidget, Component, Provide } from '../base';
import { Button } from './button';
@Component({
  components: { Button }
})
export default class Root extends BaseWidget {
  @Provide()
  @Attribute({ reactive: true })
  private get text() {
    return this._text;
  }

  @Attribute({ reactive: true })
  private _text = 1;

  @Attribute()
  private onButtonClick() {
    this._text++;
  }
}
</script>

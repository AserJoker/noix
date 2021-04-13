<template>
  <button class="n-button" @click="onClick">{{ value }}</button>
</template>
<style scoped>
.n-button {
  background: #fff;
  margin: 0;
}
</style>
<script lang="ts">
import {
  Attribute,
  BaseWidget,
  Component,
  Prop,
  Watch,
  Emit,
  Inject
} from '../../base';
@Component()
export default class Button extends BaseWidget {
  @Attribute({ reactive: true })
  private get value() {
    return this.text + '';
  }

  @Inject()
  private text!: number;

  @Emit('buttonClick')
  @Attribute()
  private onClick() {}
}
</script>

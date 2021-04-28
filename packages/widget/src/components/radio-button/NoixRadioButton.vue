<template>
  <a-radio-button :checked="value" @update:checked="change"
    ><slot
  /></a-radio-button>
</template>
<script lang="ts">
import { Radio as ARadio } from 'ant-design-vue';
import { BaseWidget, Component, Prop, Emit } from '../../base';
@Component({ components: { ARadioButton: ARadio.Button } })
export default class NoixRadioButton extends BaseWidget {
  @Prop()
  private value!: boolean;

  @Emit('change')
  private change(newValue: boolean) {}
}
</script>

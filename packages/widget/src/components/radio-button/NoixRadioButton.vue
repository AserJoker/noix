<template>
  <a-radio-button :value="value"><slot /></a-radio-button>
</template>
<script lang="ts">
import { Radio as ARadio } from 'ant-design-vue';
import { BaseWidget, Component, Prop } from '../../base';
@Component({ components: { ARadio } })
export default class NoixRadioButton extends BaseWidget {
  @Prop()
  private value!: string[];
}
</script>

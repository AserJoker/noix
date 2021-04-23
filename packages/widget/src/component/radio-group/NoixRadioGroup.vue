<template>
  <a-radio-group :value="value" @change="change" :options="options"
    ><slot
  /></a-radio-group>
</template>
<script lang="ts">
import { Radio as ARadio } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({ components: { ARadio } })
export default class NoixRadioGroup extends BaseWidget {
  @Prop()
  private value!: string[];

  @Prop()
  private options!: string[];

  @Emit('change')
  private change(newValue: string[]) {}
}
</script>

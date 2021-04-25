<template>
  <a-radio-group :options="options" @change="change" />
</template>
<script lang="ts">
import { Radio as ARadio } from 'ant-design-vue';
import { BaseWidget, Component, Prop, Emit } from '../../base';
@Component({ components: { ARadio } })
export default class NoixRadio extends BaseWidget {
  @Prop()
  private options!: any;

  @Emit('change')
  private change(newValue: string) {}
}
</script>

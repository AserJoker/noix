<template>
  <a-radio :checked="value" @update:checked="change"><slot /></a-radio>
</template>
<script lang="ts">
import { Radio as ARadio } from 'ant-design-vue';
import { BaseWidget, Component, Prop, Emit } from '../../base';
@Component({ components: { ARadio } })
export default class NoixRadio extends BaseWidget {
  @Prop()
  private value!: boolean;
  @Emit('change')
  private change(newValue: boolean) {}
}
</script>

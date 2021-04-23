<template>
  <a-select :value="value" @change="change"><slot /></a-select>
</template>
<script lang="ts">
import { Select as ASelect } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({ components: { ASelect } })
export default class NoixSelect extends BaseWidget {
  @Prop()
  private value!: string | number;

  @Emit('change')
  private change(newValue: string | number) {}
}
</script>

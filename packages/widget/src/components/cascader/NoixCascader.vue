<template>
  <a-cascader :value="value" @change="change" :options="options" />
</template>
<script lang="ts">
import { Cascader as ACascader } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({ components: { ACascader } })
export default class NoixCascader extends BaseWidget {
  @Prop()
  private value!: string[] | number[];

  @Prop()
  private options!: string[] | number[];

  @Emit('change')
  private change(newValue: string[] | number[]) {}
}
</script>

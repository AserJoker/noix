<template>
  <a-select-option :value="value"><slot /></a-select-option>
</template>
<script lang="ts">
import { Select as ASelect } from 'ant-design-vue';
import { BaseWidget, Component, Prop } from '../../base';
@Component({ components: { ASelect } })
export default class NoixSelectOption extends BaseWidget {
  @Prop()
  private value!: string | number;
}
</script>

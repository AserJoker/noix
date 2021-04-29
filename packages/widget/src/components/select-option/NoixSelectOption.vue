<template>
  <a-select-option :select="value" @update:select="change">
    <slot />
  </a-select-option>
</template>
<script lang="ts">
import { Select as ASelect } from 'ant-design-vue';
import { BaseWidget, Component, Prop, Emit } from '../../base';
@Component({ components: { ASelectOption: ASelect.Option } })
export default class NoixSelectOption extends BaseWidget {
  @Prop()
  private value!: boolean;

  @Emit('change')
  private change(newValue: string) {}
}
</script>

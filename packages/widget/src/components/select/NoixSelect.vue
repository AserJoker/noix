<template>
  <a-select :value="value" @update:value="change">
    <slot>
      <a-select-option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.displayName }}
      </a-select-option>
    </slot>
  </a-select>
</template>
<script lang="ts">
import { Select as ASelect } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({ components: { ASelect: ASelect, ASelectOption: ASelect.Option } })
export default class NoixSelect extends BaseWidget {
  @Prop()
  private value!: string;

  @Prop()
  private options!: { value: unknown; displayName: string }[];

  @Emit('change')
  private change(newValue: string) {}
}
</script>

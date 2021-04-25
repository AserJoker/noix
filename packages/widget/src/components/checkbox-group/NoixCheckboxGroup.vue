<template>
  <a-checkbox-group :value="value" @change="change" :options="options" />
</template>
<script lang="ts">
import { Checkbox as ACheckbox } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({ components: { ACheckbox } })
export default class NoixCheckboxGroup extends BaseWidget {
  @Prop()
  private value!: string[];

  @Prop()
  private options!: string[];

  @Emit('change')
  private change(newValue: string[]) {}
}
</script>

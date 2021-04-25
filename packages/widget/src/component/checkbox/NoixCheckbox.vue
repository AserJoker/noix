<template>
  <a-checkbox-group :options="options" @change="change" />
</template>
<script lang="ts">
import { Checkbox as ACheckbox } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({ components: { ACheckbox } })
export default class NoixCheckbox extends BaseWidget {
  @Prop()
  private options!: any;

  @Emit('change')
  private change(newValue: string) {}
}
</script>

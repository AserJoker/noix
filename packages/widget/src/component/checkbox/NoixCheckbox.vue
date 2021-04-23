<template>
  <a-checkbox @change="change"><slot /></a-checkbox>
</template>
<script lang="ts">
import { Checkbox as ACheckbox } from 'ant-design-vue';
import { BaseWidget, Component, Emit } from '../../base';
@Component({ components: { ACheckbox } })
export default class NoixCheckbox extends BaseWidget {
  @Emit('change')
  private change(newValue: string) {}
}
</script>

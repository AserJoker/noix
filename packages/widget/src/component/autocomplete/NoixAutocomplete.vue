<template>
  <a-auto-complete :value="value" @change="change"><slot /></a-auto-complete>
</template>
<script lang="ts">
import { BaseWidget, Component, Emit, Prop } from '../../base';
import { AutoComplete as AAutocomplete } from 'ant-design-vue';
@Component({ components: { AAutocomplete } })
export default class NoixAutocomplete extends BaseWidget {
  @Prop()
  private value!: string;

  @Emit('change')
  private change(newValue: string) {}
}
</script>

<template>
  <a-input :value="value" @update:value="change" :type="type" />
</template>
<script lang="ts">
import { Input as AInput } from 'ant-design-vue';
import { BaseWidget, Component, Prop, Emit } from '../../base';
@Component({ components: { AInput } })
export default class NoixInput extends BaseWidget {
  @Prop()
  private value!: string;

  @Prop()
  private type!: string;

  @Emit('change:value')
  private change(newValue: string) {}
}
</script>

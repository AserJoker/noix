<template>
  <a-switch :checked="value" @change="change" />
</template>
<script lang="ts">
import { Switch as ASwitch } from 'ant-design-vue';
import { BaseWidget, Emit, Component, Prop } from '../../base';
@Component({ components: { ASwitch } })
export default class NoixSwitch extends BaseWidget {
  @Prop()
  private value!: boolean;
  @Emit('change')
  private change(newValue: boolean) {}
}
</script>

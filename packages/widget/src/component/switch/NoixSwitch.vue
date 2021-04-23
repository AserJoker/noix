<template>
  <a-switch @change="change" />
</template>
<script lang="ts">
import { Switch as ASwitch } from 'ant-design-vue';
import { BaseWidget, Emit, Component } from '../../base';
@Component({ components: { ASwitch } })
export default class NoixSwitch extends BaseWidget {
  @Emit('change')
  private change(newValue: boolean) {}
}
</script>

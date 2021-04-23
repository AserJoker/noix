<template>
  <a-steps :current="value" @change="change"><slot /></a-steps>
</template>
<script lang="ts">
import { Steps as ASteps } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({ components: { ASteps } })
export default class NoixSteps extends BaseWidget {
  @Prop()
  private value!: number;

  @Emit('change')
  private change(newValue: number) {}
}
</script>

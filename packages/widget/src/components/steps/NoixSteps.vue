<template>
  <a-steps :current="value" @update:current="change">
    <a-step
      v-for="opt in options"
      :key="opt.title"
      :title="opt.title"
      :description="opt.description"
    />
  </a-steps>
</template>
<script lang="ts">
import { Steps as ASteps } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({ components: { ASteps: ASteps, AStep: ASteps.Step } })
export default class NoixSteps extends BaseWidget {
  @Prop()
  private value!: number;

  @Prop()
  private options!: { title: string; description: string }[];

  @Emit('change')
  private change(newValue: number) {}
}
</script>

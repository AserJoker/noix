<template>
  <a-step :title="options.title" :description="options.description" />
</template>
<script lang="ts">
import { Steps as ASteps } from 'ant-design-vue';
import { BaseWidget, Component, Prop } from '../../base';
@Component({ components: { AStep: ASteps.Step } })
export default class NoixStep extends BaseWidget {
  @Prop()
  private options!: { title: string; description: string };
}
</script>

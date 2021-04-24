<template>
  <a-step :title="title" :description="description" />
</template>
<script lang="ts">
import { Steps as ASteps } from 'ant-design-vue';
import { BaseWidget, Component, Prop } from '../../base';
@Component({ components: { ASteps } })
export default class NoixStep extends BaseWidget {
  @Prop()
  private title!: string;

  @Prop()
  private description!: string;
}
</script>

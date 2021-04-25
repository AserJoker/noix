<template>
  <a-tab-pane :key="value" :tab="tab"><slot /></a-tab-pane>
</template>
<script lang="ts">
import { Tabs as ATabs } from 'ant-design-vue';
import { BaseWidget, Component, Prop } from '../../base';
@Component({ components: { ATabs } })
export default class NoixTabPane extends BaseWidget {
  @Prop()
  private value!: number;

  @Prop()
  private tab!: string;
}
</script>

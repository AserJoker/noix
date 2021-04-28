<template>
  <a-tabs :activeKey="value" @update:activeKey="change">
    <a-tab-pane
      v-for="opt in options"
      :key="opt.key"
      :tab="opt.tab"
    ></a-tab-pane>
  </a-tabs>
</template>
<script lang="ts">
import { Tabs as ATabs } from 'ant-design-vue';
import { BaseWidget, Component, Prop, Emit } from '../../base';
@Component({ components: { ATabs: ATabs, ATabPane: ATabs.TabPane } })
export default class NoixTabs extends BaseWidget {
  @Prop()
  private value!: string;

  @Prop()
  private options!: { key: string; tab: string }[];

  @Emit('change')
  private change(newValue: string) {}
}
</script>

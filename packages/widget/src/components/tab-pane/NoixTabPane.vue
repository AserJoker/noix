<template>
  <a-tab-pane :key="option.key" :tab="option.tab"><slot /></a-tab-pane>
</template>
<script lang="ts">
import { Tabs as ATabs } from 'ant-design-vue';
import { BaseWidget, Component, Prop } from '../../base';
@Component({ components: { ATabPane: ATabs.TabPane } })
export default class NoixTabPane extends BaseWidget {
  @Prop()
  private option!: { key: string; tab: string };
}
</script>

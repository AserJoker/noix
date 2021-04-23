<template>
  <a-tabs :activekey="value"><slot /></a-tabs>
</template>
<script lang="ts">
import { Tabs as ATabs } from 'ant-design-vue';
import { BaseWidget, Component, Prop } from '../../base';
@Component({ components: { ATabs } })
export default class NoixTabs extends BaseWidget {
  @Prop()
  private value!: number;
}
</script>

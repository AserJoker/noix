<template>
  <a-breadcrumb-item :click="OnClick" :href="value"><slot /></a-breadcrumb-item>
</template>
<script lang="ts">
import { Breadcrumb as ABreadcrumb } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({ components: { ABreadcrumbItem: ABreadcrumb.Item } })
export default class NoixBreadcrunbItem extends BaseWidget {
  @Prop()
  private value!: string;

  @Emit('click')
  private OnClick() {}
}
</script>

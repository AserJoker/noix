<template>
  <a-breadcrumb-item :click="OnClick" :href="value"><slot /></a-breadcrumb-item>
</template>
<script lang="ts">
import { Breadcrumb as ABreadcrumb } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({ components: { ABreadcrumb } })
export default class NoixAlert extends BaseWidget {
  @Prop()
  private value!: string;
  @Emit('click')
  private OnClick() {}
}
</script>

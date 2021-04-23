<template>
  <a-breadcrumb-item :click="change" :href="value"><slot /></a-breadcrumb>
</template>
<script lang="ts">
import { Breadcrumb as ABreadcrumb } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({ components: { ABreadcrumb } })
export default class NoixAlert extends BaseWidget {
  @Prop()
  private value!:string;
  @Emit('change')
  private change() {}
}
</script>

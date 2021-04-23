<template>
  <a-divider :orientation="orientation" :type="type"></slot></a-divider>
</template>
<script lang="ts">
import { Divider as ADivider } from 'ant-design-vue';
import { BaseWidget, Component, Prop } from '../../base';
@Component({ components: { ADivider } })
export default class NoixDivider extends BaseWidget {
  @Prop()
  private orientation!: string[];
  @Prop()
  private type!:string[];
}
</script>

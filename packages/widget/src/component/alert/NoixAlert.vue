<template>
  <a-alert :message="message" :type="type" />
</template>
<script lang="ts">
import { Alert as AAlert } from 'ant-design-vue';
import { BaseWidget, Component, Prop } from '../../base';
@Component({ components: { AAlert } })
export default class NoixAlert extends BaseWidget {
  @Prop()
  private message!: string;
  @Prop()
  private type!: string;
}
</script>

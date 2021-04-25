<template>
  <a-button @click="OnClick" :type="type"><slot /></a-button>
</template>
<script lang="ts">
import { BaseWidget, Component, Emit, Prop } from '../../base';
import { NoixBlock } from '../block';
import { Button as AButton } from 'ant-design-vue';
@Component({ components: { AButton } })
export default class NoixButton extends BaseWidget {
  @Emit('click')
  private OnClick() {}

  @Prop()
  private type!: string;
}
</script>

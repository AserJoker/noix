<template>
  <a-button @click="OnButtonClick"><slot /></a-button>
</template>
<script lang="ts">
import { BaseWidget, Component, Emit } from '../../base';
import { Button as AButton } from 'ant-design-vue';
@Component({ components: { AButton } })
export default class NoixButton extends BaseWidget {
  @Emit('button:click')
  private OnButtonClick() {}
}
</script>

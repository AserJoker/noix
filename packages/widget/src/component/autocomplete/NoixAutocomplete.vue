<template>
  <a-autocomplete :value="value" @change="change"><slot /></a-button>
</template>
<script lang="ts">
import { BaseWidget, Component, Emit, Prop } from '../../base';
import { Button as AButton } from 'ant-design-vue';
@Component({ components: { AButton } })
export default class NoixButton extends BaseWidget {
  @Prop()
  private value!: string;

  @Emit('change')
  private change() {}
}
</script>

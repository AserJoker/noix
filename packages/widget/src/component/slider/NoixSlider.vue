<template>
  <a-slider :value="value" @change="change" />
</template>
<script lang="ts">
import { Slider as ASlider } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({ components: { ASlider } })
export default class NoixSlider extends BaseWidget {
  @Prop()
  private value!: number;

  @Emit('change')
  private change(newValue: number) {}
}
</script>

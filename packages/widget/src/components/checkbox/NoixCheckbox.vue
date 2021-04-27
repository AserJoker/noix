<template>
  <a-checkbox :checked="value" @change="extract"><slot /></a-checkbox>
</template>
<script lang="ts">
import { Checkbox as ACheckbox } from 'ant-design-vue';
import { Attribute, BaseWidget, Component, Emit, Prop } from '../../base';
@Component({ components: { ACheckbox } })
export default class NoixCheckbox extends BaseWidget {
  @Prop()
  private value!: boolean;

  @Attribute()
  private extract(newValue: object) {
    this.change(Object.values(newValue)[0]['checked']);
  }

  @Emit('change')
  private change(newValue: boolean) {}
}
</script>

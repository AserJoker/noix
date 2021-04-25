<template>
  <a-form-item :label="label">
    <slot />
  </a-form-item>
</template>
<script lang="ts">
import { BaseWidget, Component, Prop } from '../../base';
import { Form as AForm } from 'ant-design-vue';
@Component({ components: { AFormItem: AForm.Item } })
export default class NoixFormItem extends BaseWidget {
  @Prop()
  private label!: string;
}
</script>

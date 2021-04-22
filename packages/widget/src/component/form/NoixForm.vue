<template>
  <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
    <slot />
  </a-form>
</template>
<script lang="ts">
import { BaseWidget, Component, Prop, Attribute } from '../../base';
import { Form as AForm } from 'ant-design-vue';
@Component({
  components: { AForm }
})
export default class NoixForm extends BaseWidget {}
</script>

<template>
  <a-breadcrumb><slot /></a-breadcrumb>
</template>
<script lang="ts">
import { Breadcrumb as ABreadcrumb } from 'ant-design-vue';
import { BaseWidget, Component } from '../../base';
@Component({ components: { ABreadcrumb } })
export default class NoixAlert extends BaseWidget {}
</script>

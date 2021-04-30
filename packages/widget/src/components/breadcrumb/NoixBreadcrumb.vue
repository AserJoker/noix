<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-for="opt in options" :key="opt.displayName"
      ><a :href="opt.href">{{ opt.displayName }}</a></a-breadcrumb-item
    >
  </a-breadcrumb>
</template>
<script lang="ts">
import { Breadcrumb as ABreadcrumb } from 'ant-design-vue';
import { BaseWidget, Component, Prop } from '../../base';
@Component({
  components: { ABreadcrumb: ABreadcrumb, ABreadcrumbItem: ABreadcrumb.Item }
})
export default class NoixBreadcrumb extends BaseWidget {
  @Prop()
  private options!: { href: string; displayName: string }[];
}
</script>

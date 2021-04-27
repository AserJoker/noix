<template>
  <a-checkbox-group :value="value" @change="change">
    <slot>
      <a-checkbox v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.displayName }}
      </a-checkbox>
    </slot>
  </a-checkbox-group>
</template>
<script lang="ts">
import { Checkbox as ACheckbox } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({
  components: { ACheckbox: ACheckbox, ACheckboxGroup: ACheckbox.Group }
})
export default class NoixCheckboxGroup extends BaseWidget {
  @Prop()
  private value!: string[];

  @Prop()
  private options!: { value: unknown; displayName: string }[];

  @Emit('change')
  private change(newValue: string[]) {}
}
</script>

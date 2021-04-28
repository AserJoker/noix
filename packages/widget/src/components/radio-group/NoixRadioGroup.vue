<template>
  <a-radio-group :value="value" @update:value="change">
    <slot>
      <a-radio-button
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.displayName }}
      </a-radio-button>
    </slot>
  </a-radio-group>
</template>
<script lang="ts">
import { Radio as ARadio } from 'ant-design-vue';
import { BaseWidget, Component, Emit, Prop } from '../../base';
@Component({
  components: { ARadioButton: ARadio.Button, ARadioGroup: ARadio.Group }
})
export default class NoixRadioGroup extends BaseWidget {
  @Prop()
  private value!: string;

  @Prop()
  private options!: { value: unknown; displayName: string }[];

  @Emit('change')
  private change(newValue: string) {}
}
</script>

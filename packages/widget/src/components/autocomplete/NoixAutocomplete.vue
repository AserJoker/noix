<template>
  <a-auto-complete :value="value" @search="handler" @change="change">
    <template #options>
      <a-select-option v-for="opt in result" :key="opt">
        {{ opt }}
      </a-select-option>
    </template>
  </a-auto-complete>
</template>
<script lang="ts">
import { BaseWidget, Component, Emit, Prop } from '../../base';
import {
  AutoComplete as AAutoComplete,
  Select as ASelect
} from 'ant-design-vue';
@Component({
  components: { AAutoComplete: AAutoComplete, ASelectOption: ASelect.Option }
})
export default class NoixAutocomplete extends BaseWidget {
  @Prop()
  private value!: string;

  @Prop()
  private result!: string[];

  @Prop()
  private handler(val: string) {
    console.log(val);
    let res: string[];
    if (!val || val.indexOf('@') >= 0) {
      res = [];
    } else {
      res = ['gmail.com', '163.com', 'qq.com'].map(
        (domain) => `${val}@${domain}`
      );
    }
    this.result = res;
  }

  @Emit('change')
  private change(newValue: string) {}
}
</script>

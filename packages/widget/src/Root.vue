<template>
  <noix-form>
    <noix-form-item label="username">
      <noix-input :value="store.username" @change="OnUsernameChange" />
    </noix-form-item>
    <noix-form-item label="password">
      <noix-input
        type="password"
        :value="store.password"
        @change="OnPasswordChange"
      />
    </noix-form-item>
    <noix-form-item label=" ">
      <noix-button @click="OnLogin" type="primary">login</noix-button>
    </noix-form-item>
  </noix-form>
  <noix-button @click="Post">click</noix-button>

  <noix-radio :value="radioValue" @change="radioChange">radioValue</noix-radio>
  <noix-radio-button :value="radioButtonValue" @change="radioButtonChange"
    >radioButtonValue</noix-radio-button
  >
  <noix-radio-group
    :value="radioGroupValue"
    :options="options"
    @change="radioGroupChange"
  ></noix-radio-group>
  <noix-checkbox @change="checkboxChange" :value="checkboxValue"
    >Checkbox</noix-checkbox
  >
  <noix-checkbox-group
    @change="checkboxGroupChange"
    :value="checkboxGroupValue"
    :options="options"
  ></noix-checkbox-group>
</template>
<script lang="ts">
import { BaseWidget, Component, Attribute } from './base';
import {
  NoixForm,
  NoixFormItem,
  NoixInput,
  NoixButton,
  NoixRadio,
  NoixRadioButton,
  NoixRadioGroup,
  NoixCheckbox,
  NoixCheckboxGroup
} from './components';
import { HttpClient } from '@noix/client';
const client = new HttpClient();
client.SetBaseURL('http://localhost:9090');
@Component({
  components: {
    NoixForm,
    NoixFormItem,
    NoixInput,
    NoixButton,
    NoixRadio,
    NoixRadioButton,
    NoixRadioGroup,
    NoixCheckbox,
    NoixCheckboxGroup
  }
})
export default class NoixRoot extends BaseWidget {
  @Attribute({ reactive: true })
  private store = { password: '', username: '' };

  @Attribute()
  private OnUsernameChange(newValue: string) {
    this.store.username = newValue;
  }
  @Attribute()
  private OnPasswordChange(newValue: string) {
    this.store.password = newValue;
  }

  @Attribute()
  private OnLogin() {
    console.log(
      `username:${this.store.username}\n password:${this.store.password}`
    );
  }

  @Attribute()
  private async Post() {
    const res = await client.Query(
      'base',
      'Model',
      'query',
      {
        record: {
          module: 'base',
          name: 'Model'
        }
      },
      `{
      fields{
        name
        ref
        array
        model
        rel
        type
      }
    }`
    );
    console.log(res);
  }

  @Attribute({ reactive: true })
  private radioValue = false;
  @Attribute({ reactive: true })
  private radioButtonValue = false;
  @Attribute({ reactive: true })
  private radioGroupValue = '';
  @Attribute()
  private options = [
    { value: '1', displayName: '1' },
    { value: '2', displayName: '2' },
    { value: '3', displayName: '3' }
  ];
  @Attribute()
  private radioGroupChange(newValue: string) {
    console.log(newValue);
  }
  @Attribute({ reactive: true })
  private checkboxValue = false;
  @Attribute({ reactive: true })
  private checkboxGroupValue = ['1'];
  @Attribute()
  private radioChange(newValue: boolean) {
    this.radioValue = newValue;
  }
  @Attribute()
  private radioButtonChange(newValue: boolean) {
    this.radioButtonValue = newValue;
  }
  @Attribute()
  private checkboxChange(newValue: boolean) {
    this.checkboxValue = newValue;
  }
  @Attribute()
  private checkboxGroupChange(newValue: string[]) {
    this.checkboxGroupValue = newValue;
  }
}
</script>

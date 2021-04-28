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

  <noix-radio :value="radioValue" @change="radioChange">radio</noix-radio>
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
  <noix-select
    :options="options"
    @change="selectChange"
    :value="selectValue"
  ></noix-select>
  <noix-steps
    :current="stepsValue"
    @change="stepsChange"
    :options="stepsOptions"
  ></noix-steps>
  <noix-tabs
    @change="tabsChange"
    :value="tabsValue"
    :options="tabsOptions"
  ></noix-tabs>
  <noix-cascader
    :options="cascaderOptions"
    :value="cascaderValue"
    @change="cascaderChange"
  >
  </noix-cascader>
  <noix-breadcrumb :options="breadcrumbOptions"></noix-breadcrumb>
  <noix-breadcrumb-item :options="breadcrumbOptions[0]"
    >Item</noix-breadcrumb-item
  >
  <noix-autocomplete @change="autocompleteChange"></noix-autocomplete>
  <noix-slider @change="sliderChange" :value="sliderValue"></noix-slider>
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
  NoixCheckboxGroup,
  NoixSelect,
  NoixSteps,
  NoixStep,
  NoixTabs,
  NoixTabPane,
  NoixCascader,
  NoixBreadcrumb,
  NoixBreadcrumbItem,
  NoixAutocomplete,
  NoixSelectOption,
  NoixSlider
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
    NoixCheckboxGroup,
    NoixSelect,
    NoixSteps,
    NoixStep,
    NoixTabs,
    NoixTabPane,
    NoixCascader,
    NoixBreadcrumb,
    NoixBreadcrumbItem,
    NoixAutocomplete,
    NoixSelectOption,
    NoixSlider
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
  private radioGroupValue = '1';
  @Attribute({ reactive: true })
  private selectValue = '1';
  @Attribute({ reactive: true })
  private tabsValue = '1';
  @Attribute({ reactive: true })
  private cascaderValue = [''];
  @Attribute()
  private options = [
    { value: '1', displayName: '1' },
    { value: '2', displayName: '2' },
    { value: '3', displayName: '3' }
  ];
  @Attribute()
  private stepsOptions = [
    { title: 'Title 1', description: 'Description 1' },
    { title: 'Title 2', description: 'Description 2' },
    { title: 'Title 3', description: 'Description 3' }
  ];
  @Attribute()
  private tabOption = { key: '0', tab: 'Tab 0' };
  @Attribute()
  private tabsOptions = [
    { key: '1', tab: 'Tab 1' },
    { key: '2', tab: 'Tab 2' },
    { key: '3', tab: 'Tab 3' }
  ];
  @Attribute()
  private breadcrumbOptions = [
    { href: '#', displayName: 'Level 1' },
    { href: '#', displayName: 'Level 2' },
    { href: '#', displayName: 'Level 3' }
  ];
  @Attribute()
  private radioGroupChange(newValue: string) {
    this.radioGroupValue = newValue;
    console.log(newValue);
  }
  @Attribute({ reactive: true })
  private checkboxValue = false;
  @Attribute({ reactive: true })
  private checkboxGroupValue = ['1'];
  @Attribute({ reactive: true })
  private stepsValue = 1;
  @Attribute({ reactive: true })
  private autocompleteValue = '';
  @Attribute({ reactive: true })
  private sliderValue = 1;
  @Attribute({ reactive: true })
  private cascaderOptions = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [
            {
              value: 'xihu',
              label: 'West Lake'
            }
          ]
        }
      ]
    }
  ];
  @Attribute()
  private radioChange(newValue: boolean) {
    this.radioValue = newValue;
  }
  @Attribute()
  private radioButtonChange(newValue: boolean) {
    this.radioButtonValue = newValue;
    console.log(newValue);
  }
  @Attribute()
  private checkboxChange(newValue: boolean) {
    this.checkboxValue = newValue;
  }
  @Attribute()
  private checkboxGroupChange(newValue: string[]) {
    this.checkboxGroupValue = newValue;
    console.log(newValue);
  }
  @Attribute()
  private selectChange(newValue: string) {
    this.selectValue = newValue;
    console.log(newValue);
  }
  @Attribute()
  private stepsChange(newValue: number) {
    this.stepsValue = newValue;
    console.log(newValue);
  }
  @Attribute()
  private tabsChange(newValue: string) {
    this.tabsValue = newValue;
    console.log(newValue);
  }
  @Attribute()
  private cascaderChange(newValue: string[]) {
    this.cascaderValue = newValue;
    console.log(newValue);
  }
  @Attribute()
  private autocompleteChange(newValue: string) {
    this.autocompleteValue = newValue;
    console.log(newValue);
  }
  @Attribute()
  private sliderChange(newValue: number) {
    this.sliderValue = newValue;
    console.log(newValue);
  }
}
</script>

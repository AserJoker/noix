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
  <noix-radio @change="OnRadioChange" :options="options" />
  <noix-checkbox @change="OnCheckboxChange" :options="options" />
  <noix-button @click="Post">click</noix-button>
</template>
<script lang="ts">
import { BaseWidget, Component, Attribute } from './base';
import {
  NoixForm,
  NoixFormItem,
  NoixInput,
  NoixButton,
  NoixRadio,
  NoixCheckbox
} from './components';
import { NoixTL } from '@noix/dsl';
import { HttpClient } from '@noix/client';
@Component({
  components: {
    NoixForm,
    NoixFormItem,
    NoixInput,
    NoixButton,
    NoixRadio,
    NoixCheckbox
  }
})
export default class NoixRoot extends BaseWidget {
  @Attribute({ reactive: true })
  private store = { password: '', username: '' };

  @Attribute()
  private options = ['Apple', 'Pear', 'Orange'];

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
  private OnRadioChange(newValue: string) {
    console.log(newValue);
  }

  @Attribute()
  private OnCheckboxChange(newValue: string) {
    console.log(newValue);
  }

  @Attribute()
  private async Post() {
    const client = new HttpClient();
    client.SetBaseURL('http://localhost:9090');
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
    const compiler = new NoixTL();
    console.log(
      compiler.Compile(`
      $model[render="FORM",name="User"]
        $field[render="INPUT",name="username"]#field
        $field[render="INPUT",name="password"]#field
      #model
    `)
    );
  }
}
</script>

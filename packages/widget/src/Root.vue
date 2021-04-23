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
</template>
<script lang="ts">
import { BaseWidget, Component, Attribute } from './base';
import { NoixForm, NoixFormItem, NoixInput, NoixButton } from './component';
@Component({ components: { NoixForm, NoixFormItem, NoixInput, NoixButton } })
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
}
</script>

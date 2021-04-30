import { h } from '@vue/runtime-core';
import { NoixTL } from '@noix/dsl';
import { Attribute, BaseWidget, Component, Prop } from '../../base';
import { IView } from '../../types';
@Component({})
export class ViewRender extends BaseWidget {
  @Prop()
  public view!: IView;

  public get resolvedView() {
    return NoixTL.Compile(this.view.template || '');
  }

  public render(_ctx: this) {
    return h('div', _ctx.view.template);
  }
}

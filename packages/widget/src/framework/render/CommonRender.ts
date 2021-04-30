import { NoixTL, NoixTLNode } from '@noix/dsl';
import { BaseWidget, Component, Prop } from '../../base';
import { IView } from '../../types';
@Component({})
export class CommonRender extends BaseWidget {
  @Prop()
  public view!: IView;

  public get resolvedView() {
    return NoixTL.Compile(this.view.template || '');
  }

  public render(_ctx: this) {
    return this.RenderDSL(this.resolvedView);
  }

  public RenderDSL(node: NoixTLNode) {
    if (node) {
    }
    return null;
  }
}

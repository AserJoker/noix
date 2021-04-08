import { EventObject } from '@noix/core';
export interface IAttribute<T = unknown> {
  name: string;
  displayName: string;
  render: boolean;
  default: T | null;
}

export class BaseWidget extends EventObject {
  private static _attributes: Map<string, IAttribute> = new Map();
  public constructor() {
    super();
  }

  public static Attribute<T>(attr: Partial<IAttribute<T>> = {}) {
    return <TARGET extends BaseWidget>(target: TARGET, name: string) => {
      const classObject = target.GetClassObject<typeof BaseWidget>();
      let attrs = classObject._attributes;
      const parentClassObject = Object.getPrototypeOf(
        classObject
      ) as typeof BaseWidget;
      if (parentClassObject && parentClassObject._attributes === attrs) {
        classObject._attributes = new Map();
        parentClassObject &&
          parentClassObject._attributes &&
          parentClassObject._attributes.forEach((v, k) =>
            classObject._attributes.set(k, v)
          );
        attrs = classObject._attributes;
      }
      attrs.set(name, {
        name: attr.name || name,
        displayName: attr.name || attr.name || name,
        default: attr.default || null,
        render: attr.render === undefined ? true : attr.render
      });
    };
  }

  public GetAttribute() {
    return this.GetClassObject<typeof BaseWidget>()._attributes;
  }
}
export const Attribute = BaseWidget.Attribute;

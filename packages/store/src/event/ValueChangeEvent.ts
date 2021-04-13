import { BaseEvent } from '@noix/core';

export const EVENT_VALUECHANGE = 'event.valueChange';
export class ValueChangeEvent extends BaseEvent {
  private _newValue: unknown;
  private _oldValue: unknown;
  public constructor(target: unknown, newValue: unknown, oldValue: unknown) {
    super(EVENT_VALUECHANGE, target);
    this._oldValue = oldValue;
    this._newValue = newValue;
  }

  public GetOldValue() {
    return this._oldValue;
  }

  public GetNewValue() {
    return this._newValue;
  }
}

export class BaseEvent<T extends unknown = unknown> {
    private _type:string|Symbol;

    private _target:T|null;

    protected constructor(type:string|Symbol, target:T|null = null) {
        this._type = type;
        this._target = target;
    }

    public GetEventType() {
        return this._type;
    }

    public GetEventTarget() {
        return this._target;
    }
}

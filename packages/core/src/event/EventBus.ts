import { BaseEvent } from './BaseEvent';

export class EventBus {
    private static _eventListener:Map<string|Symbol, Function[]> = new Map()
    private _eventListener:Map<string|Symbol, Function[]> = new Map()
    public AddEventListener<T extends Function>(event:string|Symbol, handle:T) {
    }

    public RemoveEventListener<T extends Function>(event:string|Symbol, handle:T) {
    }

    public Trigger<T extends BaseEvent>(event:T) {
    }
}

import { BaseStore } from '../store';
import { Iterator } from './Iterator';
interface IListNode<K, T extends BaseStore<K>> {
  store: T | null;
  next: IListNode<K, T> | null;
}
class ListIterator<T> extends Iterator<T> {
  private _node: IListNode<T, BaseStore<T>>;
  private _head: IListNode<T, BaseStore<T>>;
  public constructor(
    node: IListNode<T, BaseStore<T>>,
    head: IListNode<T, BaseStore<T>>
  ) {
    super();
    this._node = node;
    this._head = head;
  }

  public _GetValue() {
    return this._node.store?.value || null;
  }

  public _SetValue(newValue: T | null) {
    this._node.store && (this._node.store.value = newValue);
  }

  public _Next() {
    return (
      (this._node.next && new ListIterator<T>(this._node.next, this._head)) ||
      null
    );
  }

  public _Last() {
    let tmp = this._head;
    while (tmp.next && tmp.next !== this._node) {
      tmp = tmp.next;
    }
    return (tmp && new ListIterator<T>(tmp, this._head)) || null;
  }

  public _SetNext(newNode: Iterator<T>) {
    const next = this._node.next;
    this._node.next = (newNode as ListIterator<T>)._node;
    this._node.next.next = next;
  }

  public _SetLast(newNode: Iterator<T>) {
    const last = this._Last();
    if (last) {
      last.next = newNode;
      newNode.next = this;
    }
  }
}
export class List<T> {
  private _head: IListNode<T, BaseStore<T>> = { store: null, next: null };
  private _iterator: ListIterator<T> | null = null;
  public constructor() {}
  public get head(): Iterator<T> {
    if (!this._iterator) {
      this._iterator = new ListIterator<T>(this._head, this._head);
    }
    return this._iterator;
  }

  public get end(): Iterator<T> {
    let tmp = this._head;
    while (tmp.next) {
      tmp = tmp.next;
    }
    return new ListIterator(tmp, this._head);
  }

  public CreateIterator(store: BaseStore<T>): Iterator<T> {
    return new ListIterator<T>({ store, next: null }, this._head);
  }

  public Find(handle: (value: T | null) => boolean): Iterator<T> | null {
    for (let it: Iterator<T> | null = this.head; it !== null; it = it.next) {
      if (handle(it.value)) {
        return it;
      }
    }
    return null;
  }

  public IndexOf(handle: (v: T | null) => boolean) {
    let index = 0;
    let node = this._head.next;
    while (node) {
      if (node.store && handle(node.store.value)) {
        return index;
      }
      node = node.next;
      index++;
    }
    return -1;
  }

  public Includes(handle: (v: T | null) => boolean) {
    return this.IndexOf(handle) !== -1;
  }

  public IndexAt(index: number) {
    if (index > 0) {
      let tmp = this._head.next;
      let _index = 0;
      while (tmp) {
        if (_index === index) {
          return (tmp.store && tmp.store.value) || null;
        }
        tmp = tmp.next;
        _index++;
      }
    }
    return null;
  }

  public get length() {
    let _length = 0;
    let tmp = this._head.next;
    while (tmp) {
      tmp = tmp.next;
      _length++;
    }
    return _length;
  }
}

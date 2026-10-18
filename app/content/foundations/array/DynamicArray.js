// A resizable array on top of a fixed-size block, to show why push is O(1) amortised.
export default class DynamicArray {
  constructor() {
    this.capacity = 2;
    this.length = 0;
    this.data = new Array(this.capacity);
  }

  get(i) {
    if (i < 0 || i >= this.length) throw new RangeError('index out of range');
    return this.data[i]; // O(1)
  }

  push(value) {
    if (this.length === this.capacity) this.#grow(); // rare, O(n)
    this.data[this.length++] = value; // usual case, O(1)
  }

  pop() {
    if (this.length === 0) return undefined;
    const value = this.data[--this.length];
    this.data[this.length] = undefined;
    return value;
  }

  insert(i, value) { // O(n): everything after i shifts right
    if (this.length === this.capacity) this.#grow();
    for (let k = this.length; k > i; k--) this.data[k] = this.data[k - 1];
    this.data[i] = value;
    this.length++;
  }

  remove(i) { // O(n): everything after i shifts left
    const value = this.data[i];
    for (let k = i; k < this.length - 1; k++) this.data[k] = this.data[k + 1];
    this.data[--this.length] = undefined;
    return value;
  }

  #grow() {
    this.capacity *= 2;
    const bigger = new Array(this.capacity);
    for (let i = 0; i < this.length; i++) bigger[i] = this.data[i];
    this.data = bigger;
  }
}

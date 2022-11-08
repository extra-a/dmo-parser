
export class DataIter<T = number> implements IterableIterator<T> {
  private consumed = 0;

  constructor(private iter: IterableIterator<T> | DataIter<T>, private limit = Infinity) {
    if (iter instanceof DataIter) {
      this.iter = iter;
      this.consumed = 0;
      if (iter.limit < this.limit) {
        throw new Error(`Out of range nested iter ${limit} for ${iter.limit}`);
      }
    }
  }

  [Symbol.iterator]() {
    return this;
  };

  next(): IteratorResult<T, T | undefined> {
    if (this.consumed >= this.limit) {
      return { value: undefined, done: true };
    } else {
      this.consumed++;
      return this.iter.next();
    }
  }

  remaining() {
    return this.limit - this.consumed;
  }
}

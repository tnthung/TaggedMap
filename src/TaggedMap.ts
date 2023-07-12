

export class TaggedMap<K, V> {
  private tag2val = new Map<K, Set<V>>();
  private val2tag = new Map<V, Set<K>>();

  setTag(value: V, ...tags: K[]) {
    // Remove old tags
    this.val2tag.get(value)?.forEach(tag => {
      if (tags.includes(tag)) return;
      this.tag2val.get(tag)?.delete(value)

      // Clean up if no tag left
      if (this.tag2val.get(tag)?.size === 0)
        this.tag2val.delete(tag);
    });

    // Set new tags
    this.val2tag.set(value, new Set(tags));

    // Add to map
    tags.forEach(tag => {
      const values = this.tag2val.get(tag);
      if (values) values.add(value);
      else this.tag2val.set(tag, new Set([value]));
    });
  }

  getTag(value: V): K[] {
    return [...this.val2tag.get(value) ?? []];
  }

  delTag(...tags: K[]) {
    tags.forEach(tag => {
      // Remove from rev
      this.tag2val.get(tag)?.forEach(value => {
        this.val2tag.get(value)?.delete(tag)

        // Clean up if no tag left
        if (this.val2tag.get(value)?.size === 0)
          this.val2tag.delete(value);
      });

      // Remove from map
      this.tag2val.delete(tag);
    });
  }

  addTag(value: V, ...tags: K[]) {
    // Add to map
    tags.forEach(tag => {
      const values = this.tag2val.get(tag);
      if (values) values.add(value);
      else this.tag2val.set(tag, new Set([value]));
    });

    // Add to rev
    const oldTags = this.val2tag.get(value);
    if (!oldTags) {
      this.val2tag.set(value, new Set(tags));
      return;
    }

    tags.forEach(v => oldTags.add(v));
  }

  rmvTag(value: V, ...tags: K[]) {
    // Remove from map
    tags.forEach(tag =>
      this.tag2val.get(tag)?.delete(value));

    // Remove from rev
    const oldTags = this.val2tag.get(value);
    if (!oldTags) return;
    tags.forEach(v => oldTags.delete(v));

    // Clean up if no tag left
    if (oldTags.size === 0)
      this.val2tag.delete(value);
  }

  hasTag(value: V, ...tags: K[]) {
    // return true if no tag
    if (tags.length === 0) return true;

    // get tags of value
    const tags_of_value = this.val2tag.get(value);

    // return false if no tags
    if (!tags_of_value) return false;

    // return true if all tags are in tags_of_value
    return tags.every(t => tags_of_value.has(t));
  }

  tags(): K[] {
    return [...this.tag2val.keys()];
  }

  values(): V[] {
    return [...this.val2tag.keys()];
  }

  exact(...tags: K[]): V[] {
    // get the intersection of all tags
    const values = this.intersect(...tags);

    // filter out values that have more tags than specified
    return values.filter(v => {
      const tagsOfValue = this.val2tag.get(v);
      if (!tagsOfValue) return false;
      return tagsOfValue.size === tags.length;
    });
  }

  union(...tags: K[]): V[] {
    // return empty array if no tag
    if (tags.length === 0) return [];

    // setup initial values
    const valuesArr = tags.map(t => {
      const tmp = this.tag2val.get(t);
      if (!tmp) return [];
      return [...tmp];
    });

    // reduce the valuesArr to the union of all values
    const union = new Set<V>();

    valuesArr.forEach(arr =>
      arr.forEach(v => union.add(v)));

    return [...union];
  }

  intersect(...tags: K[]): V[] {
    // return empty array if no tag
    if (tags.length === 0) return [];

    // setup initial values
    const valuesArr = tags.map(t => {
      const tmp = this.tag2val.get(t);
      if (!tmp) return [];
      return [...tmp];
    });

    // reduce the valuesArr to the intersection of all values
    return valuesArr.reduce((acc, cur) =>
      acc.filter(v => cur.includes(v)));
  }

  difference(from: K, ...tags: K[]): V[] {
    // get values from `from` tag
    const values_from = [...this.tag2val.get(from) ?? []];

    // return fromValues if no tags
    if (tags.length === 0) return values_from;

    // filter values that have any of the tags
    return values_from.filter(v => {
      const tags_from = this.val2tag.get(v);
      if (!tags_from) return false;
      return [...tags_from].every(
        t => !tags.includes(t));
    });
  }

  complement(from: K): V[] {
    // get values from `from` tag
    const values_from = [...this.tag2val.get(from) ?? []];

    // get all values
    const values = [...this.val2tag.keys()];

    // filter values that have any of the tags
    return values.filter(v => !values_from.includes(v));
  }

  symmetricDifference(...tags: K[]): V[] {
    // get all difference of each tag
    const valuesArr = tags.map(t => this.difference(
      t, ...tags.filter(v => v !== t)));

    // combine all values
    const union = new Set<V>();

    valuesArr.forEach(arr =>
      arr.forEach(v => union.add(v)));

    // return the union
    return [...union];
  }
}



export function TaggedMap<K, V>() {
  const tag2val = new Map<K, Set<V>>();
  const val2tag = new Map<V, Set<K>>();


  function setTag(value: V, ...tags: K[]) {
    // Remove old tags
    val2tag.get(value)?.forEach(tag => {
      if (tags.includes(tag)) return;
      tag2val.get(tag)?.delete(value)

      // Clean up if no tag left
      if (tag2val.get(tag)?.size === 0)
        tag2val.delete(tag);
    });

    // Set new tags
    val2tag.set(value, new Set(tags));

    // Add to map
    tags.forEach(tag => {
      const values = tag2val.get(tag);
      if (values) values.add(value);
      else tag2val.set(tag, new Set([value]));
    });
  }


  function delTag(tag: K) {
    // Remove from rev
    tag2val.get(tag)?.forEach(value =>
      val2tag.get(value)?.delete(tag));

    // Remove from map
    tag2val.delete(tag);
  }


  function getTag(value: V): K[] {
    return [...val2tag.get(value) ?? []];
  }


  function addTag(value: V, ...tags: K[]) {
    // Add to map
    tags.forEach(tag => {
      const values = tag2val.get(tag);
      if (values) values.add(value);
      else tag2val.set(tag, new Set([value]));
    });

    // Add to rev
    const oldTags = val2tag.get(value);
    if (!oldTags) {
      val2tag.set(value, new Set(tags));
      return;
    }

    tags.forEach(v => oldTags.add(v));
  }


  function rmvTag(value: V, ...tags: K[]) {
    // Remove from map
    tags.forEach(tag =>
      tag2val.get(tag)?.delete(value));

    // Remove from rev
    const oldTags = val2tag.get(value);
    if (!oldTags) return;
    tags.forEach(v => oldTags.delete(v));

    // Clean up if no tag left
    if (oldTags.size === 0)
      val2tag.delete(value);
  }


  function intersect(...tag: K[]): V[] {
    // return empty array if no tag
    if (tag.length === 0) return [];

    // setup initial values
    const valuesArr = tag.map(v => {
      const tmp = tag2val.get(v);
      if (!tmp) return [];
      return [...tmp];
    });

    // reduce the valuesArr to the intersection of all values
    return valuesArr.reduce((acc, cur) =>
      acc.filter(v => cur.includes(v)));
  }


  function union(...tag: K[]): V[] {
    // return empty array if no tag
    if (tag.length === 0) return [];

    // setup initial values
    const valuesArr = tag.map(v => {
      const tmp = tag2val.get(v);
      if (!tmp) return [];
      return [...tmp];
    });

    // reduce the valuesArr to the union of all values
    const union = new Set<V>();

    valuesArr.forEach(arr =>
      arr.forEach(v => union.add(v)));

    return [...union];
  }


  return {
    setTag,
    getTag,
    delTag,
    addTag,
    rmvTag,

    intersect,
    union,
  };
}

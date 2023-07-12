# tagged-map

This is a simple wrapper around the `Map` object to simplify the
many-to-many mapping of keys to values.


## Methods

### `tags()`

Get all tags in the map.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];
const tmp2 = [1];

map.setTag(tmp1, "a", "b", "c");
map.setTag(tmp2, "a", "b", "d");

map.tags(); // ["a", "b", "c", "d"]
```

### `values()`

Get all values in the map.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];
const tmp2 = [1];

map.setTag(tmp1, "a", "b", "c");
map.setTag(tmp2, "a", "b", "d");

map.values(); // [tmp1, tmp2]
```

### `clear()`

Clear all values and tags from the map.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];
const tmp2 = [1];

map.setTag(tmp1, "a", "b", "c");
map.setTag(tmp2, "a", "b", "d");

map.clear();
// value -> tag
//
// tag -> value
```

### `setTag(value, ...tags)`

Add a `value` to the map with the given `tags`. If the `value` already exists
in the map, the tags will be overwritten.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];
const tmp2 = [1];

map.setTag(tmp1, "a", "b", "c");
// value -> tag
//   tmp1 -> "a", "b", "c"
//
// tag -> value
//   "a" -> tmp1
//   "b" -> tmp1
//   "c" -> tmp1

map.setTag(tmp2, "a", "b", "d");
// value -> tag
//   tmp2 -> "a", "b", "d"
//
// tag -> value
//   "a" -> tmp1, tmp2
//   "b" -> tmp1, tmp2
//   "c" -> tmp1
//   "d" -> tmp2

map.setTag(tmp1, "e", "d");
// value -> tag
//   tmp1 -> "e", "d"
//   tmp2 -> "a", "b", "d"
//
// tag -> value
//   "a" -> tmp2
//   "b" -> tmp2
//   "d" -> tmp1, tmp2
//   "e" -> tmp1
```

### `getTag(value)`

Get the tags associated with the given `value`.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];
const tmp2 = [1];

map.setTag(tmp1, "a", "b", "c");
map.setTag(tmp2, "a", "b", "d");

map.getTag(tmp1); // ["a", "b", "c"]
map.getTag(tmp2); // ["a", "b", "d"]
```

### `delTag(...tags)`

Remove all `tags` from the map. (If one value has no tags, it will be removed.)

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];
const tmp2 = [1];

map.setTag(tmp1, "a", "b", "c");
map.setTag(tmp2, "a", "b", "d");
// value -> tag
//   tmp1 -> "a", "b", "c"
//   tmp2 -> "a", "b", "d"
//
// tag -> value
//   "a" -> tmp1, tmp2
//   "b" -> tmp1, tmp2
//   "c" -> tmp1
//   "d" -> tmp2

map.delTag("a");
// value -> tag
//   tmp1 -> "b", "c"
//   tmp2 -> "b", "d"
//
// tag -> value
//   "b" -> tmp1, tmp2
//   "c" -> tmp1
//   "d" -> tmp2
```

### `addTag(value, ...tags)`

Add `tags` to the given `value`. If the `value` does not exist in the map, it
will be added.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];

map.setTag(tmp1, "a", "b", "c");
// value -> tag
//   tmp1 -> "a", "b", "c"
//
// tag -> value
//   "a" -> tmp1
//   "b" -> tmp1
//   "c" -> tmp1

map.addTag(tmp1, "a", "b", "d");
// value -> tag
//   tmp1 -> "a", "b", "c", "d"
//
// tag -> value
//   "a" -> tmp1
//   "b" -> tmp1
//   "c" -> tmp1
//   "d" -> tmp1
```

### `rmvTag(value, ...tags)`

Remove `tags` from the given `value`. If the `value` has no tags, it will be
removed from the map.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];
const tmp2 = [1];

map.setTag(tmp1, "a", "b", "c");
map.setTag(tmp2, "a", "b", "d");
// value -> tag
//   tmp1 -> "a", "b", "c"
//   tmp2 -> "a", "b", "d"
//
// tag -> value
//   "a" -> tmp1, tmp2
//   "b" -> tmp1, tmp2
//   "c" -> tmp1
//   "d" -> tmp2

map.rmvTag(tmp1, "a");
// value -> tag
//   tmp1 -> "b", "c"
//   tmp2 -> "a", "b", "d"
//
// tag -> value
//   "a" -> tmp2
//   "b" -> tmp1, tmp2
//   "c" -> tmp1
//   "d" -> tmp2
```

### `hasTag(value, ...tags)`

Check if the given `value` has all of the given `tags`.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];

map.setTag(tmp1, "a", "b", "c");

map.hasTag(tmp1, "a");      // true
map.hasTag(tmp1, "a", "b"); // true
map.hasTag(tmp1, "a", "d"); // false
```

### `exact(...tags)`

Get all values that have exactly the given `tags`.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];
const tmp2 = [1];

map.setTag(tmp1, "a", "b", "c");
map.setTag(tmp2, "a", "b", "d");

map.exact("a", "b");        // []
map.exact("a", "b", "c");   // [tmp1]
map.exact("a", "b", "d");   // [tmp2]
```

### `union(...tags)`

Get all values that have at least one of the given `tags`.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];
const tmp2 = [1];
const tmp3 = [2];

map.setTag(tmp1, "a", "b", "c");
map.setTag(tmp2, "a", "b", "d");
map.setTag(tmp3, "c", "d");

map.union("a", "b");        // [tmp1, tmp2]
map.union("c", "d");        // [tmp1, tmp2, tmp3]
```

### `intersect(...tags)`

Get all values that have all of the given `tags`.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];
const tmp2 = [1];
const tmp3 = [2];

map.setTag(tmp1, "a", "b", "c");
map.setTag(tmp2, "a", "b", "d");
map.setTag(tmp3, "c", "d");

map.intersect("a", "b");    // [tmp1, tmp2]
map.intersect("c", "d");    // [tmp3]
map.intersect("b", "d");    // [tmp2]
map.intersect("a", "c");    // []
```

### `difference(from_tag, ...tags)`

Get all values from `from_tag` that do not have any of the given `tags`.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];
const tmp2 = [1];
const tmp3 = [2];

map.setTag(tmp1, "a", "b", "c");
map.setTag(tmp2, "a", "b", "d");
map.setTag(tmp3, "c", "d");

map.difference("a", "b");   // []
map.difference("c", "a");   // [tmp3]
map.difference("b", "d");   // [tmp1]
map.difference("a", "c");   // [tmp2]
```

### `complement(from_tag)`

Get all values from `from_tag` that do not have any tags.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];
const tmp2 = [1];

map.setTag(tmp1, "a", "b", "c");
map.setTag(tmp2, "a", "b", "d");

map.complement("a");        // []
map.complement("b");        // []
map.complement("c");        // [tmp2]
map.complement("d");        // [tmp1]
```

### `symmetricDifference(...tags)`

Get all values that have exactly one of the given `tags`.

```ts
const map = new TaggedMap<string, [number]>();

const tmp1 = [0];
const tmp2 = [1];

map.setTag(tmp1, "a", "b", "c");
map.setTag(tmp2, "a", "b", "d");

map.symmetricDifference("a", "b");   // []
map.symmetricDifference("a", "c");   // [tmp2]
map.symmetricDifference("b", "d");   // [tmp1]
```

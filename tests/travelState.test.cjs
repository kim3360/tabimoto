const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
// Load the pure TypeScript model with image modules represented by asset paths.
const cache = new Map();
function load(file) {
  if (/\.(jpg|png)$/.test(file)) return file;
  if (!path.extname(file)) file += '.ts';
  if (cache.has(file)) return cache.get(file);
  const module = { exports: {} };
  cache.set(file, module.exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, {
    filename: file,
  })(
    (id) => load(path.resolve(path.dirname(file), id)),
    module,
    module.exports,
  );
  return module.exports;
}
const { initialState, valid, insertStop, moveStop } = load(
  path.resolve(__dirname, '../src/state/travelState.ts'),
);
test('saved travel state survives serialization with notes and selected vote', () => {
  const state = {
    ...initialState,
    vote: 'tea',
    notes: { one: JSON.stringify({ title: '정원', text: '고요한 시간' }) },
  };
  assert.equal(valid(JSON.parse(JSON.stringify(state))), true);
});
test('malformed persisted data is rejected without throwing', () => {
  for (const value of [
    null,
    {},
    { ...initialState, stops: [null] },
    { ...initialState, folders: [null] },
    { ...initialState, members: [null] },
    { ...initialState, expenses: [null] },
    { ...initialState, rules: [true] },
    { ...initialState, notes: [] },
    { ...initialState, stops: [{ ...initialState.stops[0], day: 6 }] },
  ])
    assert.equal(valid(value), false);
});
test('a place is unique within a day and can appear on a different day', () => {
  assert.equal(
    insertStop(initialState, 'garden', 2, 'duplicate'),
    initialState,
  );
  const next = insertStop(initialState, 'garden', 3, 'new-day');
  assert.equal(next.stops.filter((s) => s.placeId === 'garden').length, 2);
  assert.equal(initialState.stops.length, 4);
});
test('invalid place IDs and day numbers cannot enter the itinerary', () => {
  for (const [id, day] of [
    ['missing', 2],
    ['garden', 0],
    ['garden', 6],
    ['garden', 1.5],
  ])
    assert.equal(insertStop(initialState, id, day, 'invalid'), initialState);
});
test('moving a stop respects day boundaries and preserves other dates', () => {
  const state = insertStop(initialState, 'skyline', 1, 'day-one');
  const next = moveStop(state, 'sample-garden', -1);
  assert.deepEqual(
    next.stops.filter((s) => s.day === 2).map((s) => s.placeId),
    ['garden', 'bamboo', 'matsuda', 'tea'],
  );
  assert.equal(next.stops.at(-1).id, 'day-one');
  assert.equal(moveStop(state, 'sample-bamboo', -1), state);
  assert.equal(moveStop(state, 'sample-tea', 1), state);
  assert.equal(moveStop(state, 'missing', 1), state);
});

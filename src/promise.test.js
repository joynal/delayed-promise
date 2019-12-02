const { expect } = global;
const {
  happy, cute, bad, delayedActions,
} = require('./promise');


test('0# delayedActions should return error', async () => {
  const actions = [
    { fn: bad, delay: NaN },
  ];
  delayedActions(actions, { recursive: true, errorExit: true }).catch((err) => {
    expect(err.message).toBe('testing error handle');
  });
});

test('1# delayedActions should return result', async () => {
  const actions = [
    { fn: happy, delay: NaN, args: ['bar', { foo: 'baz' }] },
    [cute, 0],
  ];
  const got = await delayedActions(actions, { recursive: true, errorExit: false });

  expect(got.length).toBe(2);

  // first
  expect(got[0].success).toBe(true);
  expect(got[0].result).toBe('barbaz');

  // second
  expect(got[1].success).toBe(true);
  expect(got[1].result).toBe(0.1);
});

test('2# delayedActions should return result', async () => {
  const actions = [
    { fn: happy, delay: 0, args: ['bar', { foo: 'baz' }] },
    { fn: bad, delay: 0 },
    [happy, 0, ['bar', { foo: 'baz' }]],
    [cute, 0],
  ];

  const got = await delayedActions(actions, { recursive: false, errorExit: false });

  expect(got.length).toBe(4);

  // first
  expect(got[0].success).toBe(true);
  expect(got[0].result).toBe('barbaz');

  // second
  expect(got[1].success).toBe(false);
  expect(got[1].error).toBe('testing error handle');

  // third
  expect(got[2].success).toBe(true);
  expect(got[2].result).toBe('barbaz');

  // fourth
  expect(got[3].success).toBe(true);
  expect(got[3].result).toBe(0.1);
});

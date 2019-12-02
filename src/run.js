const {
  happy, cute, bad, delayedActions,
} = require('./promise');

const actions = [
  { fn: happy, delay: 0, args: ['bar', { foo: 'baz' }] },
  { fn: bad, delay: 0 },
  [happy, 0, ['bar', { foo: 'baz' }]],
  [cute, 0],
];

delayedActions(actions, { recursive: false, errorExit: false }).then(console.log);

// delayedActions(actions, { recursive: true, errorExit: true }).catch(console.log);

// delayedActions(actions, { recursive: false, errorExit: true }).catch(console.log);

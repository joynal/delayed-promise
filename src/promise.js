const BigDecimal = require('./bigDecimal');

const calc = (value) => new Promise((res) => {
  setTimeout(() => res(value), 0);
});

const happy = async (args) => calc(args[0] + args[1].foo);

const cute = async () => {
  const a = new BigDecimal('100000000000000000');
  const b = new BigDecimal('1000000000000000000000');

  return parseFloat(a.divide(b).toString());
};

const bad = async () => {
  throw new Error('testing error handle');
};

const processPromise = (errorExit) => async (action) => {
  const startedAt = new Date();
  const [fn, delay, args] = Object.values(action);

  const delayNum = Number.isInteger(delay) ? delay : 0;
  const obj = {
    startedAt,
    success: true,
  };

  return new Promise((res, rej) => {
    setTimeout(async () => {
      try {
        obj.result = await fn(args);
        obj.endAt = new Date();
        res(obj);
      } catch (err) {
        obj.success = false;
        obj.error = err.message;
        obj.endAt = new Date();
        if (errorExit === true) { rej(err.message); }
        res(obj);
      }
    }, delayNum);
  });
};

const processSequentially = async (processed, actions, errorExit) => {
  const processCB = processPromise(errorExit);
  // eslint-disable-next-line no-restricted-syntax
  for (const action of actions) {
    // eslint-disable-next-line no-await-in-loop
    processed.push(await processCB(action));
  }
};

const processParallay = async (actions, errorExit) => {
  const result = await Promise.all(actions.map(processPromise(errorExit)));
  return result;
};

const delayedActions = async (actions, { recursive, errorExit }) => {
  try {
    let processed = [];

    if (recursive) {
      await processSequentially(processed, actions, errorExit);
      return Promise.resolve(processed);
    }

    processed = await processParallay(actions, errorExit);
    return Promise.resolve(processed);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  happy, cute, bad, delayedActions,
};

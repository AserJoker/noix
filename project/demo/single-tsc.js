const { createTSIgnoreDecoratorTanstormer } = require('ts-ignore-decorator');
module.exports = {
  transformers: {
    before: [createTSIgnoreDecoratorTanstormer()]
  }
};

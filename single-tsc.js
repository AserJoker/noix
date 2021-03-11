const {
  createTSIgnoreDecoratorTanstormer
} = require('./build-tools/ts-ignore-decorator');
module.exports = {
  transformers: {
    before: [createTSIgnoreDecoratorTanstormer()]
  }
};

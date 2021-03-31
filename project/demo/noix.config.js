const path = require('path');
module.exports = {
  plugins: [
    {
      name: 'demo',
      main: path.resolve(__dirname, 'src/main.ts')
    }
  ]
};

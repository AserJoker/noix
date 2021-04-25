if (process.env.NODE_ENV == 'production') {
  module.exports = {
    configureWebpack: {
      externals: {
        '@noix/core': '@noix/core',
        'ant-design-vue': 'ant-design-vue'
      }
    },
    css: {
      loaderOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    }
  };
} else {
  module.exports = {
    css: {
      loaderOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    }
  };
}

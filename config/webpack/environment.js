const { environment } = require('@rails/webpacker')
const typescript = require('./loaders/typescript')

const webpack = require('webpack')

// Preventing Babel from transpiling NodeModules packages
environment.loaders.delete('nodeModules');

// Bootstrap 4 has a dependency over jQuery & Popper.js:
environment.plugins.prepend('Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    Popper: ['popper.js', 'default']
  })
)

environment.loaders.prepend('typescript', typescript)

environment.loaders.append('html', {
  test: /\.html$/,
  use: [{
    loader: 'html-loader',
    options: {
      minimize: false,
      esModule: true
    }
  }]
})

module.exports = environment

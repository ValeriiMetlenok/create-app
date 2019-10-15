const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const webpack = require('webpack')

console.log(baseWebpackConfig.externals.path)
const devWebpackConfig  = merge(baseWebpackConfig, {

    mode: 'development',
  
    devServer:{
        contentBase: baseWebpackConfig.externals.path.dist,
        overlay: {
            warnings: true,
            errors: true
        },
        port: 3000,
    },
    watch: true,
    
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new webpack.SourceMapDevToolPlugin({
          filename: "[file].map"
        }),
    ]

});
  

module.exports = new Promise((resolve, reject) => {
    resolve(devWebpackConfig )
})
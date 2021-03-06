const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
/* const del = require('del');

del(['public'])  */


const PATH = {
    entry: path.join( __dirname, '../config.js'),
    dist: path.join( __dirname, '../../public/'),
    postcssConfig: path.join(__dirname, '../postcss.config.js'),
    src: path.join(__dirname, '../../src'),
    PAGES_DIR: path.join(__dirname, '../../src/pages')
}

const PAGES = fs.readdirSync(PATH.PAGES_DIR).filter(fileName => { 

    if(fileName.endsWith('.pug') && !fileName.startsWith('_')){
        return fileName
    }

})

module.exports = {

    externals: {
        path: PATH
    },

    entry:{
        build: PATH.entry
    },

    output: {
        filename: 'js/[name].[hash].js',
        path: PATH.dist,
        publicPath: '/'
    },

    optimization:{
        splitChunks:{
            cacheGroups:{
                vendor:{
                    name:'vendors',
                    test: /node_modules/,
                    chunks:'all',
                    enforce: true
                }
            }
        }
    },

    module:{
        rules:[
            {
                test:/\.js$/,
                loader: 'babel-loader',
                exclude:'/node_modules/'
            },
            {
                test:/\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { 
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: { 
                            sourceMap: true, 
                            config: { 
                                path: PATH.postcssConfig
                            }
                        }
                    }
                ]
            },
            {
                test:/\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { 
                            sourceMap: true
                        }
                    }, 
                    {
                        loader: 'postcss-loader',
                        options: { 
                            sourceMap: true, 
                            config: { 
                                path: PATH.postcssConfig
                            }
                        }
                    }, 
                    {
                        loader: 'sass-loader',
                        options: { 
                            sourceMap: true 
                        }
                    }
                ]
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                  name: '[path][name].[ext]',
                },
            }
        ]
    },
    plugins: [

        new MiniCssExtractPlugin({
            filename: `css/[name].[hash].css`
        }),

        new HtmlWebpackPlugin({
            template: `${PATH.src}/index.html`,
            filename: './index.html',
            //inject:false // отключает автоматическую вставку
        }),

        new CopyWebpackPlugin([
            {
                from: `${PATH.src}/images`, 
                to: `images`
            },
            {
                from: `${PATH.src}/fonts`, 
                to: `css/fonts`
            },
        ]),

        new ImageminPlugin({ 
            test: /\.(jpe?g|png|gif|svg)$/i,
            jpegtran: { progressive: true },
            optipng:{
                optimizationLevel: 3
            },
            plugins:[
                imageminJpegRecompress({
                    loops  : 6,
                    min    : 60,
                    max    : 69,
                    quality: 'medium'
                })
            ],
            pngquant:{ 
                quality: '65-70', 
                speed: 5
            }
        }),

        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PATH.PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/,'.html')}`
        }))

    ]
}
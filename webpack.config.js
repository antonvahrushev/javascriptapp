var path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    devServer: {
        historyApiFallback: true,
        port: 9000
    },
    module: {
        rules: [
            { 
                test: /\.(t|j)sx?$/, 
                use: { 
                    loader: 'ts-loader' 
                }, 
                exclude: /node_modules/ 
            },

            // addition - add source-map support
            { enforce: "pre", test: /\.js$/, exclude: /node_modules/, loader: "source-map-loader" },

            {
                test: /\.(css|scss)/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { name: '[name]-[hash].[ext]' }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|otf|woff)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { name: '[name].[ext]' }
                    }
                ]
            }
        ]
    },

    // addition - add source-map support
    devtool: "source-map",

    plugins: [
        new webpack.DefinePlugin({
            __API__: JSON.stringify('https://api2.citygate.se/adbooker2020'),
            __APIToken__: JSON.stringify('https://api2.citygate.se/auth')
        })
    ]
}
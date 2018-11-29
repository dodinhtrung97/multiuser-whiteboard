const path = require('path');
module.exports = {
	entry: './main.js',
	output: {
		path: __dirname,
		filename: 'dist/index.js'
	},
	devServer:{
		port:4000,
		inline: true,
		disableHostCheck: true
	},
	devtool: 'inline-source-map',
	module:{
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['stage-2', 'react', 'es2015']
				},
			},
			{
	            test: /\.css$/,
	            loader: [ 'style-loader', 'css-loader' ]
	        }
        ]
	},
    resolve: {
    	extensions: ['.css', '.js', '.jsx']
    }
}
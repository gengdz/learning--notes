let path = require('path');
// 作用是，将打包后的文件写入到dist,如果没有的话，就新建一个
let HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',  // 模式有两种，分别是production，development，
  devServer: { // 开发服务器的配置，作用是可以通过 localhost的方式打开服务，好处是：可以查看打包后的结果，但不会真的进行打包，只会在内存中打包
    port: 3000, // 打开的地址
    progress: true, // 显示打包的进度条
    contentBase: './build', // 打包的路径
    compress: true, // 是否压缩
  },
  entry: './src/index.js',   // 入口    
  output: {
    filename: 'index.js',    // 打包后的文件名, 可以加上hash 如： index[hash:8].js
    path: path.resolve(__dirname, 'dist'), // 打包后的地址，这里必须是一个绝对路径
  },
  plugins: [   // 插件数组，
    new HtmlWebpackPlugin({
      template: './src/index.html', // 生成的模板
      filename: 'index.html', // 打包之后的文件名
      minify: { // 压缩设置
        removeAttributeQuotes: true, //去掉双引号
        collapseWhitespace: true, // 压缩空格
      },
      hash: true, // shengcheng hash值
    })

  ]

}



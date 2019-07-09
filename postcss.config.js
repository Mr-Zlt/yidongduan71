const { sep } = require('path')
// const path.sep = require('path')

/**
 * 打包工具在构建的时候，对样式文件的转换都会来调用这个函数
 * 我们可以在函数中针对不同的样式文件配置不同的转换规则
 */

module.exports = ({ file }) => {
  // 如果是 node_modules.vant 相关文件，则将 rootValue 设置为 37.5，否则都设置为 75
  let rootValue = file.dirname.indexOf(`node_modules${sep}vant`) !== -1
    ? 37.5
    : 75
  // return就是返回这个对象
  return {
    plugins: {
      autoprefixer: {},
      'postcss-pxtorem': {
        rootValue,
        propList: ['*']
      }
    }
  }
}

// module.exports = {
//   plugins: {
//     autoprefixer: {},
//     'postcss-pxtorem': {
//       rootValue: 37.5,
//       propList: ['*']
//     }
//   }
// }

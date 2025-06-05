module.exports = {
  presets: ["@babel/preset-env"],
  plugins: [
    "@babel/plugin-proposal-nullish-coalescing-operator", // NULL判断运算符 ?? 转换
    "@babel/plugin-transform-arrow-functions", // 箭头函数转换
    "@babel/plugin-proposal-optional-chaining", // 可选链（?.）转换
  ],
};

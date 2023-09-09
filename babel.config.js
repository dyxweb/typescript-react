module.exports = {
  // 预设执行顺序由右往左，所以先处理ts再处理jsx
  "presets": [
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}
module.exports = {
  presets: ["@babel/preset-env"],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
    "transform-class-properties",
  ],
};

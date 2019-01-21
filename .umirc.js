export default {
  plugins: [
    [
      'umi-plugin-library', {
        doc: {
          title: "Umi 组件开发工具",
          base: "/umi-plugin-library",
          files: "docs/**/*.mdx",
          hashRouter: true
        }
      }
    ]
  ],
}

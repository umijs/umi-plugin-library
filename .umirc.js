const icon = `https://avatars2.githubusercontent.com/u/33895495?s=48&v=4`;

export default {
  plugins: [
    [
      'umi-plugin-library', {
        doc: {
          title: "Umi 组件开发工具",
          base: "/umi-plugin-library",
          files: "docs/**/*.mdx",
          hashRouter: true,
          favicon: icon,
          themeConfig: {
            logo: {
              src: icon,
              width: 48,
            },
          }
        }
      }
    ]
  ],
}

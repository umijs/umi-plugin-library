
export default {
  plugins: [
    [
      '../../packages/umi-plugin-library/dist',
      {
        umd: false,
      }
    ],
    './plugin',
  ],
}


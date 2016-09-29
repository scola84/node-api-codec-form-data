import buble from 'rollup-plugin-buble';

export default {
  dest: './dist/api-codec-form-data.js',
  entry: 'index.js',
  format: 'cjs',
  external: [
    'busboy',
    'stream'
  ],
  plugins: [
    buble()
  ]
};

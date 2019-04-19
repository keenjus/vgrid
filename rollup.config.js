import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.ts',
  output: {
    format: 'esm',
    file: 'dist/VGrid.js'
  },
  external: ['vue', 'moment'],
  plugins: [
    typescript(),
    commonjs(),
    vue()
  ]
}

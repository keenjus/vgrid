import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.ts',
  output: {
    name: 'VGrid',
    exports: 'named',
    globals: {
      'vue': 'Vue',
      'moment': 'moment'
    }
  },
  external: ['vue', 'moment'],
  plugins: [
    typescript(),
    commonjs(),
    vue()
  ]
}

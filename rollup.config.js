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
    typescript({
      tsconfig: false,
      experimentalDecorators: true,
      module: 'es2015',
      declaration: true,
      declarationDir: "dist/types"
    }),
    commonjs(),
    vue()
  ]
}

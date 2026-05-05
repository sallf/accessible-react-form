import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve(),
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: true,
        declarationDir: 'dist/types',
        rootDir: 'src',
      }),
      terser(),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react', '@babel/preset-typescript'],
        babelHelpers: 'bundled',
      }),
    ],
  },
]

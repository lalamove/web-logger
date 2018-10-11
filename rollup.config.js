import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      name: 'Logger',
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
    {
      name: 'Logger',
      file: pkg.iife,
      format: 'iife',
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs(),
    // minify({
    //   comments: false,
    //   sourceMap: false,
    // }),
  ],
};

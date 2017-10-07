import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'ReactOA',
  },
  sourcemap: true,
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    sourcemaps(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
  ],
  external: ['rxjs', 'react', 'react-dom', 'is-equal-shallow'],
};

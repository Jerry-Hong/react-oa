import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  sourcemap: true,
  plugins: [
    resolve(),
    sourcemaps(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
  ],
  external: ['rxjs', 'react', 'react-dom', 'is-equal-shallow'],
};

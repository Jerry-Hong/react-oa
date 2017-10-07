import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'bundle/bundle.js',
    format: 'es',
    name: 'reactOA',
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
  ],
  external: ['rxjs', 'react', 'react-dom', 'is-equal-shallow'],
};

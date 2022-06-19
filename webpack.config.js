import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { NODE_ENV = 'production' } = process.env;

export default {
  entry:
    NODE_ENV === 'production' ? './src/index.ts' : './src/multi-server.ts',
  mode: 'none',
  target: 'node',
  output: {
    path: resolve(__dirname, 'build'),
    filename: 'bundle.cjs',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

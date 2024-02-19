import path from 'path';
import fs from 'fs/promises';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return defineConfig({
		define: {
			'process.env': env,
			...(process.env.NODE_ENV === 'development' && { global: {} }),
		},
		server: {
			port: 3031,
			strictPort: true,
		},
		plugins: [react()],
		build: {
			outDir: 'build',
		},
		resolve: {
			alias: [
				{
					find: /^~(.+)/,
					replacement: path.join(process.cwd(), 'node_modules/$1'),
				},
				{
					find: /^src(.+)/,
					replacement: path.join(process.cwd(), 'src/$1'),
				},
			],
		},
		esbuild: {
			loader: 'tsx',
			include: /src\/.*\.(jsx?|tsx?)$/, // Regex to include js, jsx, ts, and tsx files
			exclude: [],
		},
		optimizeDeps: {
			esbuildOptions: {
				plugins: [
					{
						name: 'load-js-files-as-jsx',
						setup(build) {
							build.onLoad({ filter: /src\/.*\.(jsx?|tsx?)$/ }, async (args) => ({
								loader: 'jsx',
								contents: await fs.readFile(args.path, 'utf8'),
							}));
						},
					},
				],
			},
		},
	});
};

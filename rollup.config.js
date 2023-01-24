const config = {
	input: 'src/main.js',
	output: [
		{
			file: './dist/bundle.js',
			format: 'es',
			name: '@amekusa/exceptions.js',
			sourcemap: true,
			validate: true
		}, {
			file: './dist/bundle.cjs',
			format: 'umd',
			name: '@amekusa/exceptions.js',
			sourcemap: true,
			validate: true
		}
	]
};

export default config;
// const esbuildPluginTsc = require('esbuild-plugin-tsc')
const esbuild = require('esbuild')
const { esbuildDecorators } = require('@anatine/esbuild-decorators')

const entryPoints = ['./src/server.ts']
esbuild.build({
  entryPoints,
  bundle: true,
  platform: 'node',
  sourcemap: true,
  outdir: 'dist',
  format: 'cjs',
  minify: false,
  external: ['mock-aws-s3', 'nock', 'vm2', 'bcrypt', 'emitter'],
  plugins: [esbuildDecorators()],
  target: ['node16'],
})

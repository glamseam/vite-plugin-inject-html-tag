import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: ['./src/index'],
    outDir: 'dist',
    declaration: true,
    externals: ['vite'],
    rollup: {
        emitCJS: true,
        esbuild: {
            sourceMap: true
        }
    }
})

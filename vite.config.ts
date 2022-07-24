import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { injectHtmlTag, HtmlObject } from './src'

const htmlObject: HtmlObject = {
    head: {
        title: 'Solid App',
        viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
        meta: [
            { name: 'description', content: '' },
            { name: 'theme-color', content: '#000000' }
        ],
        link: [
            { attrs: { rel: 'icon' }, href: '/solid/assets/favicon.ico' }
        ]
    }
}

export default defineConfig({
    build: {
        outDir: '.solid/dist',
        target: 'esnext'
    },
    plugins: [
        solidPlugin(),
        injectHtmlTag(htmlObject)
    ]
})

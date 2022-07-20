import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { injectHtmlTag, HtmlTag } from './src/vite-plugin-inject-html-tag'

const htmlTag: HtmlTag = {
    head: {
        title: 'Solid App',
        meta: [
            { charset: 'utf-8' },
            { name: 'description', content: '' },
            { name: 'viewport', content: 'width=device-width,initial-scale=1,viewport-fit=cover' },
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
        injectHtmlTag(htmlTag)
    ]
})

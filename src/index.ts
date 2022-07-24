import type { Plugin, HtmlTagDescriptor } from 'vite'

interface HeadChildBase {
    attrs?: HtmlTagDescriptor['attrs']
    injectTo?: Extract<HtmlTagDescriptor['injectTo'], 'head' | 'head-prepend'>
}

interface BodyChildBase {
    attrs?: HtmlTagDescriptor['attrs']
    injectTo?: Extract<HtmlTagDescriptor['injectTo'], 'body' | 'body-prepend'>
}

interface ScriptBase {
    src?: string
    children?: string
}

interface HeadMeta extends HeadChildBase {
    name?: string
    property?: string
    content: string | undefined
}

interface HeadLink extends HeadChildBase {
    href: string | undefined
}

type HeadScript = ScriptBase & HeadChildBase

interface HeadStyle extends HeadChildBase {
    children: string | undefined
}

export interface Head {
    title?: string
    charset?: string
    viewport?: string
    link?: HeadLink[]
    meta?: HeadMeta[]
    script?: HeadScript[]
    style?: HeadStyle[]
}

interface BodyDefault extends BodyChildBase {
    tag: string
    children?: string | Omit<BodyDefault, 'injectTo'>[]
}

type BodyScript = ScriptBase & BodyChildBase

export interface Body {
    default?: BodyDefault[]
    script?: BodyScript[]
}

export interface HtmlObject {
    head?: Head
    body?: Body
}

export const genHtmlTagDescriptor = (htmlObject: HtmlObject, { isCharset = true, isViewport = true } = {}) => {
    const htmlTagDescriptors: HtmlTagDescriptor[] = []

    // head.title
    if (htmlObject.head?.title) {
        htmlTagDescriptors.push({
            tag: 'title',
            children: htmlObject.head.title,
            injectTo: 'head-prepend'
        })
    }

    // head.meta.charset
    if (isCharset) {
        htmlTagDescriptors.push({
            tag: 'meta',
            attrs: { charset: htmlObject.head?.charset ?? 'utf-8' },
            injectTo: 'head-prepend'
        })
    }

    // head.meta.viewport
    if (isViewport) {
        htmlTagDescriptors.push({
            tag: 'meta',
            attrs: { name: 'viewport', content: htmlObject.head?.viewport ?? 'width=device-width,initial-scale=1' },
            injectTo: 'head-prepend'
        })
    }

    if (htmlObject.head) {
        const headObject = htmlObject.head
        const headKeys = Object.keys(htmlObject.head)
        headKeys.forEach((key) => {
            // head.link
            if (key === 'link' && headObject.link && headObject.link.length > 0) {
                headObject.link.forEach((v) => {
                    if (v.href) {
                        htmlTagDescriptors.push({
                            tag: 'link',
                            attrs: {
                                href: v.href,
                                ...v.attrs
                            },
                            injectTo: v.injectTo ?? 'head-prepend'
                        })
                    }
                })
            }

            // head.meta
            if (key === 'meta' && headObject.meta && headObject.meta.length > 0) {
                headObject.meta.forEach((v) => {
                    if (v.content && v.name !== 'viewport' && v.attrs?.name !== 'viewport') {
                        htmlTagDescriptors.push({
                            tag: 'meta',
                            attrs: {
                                name: v.name,
                                content: v.content,
                                ...v.attrs
                            },
                            injectTo: v.injectTo ?? 'head-prepend'
                        })
                    }
                })
            }

            // head.script
            if (key === 'script' && headObject.script && headObject.script.length > 0) {
                headObject.script.forEach((v) => {
                    htmlTagDescriptors.push({
                        tag: 'script',
                        attrs: v.src
                            ? { src: v.src, ...v.attrs }
                            : v.attrs,
                        children: v.children,
                        injectTo: v.injectTo ?? 'body-prepend'
                    })
                })
            }

            // head.style
            if (key === 'style' && headObject.style && headObject.style.length > 0) {
                headObject.style.forEach((v) => {
                    if (v.children) {
                        htmlTagDescriptors.push({
                            tag: 'style',
                            attrs: {
                                type: 'text/css',
                                ...v.attrs
                            },
                            children: v.children,
                            injectTo: v.injectTo ?? 'head-prepend'
                        })
                    }
                })
            }
        })
    }

    if (htmlObject.body) {
        const bodyObject = htmlObject.body
        const bodyKeys = Object.keys(htmlObject.body)
        bodyKeys.forEach((key) => {
            // body.default
            if (key === 'default' && bodyObject.default && bodyObject.default.length > 0) {
                bodyObject.default.forEach((v) => {
                    htmlTagDescriptors.push({
                        tag: v.tag,
                        attrs: v.attrs,
                        children: v.children,
                        injectTo: v.injectTo ?? 'body-prepend'
                    })
                })
            }

            // body.script
            if (key === 'script' && bodyObject.script && bodyObject.script.length > 0) {
                bodyObject.script.forEach((v) => {
                    htmlTagDescriptors.push({
                        tag: 'script',
                        attrs: v.src
                            ? { src: v.src, ...v.attrs }
                            : v.attrs,
                        children: v.children,
                        injectTo: v.injectTo ?? 'body-prepend'
                    })
                })
            }
        })
    }

    return htmlTagDescriptors
}

export const injectHtmlTag = (
    htmlObject: HtmlObject,
    { isCharset = true, isViewport = true } = {}
): Plugin => {

    return {
        name: 'inject-html-tag',
        transformIndexHtml() {
            return genHtmlTagDescriptor(htmlObject, { isCharset, isViewport })
        }
    }
}

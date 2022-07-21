import type { Plugin, HtmlTagDescriptor } from 'vite'

interface LinkStyleBase {
    attrs?: HtmlTagDescriptor['attrs']
    injectTo?: Extract<HtmlTagDescriptor['injectTo'], 'head' | 'head-prepend'>
}

interface Meta extends LinkStyleBase {
    name?: string
    property?: string
    content: string | undefined
}

interface Link extends LinkStyleBase {
    href: string | undefined
}

interface Style extends LinkStyleBase {
    children: string | undefined
}

export interface Head {
    title?: string
    charset?: string
    viewport?: string
    link?: Link[]
    meta?: Meta[]
    style?: Style[]
}

export interface Body {
    tag: string
    attrs?: HtmlTagDescriptor['attrs']
    children?: string | Omit<Body, 'injectTo'>[]
    injectTo?: Extract<HtmlTagDescriptor['injectTo'], 'body' | 'body-prepend'>
}

export interface Script extends Omit<HtmlTagDescriptor, 'tag'> {
    src?: string
}

export interface HtmlTag {
    head?: Head
    body?: Body[]
    script?: Script[]
}

export const injectHtmlTag = (htmlTag: HtmlTag): Plugin => {
    const els: HtmlTagDescriptor[] = []

    // head.title
    if (htmlTag.head?.title) {
        const title: HtmlTagDescriptor = {
            tag: 'title',
            children: htmlTag.head.title,
            injectTo: 'head-prepend'
        }
        els.push(title)
    }

    // head.meta.charset
    els.push({
        tag: 'meta',
        attrs: { charset: htmlTag.head?.charset ?? 'utf-8' },
        injectTo: 'head-prepend'
    })

    // head.meta.viewport
    els.push({
        tag: 'meta',
        attrs: { name: 'viewport', content: htmlTag.head?.viewport ?? 'width=device-width,initial-scale=1' },
        injectTo: 'head-prepend'
    })

    if (htmlTag.head) {
        // head.link
        if (htmlTag.head.link && htmlTag.head.link.length > 0) {
            htmlTag.head.link.forEach((v) => {
                if (v.href) {
                    const link: HtmlTagDescriptor = {
                        tag: 'link',
                        attrs: {
                            href: v.href,
                            ...v.attrs
                        },
                        injectTo: v.injectTo ?? 'head-prepend'
                    }
                    els.push(link)
                }
            })
        }

        // head.meta
        if (htmlTag.head.meta && htmlTag.head.meta.length > 0) {
            htmlTag.head.meta.forEach((v) => {
                if (v.content && v.name !== 'viewport' && v.attrs?.name !== 'viewport') {
                    const meta: HtmlTagDescriptor = {
                        tag: 'meta',
                        attrs: {
                            name: v.name,
                            content: v.content,
                            ...v.attrs
                        },
                        injectTo: 'head-prepend'
                    }
                    els.push(meta)
                }
            })
        }

        // head.style
        if (htmlTag.head.style && htmlTag.head.style.length > 0) {
            htmlTag.head.style.forEach((v) => {
                if (v.children) {
                    const style: HtmlTagDescriptor = {
                        tag: 'style',
                        attrs: {
                            type: 'text/css',
                            ...v.attrs
                        },
                        children: v.children,
                        injectTo: v.injectTo ?? 'head-prepend'
                    }
                    els.push(style)
                }
            })
        }
    }

    // body
    if (htmlTag.body) {
        htmlTag.body.forEach((v) => {
            const body: HtmlTagDescriptor = {
                tag: v.tag,
                attrs: v.attrs,
                children: v.children,
                injectTo: v.injectTo ?? 'body-prepend'
            }
            els.push(body)
        })
    }

    if (htmlTag.script) {
        htmlTag.script.forEach((v) => {
            if (v.src || v.children) {
                const script: HtmlTagDescriptor = {
                    tag: 'script',
                    attrs: {
                        src: v.src,
                        ...v.attrs
                    },
                    children: v.children,
                    injectTo: v.injectTo ?? 'body'
                }
                els.push(script)
            }
        })
    }

    return {
        name: 'inject-html-tag',
        transformIndexHtml() {
            return els
        }
    }
}

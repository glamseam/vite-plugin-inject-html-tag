import type { Plugin, HtmlTagDescriptor } from 'vite'

interface LinkStyleBase {
    attrs?: HtmlTagDescriptor['attrs']
    injectTo?: Extract<HtmlTagDescriptor['injectTo'], 'head' | 'head-prepend'>
}

interface Link extends LinkStyleBase {
    href: string
}

interface Style extends LinkStyleBase {
    children: string
}

export interface Head {
    title?: string
    link?: Link[]
    meta?: HtmlTagDescriptor['attrs'][]
    style?: Style[]
}

export interface Body {
    tag: string
    attrs?: HtmlTagDescriptor['attrs']
    children?: string | Omit<Body, 'injectTo'>[]
    injectTo?: Extract<HtmlTagDescriptor['injectTo'], 'body' | 'body-prepend'>
}

export type Script = Omit<HtmlTagDescriptor, 'tag'>

export interface HtmlTag {
    head?: Head
    body?: Body[]
    script?: Script[]
}

export const injectHtmlTag = (htmlTag: HtmlTag): Plugin => {
    const els: HtmlTagDescriptor[] = []

    if (htmlTag.head?.title) {
        const title: HtmlTagDescriptor = {
            tag: 'title',
            children: htmlTag.head.title,
            injectTo: 'head-prepend'
        }
        els.push(title)
    }

    if (htmlTag.head) {
        if (htmlTag.head.link && htmlTag.head.link.length > 0) {
            htmlTag.head.link.forEach((v) => {
                const link: HtmlTagDescriptor = {
                    tag: 'link',
                    attrs: {
                        href: v.href,
                        ...v.attrs
                    },
                    injectTo: v.injectTo ?? 'head-prepend'
                }
                els.push(link)
            })
        }

        if (htmlTag.head.meta && htmlTag.head.meta.length > 0) {
            htmlTag.head.meta.forEach((v) => {
                const meta: HtmlTagDescriptor = {
                    tag: 'meta',
                    attrs: v,
                    injectTo: 'head-prepend'
                }
                els.push(meta)
            })
        }

        if (htmlTag.head.style && htmlTag.head.style.length > 0) {
            htmlTag.head.style.forEach((v) => {
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
            })
        }
    }

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
            const script: HtmlTagDescriptor = {
                tag: 'script',
                attrs: v.attrs,
                children: v.children,
                injectTo: v.injectTo ?? 'body'
            }
            els.push(script)
        })
    }

    return {
        name: 'inject-html-tag',
        transformIndexHtml() {
            return els
        }
    }
}

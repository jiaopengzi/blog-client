// src/utils/markdownParser.ts
import { marked } from "marked"
import { createApp, h } from "vue"
import MyVideo from "./MyVideo.vue"

export async function parseMarkdown(content: string): Promise<string> {
    // 自定义渲染器
    const renderer = new marked.Renderer()

    // 覆盖默认的 HTML 标签渲染逻辑
    renderer.html = ({ text }: { text: string }) => {
        if (
            typeof text === "string" &&
            text.startsWith("<my-video>") &&
            text.endsWith("</my-video>")
        ) {
            const videoID = text.slice(10, -11)
            return `<div class="vue-component" data-component="MyVideo" data-video-id="${videoID}"></div>`
        }
        return text
    }

    // 使用自定义渲染器解析 Markdown
    const html = await marked(content, { renderer })

    return html
}

export function mountVueComponents(container: HTMLElement) {
    // 查找所有自定义组件容器
    const componentContainers = container.querySelectorAll(".vue-component")

    componentContainers.forEach((el) => {
        const componentName = el.getAttribute("data-component")
        const videoID = el.getAttribute("data-video-id")

        if (componentName === "MyVideo" && videoID) {
            const app = createApp({
                render() {
                    return h(MyVideo, { videoID })
                },
            })
            app.mount(el)
        }
    })
}

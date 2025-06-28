/**
 * @FilePath     index.js
 */
import { marked } from "marked"

const customMarkdown1 = `<video-player></video-player>`
const customMarkdown2 = `<pay-read></pay-read>`
const customMarkdown3 = `<my-custom></my-custom>`
const html1 = marked.parse(customMarkdown1)
const html2 = marked.parse(customMarkdown2)
const html3 = marked.parse(customMarkdown3)
console.log("html1=============> ", html1)
console.log("html2=============> ", html2)
console.log("html3=============> ", html3)

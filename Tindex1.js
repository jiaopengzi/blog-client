
/**
 * @FilePath     index.js
 */
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import 'katex/contrib/mhchem'

marked.use(markedKatex({
  throwOnError: false,
  strict: 'warn',
}))

const ceMarkdown = `$$\\ce{N2 + 3H2 <=>T[High temperature Pressurized][Catalyst] 2NH3}$$`
const html = marked.parse(ceMarkdown)
console.log(html)
/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-28 18:10:18
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-08 09:53:56
 * @FilePath     : \blog-client\src\pkg\marked\extension\katex.ts
 * @Description  : 公式扩展配置 https://katex.org/docs/options
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import type { KatexOptions } from "katex" // 公式

const optionKatex: KatexOptions = {
    /**
     * If `true`, math will be rendered in display mode
     * (math in display style and center math on page)
     *
     * If `false`, math will be rendered in inline mode
     * @default false
     */
    displayMode: false,
    /**
     * Determines the markup language of the output. The valid choices are:
     * - `html`: Outputs KaTeX in HTML only.
     * - `mathml`: Outputs KaTeX in MathML only.
     * - `htmlAndMathml`: Outputs HTML for visual rendering
     *   and includes MathML for accessibility.
     *
     * @default 'htmlAndMathml'
     */
    output: "html",
    /**
     * If `true`, display math has \tags rendered on the left
     * instead of the right, like \usepackage[leqno]{amsmath} in LaTeX.
     *
     * @default false
     */
    leqno: false,
    /**
     * If `true`, display math renders flush left with a 2em left margin,
     * like \documentclass[fleqn] in LaTeX with the amsmath package.
     *
     * @default false
     */
    fleqn: false,
    /**
     * If `true`, KaTeX will throw a `ParseError` when
     * it encounters an unsupported command or invalid LaTex
     *
     * If `false`, KaTeX will render unsupported commands as
     * text, and render invalid LaTeX as its source code with
     * hover text giving the error, in color given by errorColor
     * @default true
     */
    throwOnError: false,
    /**
     * A Color string given in format `#XXX` or `#XXXXXX`
     */
    errorColor: "#FF0000",

    /**
     * A collection of custom macros.
     *
     * See `src/macros.js` for its usage
     */
    // macros: { '\\ce': '' },

    /**
     * Specifies a minimum thickness, in ems, for fraction lines,
     * \sqrt top lines, {array} vertical lines, \hline, \hdashline,
     * \underline, \overline, and the borders of \fbox, \boxed, and
     * \fcolorbox.
     */
    minRuleThickness: 0.04,

    /**
     * If `true`, `\color` will work like LaTeX's `\textcolor`
     * and takes 2 arguments
     *
     * If `false`, `\color` will work like LaTeX's `\color`
     * and takes 1 argument
     *
     * In both cases, `\textcolor` works as in LaTeX
     *
     * @default false
     */
    colorIsTextColor: false,
    /**
     * All user-specified sizes will be caped to `maxSize` ems
     *
     * If set to Infinity, users can make elements and space
     * arbitrarily large
     *
     * @default Infinity
     */
    maxSize: Infinity,
    /**
     * Limit the number of macro expansions to specified number
     *
     * If set to `Infinity`, marco expander will try to fully expand
     * as in LaTex
     *
     * @default 1000
     */
    maxExpand: 1000,
    /**
     * If `false` or `"ignore"`, allow features that make
     * writing in LaTex convenient but not supported by LaTex
     *
     * If `true` or `"error"`, throw an error for such transgressions
     *
     * If `"warn"`, warn about behavior via `console.warn`
     *
     * @default "warn"
     */
    strict: "warn",
    /**
     * If `false` (do not trust input), prevent any commands that could enable adverse behavior, rendering them instead in errorColor.
     *
     * If `true` (trust input), allow all such commands.
     *
     * @default false
     */
    trust: false,
    /**
     * Place KaTeX code in the global group.
     *
     * @default false
     */
    globalGroup: false,
}

export default optionKatex

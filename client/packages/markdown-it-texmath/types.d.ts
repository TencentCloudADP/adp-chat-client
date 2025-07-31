import type MarkdownIt from 'markdown-it';
import Katex from "katex"

export interface MarkdownTexmathOptions {
    readonly delimiters: [],
    /**
     * Support for custom katex instance for extension such as mhchem 
     */
    katex?: typeof Katex
}

export default function (md: MarkdownIt, options?: MarkdownTexmathOptions): MarkdownIt;

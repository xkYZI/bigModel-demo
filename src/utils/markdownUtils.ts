import MarkdownIt from "markdown-it";
// 解码包含Unicode转义序列的字符串
export function decodeUnicode(str: any) {
    return str.replace(/\\u[\dA-Fa-f]{4}/g, function (match: any) {
        return String.fromCharCode(parseInt(match.substr(2), 16));
    });
}
// script标签中
// 引入代码高亮
import hljs from "highlight.js";
//  这个是高亮的样式，有很多，我选了这个
import "highlight.js/styles/ir-black.css";


export const md = new MarkdownIt({
    highlight: function (str: string, lang: string): string {
        const language = hljs.getLanguage(lang);
        if (language) {
            try {
                return `<div class="hljs" style="position:relative;background-color:rgba(40, 44, 52,.85);
                        border-radius: .375rem;"><small style="background:rgba(0,0,0,.3);
                        position:absolute;top:0;right:0;border-bottom-left-radius: .375rem;
                        padding-left: .5rem;padding-right: .5rem;padding-top: .25rem;padding-bottom: .25rem;
                        font-size: .75rem;text-transform: uppercase;
                        line-height: 1rem;">${lang}</small><div style="padding:0.6rem"><code class="language-html">${hljs.highlight(lang, str, true).value
                    }</code></div></div>`;
            } catch (error) {
                console.error(error);
            }
        }
        // 如果未指定语言或无法识别语言，则使用默认的逃逸 HTML 处理
        return `<div class="hljs" style="position:relative;background-color:rgba(40, 44, 52,.85);
                        border-radius: .375rem;"><small style="background:rgba(0,0,0,.3);
                        position:absolute;top:0;right:0;border-bottom-left-radius: .375rem;
                        padding-left: .5rem;padding-right: .5rem;padding-top: .25rem;padding-bottom: .25rem;
                        font-size: .75rem;text-transform: uppercase;
                        line-height: 1rem;">${lang}</small><div style="padding:0.6rem"><code class="language-html">${md.utils.escapeHtml(str)}</code></div></div>`;
        // return `<div class="hl-code"><div class="hljs"><code>${md.utils.escapeHtml(
        //     str
        // )}</code></div></div>`;
    },
});
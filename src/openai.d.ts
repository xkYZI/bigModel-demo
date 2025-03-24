import { Delta } from 'openai';  // 引入 Delta 类型
export declare module 'openai' {
    interface Delta {
        reasoning_content?: string;  // 添加 reasoning_content 属性，假设它是 string 类型
    }
}

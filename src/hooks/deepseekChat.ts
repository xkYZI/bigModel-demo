import { AIType, HistoryType } from '@/types';
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';
import { ref } from 'vue';
import { emitter } from '../utils/emitter';
import { decodeUnicode } from "@/utils/markdownUtils"
import { DSKey } from "@/config/authKey"

const historyList = ref([] as HistoryType[]);

const messageList = ref([] as ChatCompletionMessageParam[]);

const resoning_content = ref("");
const content = ref("");

const inputValue = ref("");

const AI = ref({} as AIType);
const isLoading = ref(false);
// const ModelVersion = ref("deepseek-reasoner");
const ModelVersion = ref("deepseek-chat");

const constant = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: DSKey,
    dangerouslyAllowBrowser: true
});

//初始化
const init = () => {
    historyList.value = [];
    messageList.value = [];
    messageList.value.push({
        role: "system",
        content: AI.value.roleDefinitionStatement,
    });
}

//根据请求地址和Key发送请求
//流式返回响应
const doSend = async (message: ChatCompletionMessageParam) => {
    messageList.value.push(message);
    historyList.value.push({
        role: "user",
        content: message.content,
        resoning_content: resoning_content.value,
        time: new Date().toLocaleString()
    })
    isLoading.value = true;
    return await constant.chat.completions.create({
        messages: messageList.value,
        model: ModelVersion.value,
        // model: "deepseek-chat",
        stream: true,
    });
}
//重新刷新发送
const doReSend = async () => {
    if (messageList.value[messageList.value.length - 1].role == "user")
        return;
    messageList.value.pop();
    historyList.value.pop();
    isLoading.value = true;
    emitter.emit("ing");
    emitter.emit("scrollToBottom");
    await constant.chat.completions.create({
        messages: messageList.value,
        model: ModelVersion.value,
        stream: true,
    }).then(async (response: any) => {
        resoning_content.value = "";
        content.value = "";
        for await (const chunk of response) {
            emitter.emit("scrollToBottom");
            if (chunk.choices[0].delta.reasoning_content) {
                resoning_content.value += decodeUnicode(chunk.choices[0].delta.reasoning_content);
                emitter.emit("scrollToBottom")
            }
            else if (chunk.choices[0].delta.content) {
                content.value += decodeUnicode(chunk.choices[0].delta.content);
                emitter.emit("scrollToBottom")
            }
        }
        afterDo();
    });
}
const afterDo = () => {
    if (content.value == "") {
        content.value = "当前API接口提供方服务器繁忙，请稍后再试。"
    }
    messageList.value.push({
        role: "assistant",
        content: content.value,
    });
    historyList.value.push({
        role: "assistant",
        content: content.value,
        resoning_content: resoning_content.value,
        time: new Date().toLocaleString()
    });
    content.value = "";
    resoning_content.value = "";
    isLoading.value = false;
    emitter.emit("ing");
}

//处理页面发送操作
const send = () => {
    let msg = {
        role: "user",
        content: inputValue.value,
    } as ChatCompletionMessageParam;
    emitter.emit("ing");
    emitter.emit("scrollToBottom");
    inputValue.value = "";
    doSend(msg).then(async (response: any) => {
        resoning_content.value = "";
        content.value = "";
        console.log(response);
        for await (const chunk of response) {
            emitter.emit("scrollToBottom");
            if (chunk.choices[0].delta.reasoning_content) {
                resoning_content.value += decodeUnicode(chunk.choices[0].delta.reasoning_content);
                emitter.emit("scrollToBottom")
            }
            else if (chunk.choices[0].delta.content) {
                content.value += decodeUnicode(chunk.choices[0].delta.content);
                emitter.emit("scrollToBottom")
            }
        }
        afterDo();
    })
}

function resetHistory() {
    historyList.value = [];
    messageList.value = [];
    ElMessage.success("历史记录已清空");
}


export {
    messageList,
    historyList,
    AI,
    send,
    init,
    inputValue,
    content,
    resoning_content,
    resetHistory,
    isLoading,
    ModelVersion,
    doReSend
}

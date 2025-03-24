<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted, reactive } from "vue";
import { Constants } from "@/config/Constant";
import { debounce } from "lodash";
import {
  historyList,
  AI,
  init,
  send,
  inputValue,
  content,
  isLoading,
  resetHistory,
  resoning_content,
  ModelVersion,
  doReSend,
} from "@/hooks/deepseekChat";
import { md } from "@/utils/markdownUtils";
import type { AIType, UserType } from "@/types";
import { emitter } from "@/utils/emitter";
const chatContent = ref();

const user = ref({} as UserType);

onMounted(() => {
  resetHistory();
  emitter.on("selectAI", (res) => {
    AI.value = res as AIType;
    init();
    ElMessage.warning("AI已切换为" + AI.value.roleNickName);
  });
  user.value = Constants().User;
  scrollBottom();
  emitter.on("scrollToBottom", () => {
    scrollBottom();
    // console.log("scrollToBottom!!!!!");
  });
});
onUnmounted(() => {
  resetHistory();
  emitter.off("selectAI");
  emitter.off("adminUse");
});
const scrollBottom = debounce(() => {
  nextTick(() => {
    chatContent.value.scrollTop = chatContent.value.scrollHeight;
  });
}, 200); // 设置一个合适的间隔时间，比如200ms
function modelVersionChange() {
  ElMessage.success("模型版本已切换为" + ModelVersion.value);
}
function formatDate(date: Date) {
  const hours = date.getHours();
  const isPm = hours >= 12;
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const ampm = isPm ? "PM" : "AM";

  return `${formattedHours}:${minutes} ${ampm}`;
}
const font = reactive({
  color: "rgba(0, 0, 0, .15)",
});
</script>
<template>
  <div class="content">
    <div ref="chatContent" class="chat-window">
      <el-watermark
        style="height: 100%; width: 100%"
        :font="font"
        :content="ModelVersion"
      >
        <div class="chat-content">
          <div v-for="(item, index) in historyList" :key="index">
            <div class="chat-ai" v-if="item.role === 'assistant'">
              <div
                class="chat_reason"
                v-if="index === historyList.length - 1"
                v-html="md.render(item.resoning_content)"
              ></div>
              <div class="chat-text" v-html="md.render(item.content)"></div>
              <div class="info-time">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-robot"></use>
                </svg>
                <span>{{ AI.roleNickName }}</span>
                <span>{{ item.time }}</span>
                <span @click="doReSend" class="flush">刷新</span>
              </div>
            </div>
            <div class="chat-user" v-if="item.role === 'user'">
              <div class="chat-text">
                {{ item.content }}
              </div>
              <div class="info-time">
                <el-avatar
                  icon="el-icon-user-solid"
                  shape="circle"
                  size="small"
                  :src="user.avatarURL"
                  fit="fill"
                ></el-avatar>
                <span>{{ user.nickname }}</span>
                <span>{{ item.time }}</span>
              </div>
            </div>
          </div>

          <div class="chat-ai" v-if="isLoading">
            <div class="chat_reason" v-html="md.render(resoning_content)"></div>
            <div class="chat-text" v-html="md.render(content)"></div>
            <div class="info-time">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-robot"></use>
              </svg>
              <span>{{ AI.roleNickName }}</span>
              <span>{{ formatDate(new Date()) }}</span>
              <span v-loading="isLoading"></span>
            </div>
          </div>
        </div>
      </el-watermark>
    </div>
    <div class="chat-bottom">
      <el-button
        :disabled="isLoading"
        class="clear-button"
        @click="resetHistory"
      >
        <span>清空</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-ai-clear"></use>
        </svg>
      </el-button>
      <el-input
        class="chat-input"
        v-model="inputValue"
        placeholder="请输入内容"
        @keyup.enter="send"
      >
        <template #prepend>
          <el-select
            v-model="ModelVersion"
            placeholder="Select"
            style="width: 135px"
            @change="modelVersionChange"
          >
            <el-option label="DeepSeek-R1" value="deepseek-reasoner" />
            <el-option label="DeepSeek v3" value="deepseek-chat" />
          </el-select>
        </template>
      </el-input>
      <el-button
        :disabled="isLoading"
        class="chat-button"
        type="primary"
        size="default"
        @click="send"
        >发送</el-button
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.flush {
  cursor: pointer;
  &:hover {
    color: #409eff;
    transition: all 0.3s;
  }
}
:deep(.el-select__wrapper) {
  min-height: 40px;
}
:deep(.circular) {
  // display: inline;
  margin-top: 5px;
  height: 30px;
  width: 30px;
  line-height: 30px;
  -webkit-animation: loading-rotate 2s linear infinite;
  animation: loading-rotate 2s linear infinite;
}
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .chat-window {
    // width: 100%;
    height: 90%;
    overflow-y: scroll;
    padding: 20px;
    // background-color: red;
    &::-webkit-scrollbar {
      width: 0; /* Safari,Chrome 隐藏滚动条 */
      height: 0; /* Safari,Chrome 隐藏滚动条 */
      display: none; /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
    }
    .chat-content {
      position: relative;
      word-break: break-all;

      .chat-ai {
        width: 100%;
        float: left;
        // margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        .chat-text {
          max-width: 75%;
          padding: 0px 15px;
          border-radius: 7px 7px 7px 1px;
          background-color: rgb(88, 132, 252);
          color: #fff;
          &:hover {
            background-color: rgb(47, 102, 253);
            transition: all 0.5s;
          }
        }
        .chat_reason {
          margin: 5px 0;
          padding: 5px 10px;
          color: #666;
          font-size: 12px;
          line-height: 20px;
          max-width: 75%;
          display: block;
          min-height: 10px;
          border-left: #4251fd 2px solid;
          background-color: rgba($color: #6666, $alpha: 0.1);
        }
        .info-time {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
          //   line-height: 20px;
          display: flex;
          align-items: center;
          //   background-color: red;
          line-height: 30px;
          .icon {
            font-size: 24px;
            margin-right: 10px;
          }
          span {
            margin-right: 10px;
          }
          span:last-child {
            color: rgb(101, 104, 115);
            vertical-align: middle;
            // line-height: 20px;
          }
        }
      }
      .chat-user {
        width: 100%;
        float: right;
        // margin-bottom: 10px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        .chat-text {
          float: right;
          max-width: 75%;
          height: auto;
          padding: 10px 15px;
          border-radius: 7px 7px 1px 7px;
          background-color: rgb(29, 144, 245);
          color: #fff;

          &:hover {
            background-color: rgb(26, 129, 219);
          }
        }
        .info-time {
          margin: 5px 0;
          color: #666;
          //   line-height: 30px;
          font-size: 14px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          //   background-color: red;
          span {
            line-height: 30px;
            margin-right: 10px;
          }
          span:first-child {
            color: rgb(101, 104, 115);
            // margin-right: 10px;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .chat-bottom {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    .clear-button {
      height: 40px;
      width: 90px;
      background-color: rgba($color: #ffffff, $alpha: 1);
      margin-right: 10px;
      display: flex;
      justify-content: space-around;
      span {
        // font-size: 14px;
        font-weight: bold;
      }
      .icon {
        margin-left: 10px;
        font-size: 25px;
      }
    }
    .chat-input {
      min-height: 40px;
      max-height: 40px;
      //   width: 85%;
      max-width: 75%;
      //   border-radius: 100px !important;
      background-color: transparent !important;
    }
    .chat-button {
      height: 40px;
      padding: 10px 30px;
      margin-left: 10px;
      font-size: 16px;
      background-color: #4251fd;
      transition: all 0.5s;
      border: none;
      &:hover {
        background-color: #071dff;
      }
      &:active {
        background-color: #0011c9;
      }
    }
  }
}
</style>

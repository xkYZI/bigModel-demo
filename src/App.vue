<script setup lang="ts">
import { onMounted, ref } from "vue";
import { AIType } from "./types";

import HeartTalkAside from "@/components/HeartTalkAside.vue";
import HeTMainBySpark from "@/components/HeTMainBySpark.vue";
import HeTMainByDeepSeek from "@/components/HeTMainByDeepSeek.vue";
import { emitter } from "./utils/emitter";
const AI = ref({} as AIType);
const ai_model = ref();
const DEEPSEEK_MODEL = true;
const SPARK_MODEL = false;
onMounted(() => {
  emitter.on("showAI", (res) => {
    AI.value = res as AIType;
    console.log(AI.value);
  });
});
const modelChange = () => {
  ElMessageBox.confirm("切换模型后，历史记录将被清空，确定切换吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ai_model.value = !ai_model.value;
      return true;
    })
    .catch(() => {
      return false;
    });
  return false;
};
</script>

<template>
  <div class="body">
    <div class="heartTalk">
      <div class="heartTalk_aside">
        <div class="heartTalk_title">
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-deepseek"></use>
            </svg>
            BigModel
          </span>
        </div>
        <div class="heartTalk_aside_card">
          <HeartTalkAside />
        </div>
      </div>
      <div class="heartTalk_main">
        <div class="heartTalk_main_title">
          <span class="title">
            <div class="icon_name">
              <svg class="icon" aria-hidden="true">
                <use
                  xlink:href="#icon-a-AIduihuachangjingweidianjizhuangtai1x"
                ></use>
              </svg>
              {{ AI.roleNickName }}
            </div>
            <el-switch
              class="switch"
              v-model="ai_model"
              :before-change="modelChange"
              :active-value="DEEPSEEK_MODEL"
              :inactive-value="SPARK_MODEL"
              active-text="DeepSeek模型"
              inactive-text="讯飞星火认知大模型"
            />
          </span>
          <span class="declare">—— {{ AI.roleInfos }}</span>
        </div>
        <div class="heartTalk_main_card">
          <component :is="ai_model ? HeTMainByDeepSeek : HeTMainBySpark" />
          <!-- <HeTMainByDeepSeek v-if="ai_model" />
          <HeTMainBySpark v-else /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.switch {
  // margin-left: 510px;
  margin-right: 10px;
  padding: 0 15px;
  background-color: rgba($color: #ffffff, $alpha: 0.5);
  box-shadow: var(--el-box-shadow-light);
  border-radius: 5px;
  &:hover {
    background-color: rgba($color: #ffffff, $alpha: 0.8);
    transition: all 0.5s;
  }
}
.body {
  width: 1200px;
  height: 95vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
}
.heartTalk {
  //   background-color: red;
  box-shadow: var(--el-box-shadow-light);
  background: url("@/assets/img/talkAI_bg.png") no-repeat,
    url("@/assets/img/talkAI_bg_left_bottom.png") no-repeat;
  background-size: 45% auto, 35% auto;
  background-position: 100% 0, 0 100%;
  background-color: #fff;
  width: 100%;
  height: 700px;
  border-radius: 20px;
  padding: 15px;
  display: flex;

  .heartTalk_aside {
    display: flex;
    width: 25%;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;

    .heartTalk_title {
      // background-color: red;
      height: 70px;
      display: flex;
      // justify-content: center;
      margin-left: 15px;
      align-items: center;

      span {
        // margin: 20px;
        line-height: 40px;
        font-size: 26px;
        font-weight: 600;
        color: #303030;
      }

      .icon {
        font-size: 35px;
        line-height: 40px;
      }
    }

    .heartTalk_aside_card {
      height: 100%;
      margin-top: 20px;
      background-color: rgba($color: #ecf5ff, $alpha: 0.5);
      border-radius: 10px;
    }
  }

  .heartTalk_main {
    margin-left: 20px;
    width: 100%;
    // background-color: blue;
    display: flex;
    flex-direction: column;

    .heartTalk_main_title {
      height: 70px;
      // margin-top: 10px;
      margin-left: 10px;
      // background-color: aqua;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      .title {
        font-size: 20px;
        line-height: 35px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon_name {
          display: flex;
          align-items: center;
          justify-content: left;
        }

        svg {
          font-size: 26px;
          line-height: 35px;
          margin-right: 3px;
        }
      }

      .declare {
        font-size: 14px;
        margin-left: 80px;
      }
    }

    .heartTalk_main_card {
      margin-top: 10px;
      height: 100%;
      // background: url("@/assets/img/other/talkAI_bg_bottom.png") no-repeat;
      // background-size: 100% auto;
      // background-position-y: 100%;
      // background: radial-gradient(#deefff 5%, #93cafd 30%, #6f9dff 20%);
      background-color: rgba($color: #e5f0fc, $alpha: 0.6);
      border-radius: 10px;
      overflow: hidden;
    }
  }
}
</style>

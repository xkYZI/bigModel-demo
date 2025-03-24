**本项目主要采用 Vue3 + TypeScript + Vite 构建**
**项目主要依赖：Element-Plus + mitt + Scss + base-64 + crypto-js**

**介绍**：本项目主要是实现了一个基于**讯飞星火认知大模型**和 **DeepSeek** 的普通聊天功能，主要功能如下：

- **左侧角色列表**：可以选择不同的角色身份，来进行对话
- **右上角模型切换**：一个切换选项，可以选择当前对话的模型是讯飞星火还是 DeepSeek
- **右侧聊天窗口**：聊天窗口，用于展示当前对话的内容

**本项目文件夹结构主要内容如下**：

- **src**
  - **assets**
    - **img**：页面所用到的图片素材
    - **components**：项目所用到的两个子组件，分别对应页面的左侧菜单和右侧聊天窗口
    - **types**：定义了项目用到的类型
    - **config**：定义了 AI 所用到的配置信息
      - **Constant.ts**: AI 角色定义词文件
      - **authKey.ts**: 用来填写讯飞星火大模型、DeepSeek 的开发者密钥
    - **hooks**：封装了项目中用到的部分函数方法
      - **deepseekChat.ts**: DeepSeek 实现聊天对话的具体方法
      - **getAuthorization.ts**: 讯飞星火大模型鉴权函数
    - **utils**：封装了项目用到的鉴权函数、静态资源和 emitter 消息订阅函数
      - **markdownUtils.ts**：封装了 markdown 转换函数，用于将 AI 生成的文本转换为 markdown 格式
      - **emitter.ts**：封装了消息订阅函数，用于在页面中实现消息的订阅与发布
  - **main.ts**：项目入口文件， 负责初始化项目，其中包括对 Element-Plus 的初始化、阿里巴巴图标库资源地址的引入（仅供参考使用，在本 demo 中使用到了阿里巴巴图标库的 3 个 svg 图标）等
  - **style.css**：全局样式文件，为本项目中阿里巴巴图标库图标的基本样式定义

本项目内容是在原有项目[**[CSDN]**[Vue3+TS]讯飞星火认知大模型搭建 demo](https://blog.csdn.net/weixin_52577523/article/details/142051874?spm=1001.2014.3001.5501)的基础上进行的新增

详情可以查看[**[GitHub]**SparkDemo](https://github.com/xkYZI/SparkDemo)


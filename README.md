**本项目主要采用 Vue3 + TypeScript + Vite 构建**
**项目主要依赖：Element-Plus + mitt + Scss + base-64 + crypto-js**

**介绍**：本项目仅供学习如何使用讯飞星火认知大模型，进行简单的 Web 端页面搭建及基本使用，该 demo 项目具备基本的聊天对话功能，可通过左侧选择不同的助手在右侧窗口进行对话，可供实际开发参考使用。本身这部分内容是在我个人的毕业设计中进行了使用，鉴于有部分朋友向我索要 AI 部分的代码，故在此分享。

**本项目文件夹结构主要内容如下**：

- **src**
  - **assets**
    - **img**：页面所用到的图片素材
    - **components**：项目所用到的两个子组件，分别对应页面的左侧菜单和右侧聊天窗口
    - **types**：定义了项目用到的类型
    - **utils**：封装了项目用到的鉴权函数、静态资源和 emitter 消息订阅函数
      - **getAuthorization.ts**：封装了鉴权函数，用于实时获取鉴权路径
      - **Constant.ts**: 项目中用到的常量定义文件
      - **emitter.ts**：封装了消息订阅函数，用于在页面中实现消息的订阅与发布
  - **main.ts**：项目入口文件， 负责初始化项目，其中包括对 Element-Plus 的初始化、阿里巴巴图标库资源地址的引入（仅供参考使用，在本 demo 中使用到了阿里巴巴图标库的 3 个 svg 图标）等
  - **style.css**：全局样式文件，为本项目中阿里巴巴图标库图标的基本样式定义

部分内容参考了 **B 站：[red 润](https://space.bilibili.com/395361365)**大佬的视频：[讯飞星火认知大模型接入网页 demo 演示(项目接入大模型功能)](https://www.bilibili.com/video/BV12V411L7x2/?spm_id_from=333.999.0.0)
最后再次感谢 red 润大佬的无私分享！

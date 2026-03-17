# sls-look

一个轻量级的浏览器端 CSV 解析工具，用于解析 CSV 文件并展示 `data` 、 `logIndex` 、 `time` 三列数据。所有解析均在客户端完成，不会上传任何数据。

**在线地址：** [csv.ilabubu.com](https://csv.ilabubu.com)

## 功能特性

- 上传并解析 CSV 文件，提取 `data`、`logIndex`、`time` 列
- 表格化展示解析结果，支持按 `logIndex` 排序
- 点击查看 JSON 数据详情，支持嵌套 JSON 深度解析
- 一键复制 JSON 内容
- 自动检测包含"出错"的条目，通过错误面板快速定位
- 支持行高亮、行删除操作
- 可选隐藏包含 User-Agent 的请求数据

## 技术栈

- [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- 零依赖 CSV 解析器（自实现，支持双引号字段与 `""` 转义）

## 快速开始

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 构建生产版本
yarn build

# 预览构建产物
yarn preview
```

## 项目结构

```
src/
├── main.js              # 应用入口
├── App.vue              # 根组件，主要 UI 逻辑
├── style.css            # 全局样式
├── components/
│   ├── JsonModal.vue    # JSON 查看弹窗
│   ├── OpIcon.vue       # 操作图标组件
│   ├── ErrorPanel.vue   # 错误条目面板
│   └── SettingsModal.vue # 设置弹窗
└── utils/
    └── csv.js           # CSV 解析器
```

## License

[MIT](LICENSE)

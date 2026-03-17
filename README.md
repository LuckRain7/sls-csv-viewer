# sls-look

一个基于 **Vue3 + Vite** 的小页面：上传 CSV 后，仅解析并展示 `data / logIndex / time` 三列。

## 运行

```bash
npm i
npm run dev
```

## 说明

- 解析逻辑在浏览器端完成（不上传到服务端）
- CSV 解析为零依赖实现，支持双引号字段与 `""` 转义


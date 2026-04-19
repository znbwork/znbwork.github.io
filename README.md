znbwork.github.io
=====

[Prod Link](https://znbwork.github.io/)

# 多语言简历网站项目

## 项目概述

构建和维护一个多语言简历网站，支持中文、日文、英文三种语言。

## 支持的功能

- 多语言简历页面 (index.html) - 支持 zh/ja/en 三种语言切换
- 管理后台 (editor.html) - 可视化编辑翻译内容
- Node.js 服务器 (server.js) - 提供 REST API

## 文件结构

```
/Users/znb/workspace/Front-end/html/znbwork.github.io/
├── index.html         # 简历主页面
├── editor.html       # 内容编辑器管理页面
├── app.js           # 前端JavaScript，处理语言切换
├── i18n.json        # 多语言翻译数据
├── server.js        # Node.js服务器
├── package.json    # npm配置
├── README.md      # 项目说明
├── Resume-CN.md   # 中文简历参考
├── Resume-EN.md  # 英文简历参考
└── Resume-JP.md  # 日文简历参考
```

## 技术细节

### 语言切换机制

- 使用 `data-t` 属性标记需要翻译的元素
- `app.js` 中的 `setLang()` 函数动态替换文本内容
- 默认语言: 英文 (en)
- 支持 URL 参数 `?lang=zh|ja|en` 和 localStorage 保存偏好

### 翻译数据格式

```json
{
  "zh": {
    "key": "中文内容",
    ...
  },
  "ja": {
    "key": "日文内容",
    ...
  },
  "en": {
    "key": "英文内容",
    ...
  }
}
```

## 待改进

1. 可添加简历生成工具直接从 Markdown 文件生成 HTML

## 使用说明

1. 启动服务器: `node server.js 3001`
2. 访问简历: [Index](http://localhost:3001/index.html)
3. 访问编辑器: [Editor](http://localhost:3001/editor.html)
4. 语言切换: 点击页面顶部的中/日/英按钮


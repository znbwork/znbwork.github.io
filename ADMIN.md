# 简历管理页面使用说明

## 概述

管理页面用于编辑 `i18n.json` 中的多语言数据，支持中文、日文、英文三种语言。

## 启动服务

```bash
# 进入项目目录
cd /Users/znb/workspace/Front-end/html/znbwork.github.io

# 启动服务
node server.js 3001
```

服务启动后访问 http://localhost:3001/admin.html

## 页面结构

### 顶部导航栏

- 左侧：页面标题"简历数据管理"
- 右侧：语言切换按钮（中文 / 日本語 / English）

### 编辑区域

- 大型文本编辑器，显示 JSON 格式数据
- 支持语法高亮（需配合编辑器）

### 功能按钮

| 按钮 | 功能 |
|------|------|
| 格式化 | 格式化 JSON（缩进对齐） |
| 验证 | 检查 JSON 格式是否正确 |
| 保存到文件 | 提交更改到服务器并写入 i18n.json |
| 预览 | 在新标签页打开 index.html |

## 使用流程

### 1. 编辑数据

1. 点击顶部语言按钮选择要修改的语言
2. 在编辑器中修改对应内容
3. 使用"格式化"按钮整理格式

### 2. 保存更改

1. 点击"保存到文件"按钮
2. 等待提示"保存成功"
3. 可使用"预览"按钮查看效果

### 3. 多语言同步

保存时只会保存当前选定语言的数据。如果需要修改多种语言，请分别切换语言后保存。

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/data | 获取全部 i18n.json 数据 |
| POST | /api/data | 保存数据（需 JSON body） |

## 数据结构说明

### 顶层结构

```json
{
  "zh": { ... },
  "ja": { ... },
  "en": { ... }
}
```

### 各语言对象包含字段

| 字段 | 说明 |
|--------|------|
| name | 姓名 |
| title | 职位标题 |
| summary | 个人简介 |
| summary_title/summary_text | 经历概要 |
| strengths_title | 强项标题 |
| s1_title ~ s4_title | 各强项标题 |
| s1_desc ~ s4_desc | 各强项描述 |
| edu_title | 学历标题 |
| period | 时间 |
| school_label/school | 学校 |
| company_title/company_name | 公司 |
| c1 ~ c5 | 各公司名称 |
| c1_period ~ c5_period | 各公司任职时间 |
| proj_title | 项目标题 |
| p1_title ~ p10_title | 各项目名称 |
| p1_role ~ p10_role | 各项目角色 |
| p1_overview ~ p10_overview | 各项目概述 |
| p1_duties_title | 职责标题 |
| p1_d1 ~ p10_d1 | 各职责描述 |
| p1_period ~ p10_period | 各项目时间 |
| skill_title | 技能标题 |
| skill_lang/skill_os/skill_db/skill_fw/skill_cloud/skill_tools | 技能分类 |
| pr_title | PR标题 |
| pr1 ~ pr4 | 各PR内容 |
| email | 邮件标签 |
| tech_env | 技术环境标签 |

## 注意事项

1. 确保 server.js 正在运行才能保存数据
2. 保存前建议先点击"验证"检查格式
3. 修改后记得刷新预览页面查看效果

## 停止服务

```bash
# 查看进程
lsof -i :3000

# 结束进程
kill <PID>
```
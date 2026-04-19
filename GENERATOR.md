# Markdown → HTML 简历生成器

从 Markdown 文件生成多语言简历网页。

## 使用方法

```bash
node generate.js
```

## 输入文件

`Resume-Demo.md` - 主数据源

### 支持的 Markdown 结构

```markdown
# 職務経歴書

## 職務経歴概要（Technical Summary）

EC・流通・保険・金融といった **高トラフィックかつ業務複雑度の高い業界** において、
**18年以上** にわたり業務系システム開発に従事。

...

## 強み・専門性（Key Strengths）

* Javaを中心とした業務システム開発（17年以上）
* 要件定義～設計～開発～テスト～運用までの全工程経験
...

## 最終学籍

| 期間                  | 学校名                        |
|---------------------|----------------------------|
| 2006年04月 ～ 2008年03月 | 日本大学 生産工学研究科 電気電子工学専攻 |

## 会社履歴

| 期間                  | 会社名                        |
|---------------------|----------------------------|
| 2024年06月 ～ 現在       | GienTech Japan株式会社         |
| 2017年08月 ～ 2024年04月 | 株式会社 technoPro            |

## 職務経歴詳細

### ◆ プロジェクト名

**期間**：2024年06月 ～ 2025年06月
**職位**：リーダー（3名）

**プロジェクト概要**
プロジェクトの説明文。

**担当内容**

* 职责1
* 职责2

**技術環境**

* OS：Windows
* DB：Oracle
* Language：Java

---

### ◆ 次のプロジェクト

...

## 技術スキル一覧 (Technical Skills List)

### プログラミング言語

Java, Python, JavaScript

### データベース

Oracle, MySQL

## 自己PR

* PR内容1
* PR内容2
```

## 输出文件

| 文件 | 说明 |
|------|------|
| `i18n-generated.json` | 多语言翻译数据 (172个键) |
| `index-generated.html` | 生成的简历页面 (318行) |

## 生成的数据结构

### i18n.json 键值

```
zh/ja/en:
├── title              # 职位标题
├── summary           # 概要
├── summary_title    # 概要标题
├── strengths_title  # 强项标题
├── s1_title ~ s7_title  # 强项列表
├── edu_title        # 教育标题
├── period_edu       # 教育时间
├── school           # 学校
├── company_title    # 公司标题
├── c1 ~ c5          # 公司名称
├── c1_period ~ c5_period  # 公司时间
├── proj_title       # 项目标题
├── p1_title ~ p10_title  # 项目名称
├── p1_period ~ p10_period  # 项目时间
├── p1_role ~ p10_role  # 项目角色
├── p1_overview ~ p10_overview  # 项目概要
├── p1_d1 ~ p10_d9   # 项目职责
├── p1_tech1 ~ p10_techN  # 技术环境
├── skill_lang       # 编程语言
├── skill_os        # 操作系统
├── skill_db        # 数据库
├── ...             # 其他技能分类
├── pr_title       # PR标题
├── pr1 ~ prN      # PR列表
```

### HTML 结构

```html
<h1 data-t="title">...</h1>
<p data-t="summary">...</p>

<h2 data-t="strengths_title">...</h2>
<ul>
  <li data-t="s1_title">...</li>
</ul>

<table id="education">...</table>
<table id="companies">...</table>

<div id="projects">
  <div class="project">
    <h3 data-t="p1_title">...</h3>
    <ul><li data-t="p1_d1">...</li></ul>
  </div>
</div>
```

## 工作流程

```
Resume-Demo.md → Parser → Data Object → Generator → index.html + i18n.json
```

## 解析规则

| Markdown | 生成键 |
|----------|--------|
| `# 标题` | `title` |
| `## Section` | `{section}_title` |
| `* 项目` | `sN_title` / `prN` |
| `\| col1 \| col2 \|` | `cN` + `cN_period` / `period_edu` + `school` |
| `### ◆ 项目名` | `pN_title` |
| `**期間**` | `pN_period` |
| `**職位**` | `pN_role` |
| `**プロジェクト概要**` + 内容 | `pN_overview` |
| `* 担当内容` | `pN_d1` ~ `pN_dN` |
| `* OS：xxx` | `pN_tech1` |

## 示例运行

```bash
$ node generate.js
=== Parsed Data ===
Title: 職務経歴書
Summary: EC・流通・保険・金融といった...
Strengths: 7
Education: { period: '2006年04月 ～ 2008年03月', school: '...' }
Companies: 5
Projects: 10
Skills: [12 categories]

=== Generated Files ===
i18n-generated.json
index-generated.html
```

## 注意事项

1. 当前仅支持单语言（日文）输入，其他语言翻译需手动添加
2. 技术环境判断：包含 `：` 的列表项被识别为技术栈
3. 项目按时间倒序排列（最新的在前）
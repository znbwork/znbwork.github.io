const fs = require('fs');
const path = require('path');

function parseMarkdown(mdContent) {
    const lines = mdContent.split('\n').map(l => l.trim());
    const data = {
        title: '',
        summary: '',
        strengths: [],
        education: { period: '', school: '', major: '' },
        companies: [],
        projects: [],
        skills: {},
        pr: []
    };

    let state = 'idle';
    let currentProject = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const nextLine = lines[i + 1] || '';

        if (!line || line === '---') continue;

        if (line.startsWith('# ')) {
            data.title = line.replace('# ', '');
            continue;
        }

        // Section detection
        if (line.startsWith('## ')) {
            const section = line.replace('## ', '');
            if (section.includes('概要') || section.includes('Summary')) state = 'summary';
            else if (section.includes('強み') || section.includes('Strength')) state = 'strengths';
            else if (section.includes('学籍') || section.includes('Education') || section.includes('最終')) state = 'education';
            else if (section.includes('会社') || section.includes('履歴') || section.includes('Work History')) state = 'company';
            else if (section.includes('経歴') || section.includes('Project')) state = 'projects';
            else if (section.includes('スキル') || section.includes('Skills')) state = 'skills';
            else if (section.includes('PR')) state = 'pr';
            else state = 'idle';
            continue;
        }

        // Project detection
        if (line.startsWith('### ◆ ')) {
            if (currentProject) data.projects.push(currentProject);
            currentProject = {
                title: line.replace('### ◆ ', ''),
                period: '', role: '', overview: '',
                duties: [],
                tech: []
            };
            state = 'projects';
            continue;
        }

        // Parse based on state
        if (state === 'summary' && line.startsWith('**')) {
            const clean = line.replace(/\*\*/g, '');
            if (!data.summary) data.summary_title = clean;
            else data.summary += clean + ' ';
        } else if (state === 'summary' && line && !line.startsWith('*') && !line.startsWith('#')) {
            data.summary += line + ' ';
        }

        else if (state === 'strengths' && line.startsWith('* ')) {
            data.strengths.push(line.replace('* ', '').replace(/\*\*/g, ''));
        }

        else if (state === 'education' && line.includes('|')) {
            const cells = line.split('|').filter(c => c.trim());
            // Skip header row (contains 期間) and separator (contains ---)
            if (cells.length >= 2 && !line.includes('---') && !line.includes('期間') && !line.includes('学校名')) {
                data.education.period = cells[0].trim();
                data.education.school = cells[1].trim();
            }
        }

        else if (state === 'company' && line.includes('|')) {
            const cells = line.split('|').filter(c => c.trim());
            // Skip header row and separator
            if (cells.length >= 2 && !line.includes('---') && !line.includes('期間') && !line.includes('会社名')) {
                data.companies.push({ period: cells[0].trim(), name: cells[1].trim() });
            }
        }

        else if (state === 'projects' && currentProject) {
            if (line.startsWith('**期間**')) {
                currentProject.period = line.replace('**期間**：', '').trim();
            } else if (line.startsWith('**職位**')) {
                currentProject.role = line.replace('**職位**：', '').trim();
            } else if (line.startsWith('**プロジェクト概要**') || line === 'プロジェクト概要') {
                currentProject.overview = nextLine;
            } else if (line.startsWith('**担当内容**') || line.startsWith('**担当工程**')) {
                // Next bullets are duties
            } else if (line.startsWith('**技術環境**') || line.startsWith('**担当工程**')) {
                // Switch to tech mode
            } else if (line.startsWith('* ') && !line.includes('**')) {
                const bullet = line.replace('* ', '');
                // Check if this is tech env (contains colon with category like OS:, DB:, etc.)
                if (bullet.includes('：') && (bullet.match(/^(OS|DB|Language|Tools|Server|Other)/) || bullet.match(/^[A-Z][a-z]+:/))) {
                    currentProject.tech.push(bullet);
                } else if (bullet.includes('：**')) {
                    currentProject.tech.push(bullet);
                } else {
                    currentProject.duties.push(bullet);
                }
            }
        }

        else if (state === 'skills' && line.startsWith('### ')) {
            const category = line.replace('### ', '').replace(/ \(.*\)/, '').trim();
            data.skills[category] = [];
        } else if (state === 'skills' && line && Object.keys(data.skills).length > 0) {
            const category = Object.keys(data.skills).pop();
            if (category && line.includes(',')) {
                data.skills[category] = line.split(',').map(s => s.trim()).filter(s => s);
            }
        }

        else if (state === 'pr' && line.startsWith('* ')) {
            data.pr.push(line.replace('* ', '').replace(/\*\*/g, ''));
        }
    }

    if (currentProject) data.projects.push(currentProject);

    // Clean up
    data.summary = data.summary.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
    data.projects.reverse();

    return data;
}

function generateI18n(data) {
    const base = {
        ui_title: { zh: "简历内容编辑", ja: "履歴書編集", en: "Resume Editor" },
        tab_basic: { zh: "基本信息", ja: "基本情報", en: "Basic Info" },
        tab_strengths: { zh: "强项", ja: "強み", en: "Strengths" },
        tab_education: { zh: "学历", ja: "学籍", en: "Education" },
        tab_company: { zh: "公司经历", ja: "会社履歴", en: "Company" },
        tab_projects: { zh: "项目经验", ja: "職務経歴詳細", en: "Projects" },
        tab_skills: { zh: "技术技能", ja: "技術スキル", en: "Skills" },
        tab_pr: { zh: "自我PR", ja: "自己PR", en: "Self PR" },
        btn_save: { zh: "保存更改", ja: "保存", en: "Save Changes" },
        btn_preview: { zh: "预览", ja: "プレビュー", en: "Preview" },
        title: { zh: "高级软件工程师", ja: data.title, en: "Senior Software Engineer" },
        summary_title: { zh: "职务经历概要", ja: "職務経歴概要", en: "Career Summary" },
        summary: { zh: data.summary, ja: data.summary, en: data.summary },
        strengths_title: { zh: "强项与专长", ja: "強み・専門性", en: "Key Strengths" },
        edu_title: { zh: "最终学历", ja: "最終学籍", en: "Education" },
        period_label: { zh: "时间", ja: "期間", en: "Period" },
        school_label: { zh: "学校", ja: "学校", en: "School" },
        company_title: { zh: "工作经历", ja: "会社履歴", en: "Work History" },
        company_label: { zh: "公司", ja: "会社名", en: "Company" },
        proj_title: { zh: "项目经验", ja: "職務経歴詳細", en: "Project Experience" },
        skill_title: { zh: "技术技能", ja: "技術スキル", en: "Technical Skills" },
        pr_title: { zh: "自我PR", ja: "自己PR", en: "Self PR" },
        tech_env: { zh: "技术环境：", ja: "技術環境：", en: "Tech: " },
    };

    const i18n = { zh: {}, ja: {}, en: {} };

    for (const [key, vals] of Object.entries(base)) {
        i18n.zh[key] = vals.zh;
        i18n.ja[key] = vals.ja;
        i18n.en[key] = vals.en;
    }

    // Add education
    i18n.zh.period_edu = data.education.period;
    i18n.ja.period_edu = data.education.period;
    i18n.en.period_edu = data.education.period;
    i18n.zh.school = data.education.school;
    i18n.ja.school = data.education.school;
    i18n.en.school = data.education.school;

    // Add strengths
    data.strengths.forEach((s, i) => {
        i18n.zh[`s${i+1}_title`] = s;
        i18n.ja[`s${i+1}_title`] = s;
        i18n.en[`s${i+1}_title`] = s;
    });

    // Add companies
    data.companies.forEach((c, i) => {
        i18n.zh[`c${i+1}_period`] = c.period;
        i18n.ja[`c${i+1}_period`] = c.period;
        i18n.en[`c${i+1}_period`] = c.period;
        i18n.zh[`c${i+1}`] = c.name;
        i18n.ja[`c${i+1}`] = c.name;
        i18n.en[`c${i+1}`] = c.name;
    });

    // Add projects
    data.projects.forEach((p, i) => {
        const idx = data.projects.length - 1 - i;
        i18n.zh[`p${idx+1}_title`] = p.title;
        i18n.ja[`p${idx+1}_title`] = p.title;
        i18n.en[`p${idx+1}_title`] = p.title;
        
        i18n.zh[`p${idx+1}_period`] = p.period;
        i18n.ja[`p${idx+1}_period`] = p.period;
        i18n.en[`p${idx+1}_period`] = p.period;

        i18n.zh[`p${idx+1}_role`] = p.role;
        i18n.ja[`p${idx+1}_role`] = p.role;
        i18n.en[`p${idx+1}_role`] = p.role;

        i18n.zh[`p${idx+1}_overview`] = p.overview;
        i18n.ja[`p${idx+1}_overview`] = p.overview;
        i18n.en[`p${idx+1}_overview`] = p.overview;

        p.duties.forEach((d, j) => {
            i18n.zh[`p${idx+1}_d${j+1}`] = d;
            i18n.ja[`p${idx+1}_d${j+1}`] = d;
            i18n.en[`p${idx+1}_d${j+1}`] = d;
        });
        
        p.tech.forEach((t, j) => {
            i18n.zh[`p${idx+1}_tech${j+1}`] = t;
            i18n.ja[`p${idx+1}_tech${j+1}`] = t;
            i18n.en[`p${idx+1}_tech${j+1}`] = t;
        });
    });

    // Add skills
    Object.entries(data.skills).forEach(([cat, items]) => {
        const key = cat.toLowerCase().replace(/[()\/]/g, '').replace(/\s+/g, '_');
        i18n.zh[`skill_${key}`] = items.join(', ');
        i18n.ja[`skill_${key}`] = items.join(', ');
        i18n.en[`skill_${key}`] = items.join(', ');
    });

    // Add PR
    data.pr.forEach((p, i) => {
        i18n.zh[`pr${i+1}`] = p;
        i18n.ja[`pr${i+1}`] = p;
        i18n.en[`pr${i+1}`] = p;
    });

    return i18n;
}

function generateHTML(data) {
    const langBtns = `
    <div style="margin-bottom: 20px;">
        <button class="lang-btn" data-lang="zh">中文</button>
        <button class="lang-btn" data-lang="ja">日本語</button>
        <button class="lang-btn active" data-lang="en">English</button>
    </div>`;

    const summarySection = `
    <h2 data-t="summary_title">Career Summary</h2>
    <p data-t="summary">${data.summary}</p>`;

    const strengthsSection = `
    <h2 data-t="strengths_title">Key Strengths</h2>
    <ul>
        ${data.strengths.map((s, i) => `<li data-t="s${i+1}_title">${s}</li>`).join('\n        ')}
    </ul>`;

    const eduSection = `
    <h2 data-t="edu_title">Education</h2>
    <table>
        <tr><th data-t="period_label">Period</th><td data-t="period_edu">${data.education.period}</td></tr>
        <tr><th data-t="school_label">School</th><td data-t="school">${data.education.school}</td></tr>
    </table>`;

    const companySection = `
    <h2 data-t="company_title">Work History</h2>
    <table>
        <tr><th data-t="period_label">Period</th><th data-t="company_label">Company</th></tr>
        ${data.companies.map((c, i) => `<tr><td data-t="c${i+1}_period">${c.period}</td><td data-t="c${i+1}">${c.name}</td></tr>`).join('\n        ')}
    </table>`;

    const projectsSection = `
    <h2 data-t="proj_title">Project Experience</h2>
    ${data.projects.map((p, i) => `
    <div class="project">
        <div class="project-header">
            <h3 data-t="p${i+1}_title">${p.title}</h3>
            <span class="period" data-t="p${i+1}_period">${p.period}</span>
        </div>
        <div class="role" data-t="p${i+1}_role">${p.role}</div>
        <div class="overview" data-t="p${i+1}_overview">${p.overview}</div>
        <h4>Responsibilities</h4>
        <ul>
            ${p.duties.map((d, j) => `<li data-t="p${i+1}_d${j+1}">${d}</li>`).join('\n            ')}
        </ul>
        ${p.tech.length ? `<div class="tech-env"><span data-t="tech_env">Tech: </span>${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join(' ')}</div>` : ''}
    </div>`).join('\n')}`;

    const skillsSection = `
    <h2 data-t="skill_title">Technical Skills</h2>
    ${Object.entries(data.skills).map(([cat, items]) => `
    <div class="skill-category">
        <strong>${cat}:</strong>
        <div class="skill-items">${items.map(i => `<span class="tech-tag">${i}</span>`).join('')}</div>
    </div>`).join('\n')}`;

    const prSection = `
    <h2 data-t="pr_title">Self PR</h2>
    <ul>
        ${data.pr.map((p, i) => `<li data-t="pr${i+1}">${p}</li>`).join('\n        ')}
    </ul>`;

    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        body { font-family: "Helvetica Neue", Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1 { font-size: 1.8em; margin-bottom: 0.5em; }
        h2 { font-size: 1.4em; border-bottom: 2px solid #666; padding-bottom: 5px; margin-top: 1.5em; }
        h3 { font-size: 1.1em; margin: 0; }
        h4 { font-size: 1em; margin: 10px 0 5px; }
        .project { border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .project-header { display: flex; justify-content: space-between; align-items: baseline; }
        .period { color: #666; font-size: 0.9em; }
        .role { font-weight: bold; color: #555; margin: 5px 0; }
        .overview { font-style: italic; margin: 10px 0; }
        .tech-tag { background: #e0e0e0; padding: 2px 8px; margin: 2px; border-radius: 3px; font-size: 0.85em; }
        .tech-env { margin-top: 10px; }
        ul { padding-left: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f5f5f5; }
        .lang-btn { background: #fff; border: 1px solid #333; padding: 5px 10px; margin-right: 5px; cursor: pointer; }
        .lang-btn.active { background: #333; color: #fff; }
        .skill-category { margin: 10px 0; }
        .skill-items { display: inline; }
    </style>
</head>
<body>
    ${langBtns}
    <h1 data-t="title">${data.title}</h1>
    ${summarySection}
    ${strengthsSection}
    ${eduSection}
    ${companySection}
    ${projectsSection}
    ${skillsSection}
    ${prSection}
    <script src="app.js"></script>
</body>
</html>`;
}

// Main execution
const mdContent = fs.readFileSync(path.join(__dirname, 'Resume-Demo.md'), 'utf-8');
const data = parseMarkdown(mdContent);

// Debug output
console.log('=== Parsed Data ===');
console.log('Title:', data.title);
console.log('Summary:', data.summary?.slice(0, 80) + '...');
console.log('Strengths:', data.strengths.length);
console.log('Education:', data.education);
console.log('Companies:', data.companies.length);
console.log('Projects:', data.projects.length);
data.projects.forEach((p, i) => {
    console.log(`  P${i+1}: ${p.title}`);
    console.log(`    Duties: ${p.duties.length}, Tech: ${p.tech.length}`);
});
console.log('Skills:', Object.keys(data.skills));

// Generate files
const i18n = generateI18n(data);
fs.writeFileSync(path.join(__dirname, 'i18n-generated.json'), JSON.stringify(i18n, null, 2));

const html = generateHTML(data);
fs.writeFileSync(path.join(__dirname, 'index-generated.html'), html);

console.log('\n=== Generated Files ===');
console.log('i18n-generated.json');
console.log('index-generated.html');
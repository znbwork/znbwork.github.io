// 平滑滚动效果
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    }
});

// 添加视差滚动效果
window.addEventListener('scroll', function() {
    const circles = document.querySelectorAll('.circle');
    const scrolled = window.pageYOffset;
    
    circles.forEach((circle, index) => {
        const speed = index * 0.2;
        circle.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// 添加技能卡片动画
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.skill-item').forEach(item => {
    observer.observe(item);
});

// 添加移动端菜单切换功能
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('header');

// 创建遮罩层
const overlay = document.createElement('div');
overlay.classList.add('nav-overlay');
document.body.appendChild(overlay);

// 切换菜单
function toggleMenu() {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

menuToggle.addEventListener('click', toggleMenu);

// 点击遮罩层关闭菜单
overlay.addEventListener('click', toggleMenu);

// 点击菜单项关闭菜单
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// 添加计算工作年限的函数
function calculateExperience() {
    const startYear = 2008; // 开始工作的年份
    const currentYear = new Date().getFullYear();
    const experience = currentYear - startYear;
    
    // 更新显示
    const experienceElement = document.getElementById('yearsOfExperience');
    if (experienceElement) {
        experienceElement.textContent = experience;
    }
}

// 页面加载时计算
document.addEventListener('DOMContentLoaded', calculateExperience);

// 添加动态年份设置函数
function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// 页面加载时设置年份
document.addEventListener('DOMContentLoaded', setCurrentYear);
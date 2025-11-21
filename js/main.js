let allGames = [];
let currentSlide = 0;

// 确保在 script.js 最顶部声明了这个变量
// let allGames = []; 

async function loadGamesData() {
    try {
        // 1. 使用 ./ 明确相对路径
        const response = await fetch('./data/games.json');

        // 2. 【关键修正】手动检查网络状态
        // 如果文件不存在(404)或服务器错误(500)，fetch 不会抛出异常，必须在这里拦截
        if (!response.ok) {
            throw new Error(`文件未找到或路径错误 (状态码: ${response.status})`);
        }

        // 3. 解析 JSON
        allGames = await response.json();
        return allGames;

    } catch (error) {
        console.error('数据加载失败:', error);

        // 4. 在页面上显示更友好的错误提示
        let errorMsg = "数据加载失败";

        // 针对本地直接打开文件的常见错误进行提示
        if (window.location.protocol === 'file:') {
            errorMsg = "❌ 错误：不支持直接双击打开 HTML 文件。<br>请使用 VS Code 的 'Live Server' 插件，<br>或者将代码上传到 GitHub Pages 后预览。";
        } else {
            errorMsg = `❌ 无法读取 data/games.json。<br>错误详情: ${error.message}<br>请检查 JSON 格式是否正确 (标点符号、逗号)。`;
        }

        document.body.innerHTML = `
            <div style="text-align:center; margin-top:100px; color:#333;">
                ${errorMsg}
            </div>
        `;
    }
}

// 2. 首页逻辑
function initHome() {
    renderCategories();
    renderGames(allGames);

    // 搜索监听
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const filtered = allGames.filter(g =>
            g.title.toLowerCase().includes(keyword) ||
            g.short_desc.toLowerCase().includes(keyword) ||
            g.tags.some(t => t.toLowerCase().includes(keyword))
        );
        renderGames(filtered);
    });
}

// 渲染游戏卡片
function renderGames(games) {
    const grid = document.getElementById('gamesGrid');
    grid.innerHTML = '';

    if (games.length === 0) {
        grid.innerHTML = '<p>没有找到相关游戏。</p>';
        return;
    }

    games.forEach(game => {
        const card = document.createElement('a');
        card.className = 'game-card';
        card.href = `game.html?id=${game.id}`; // 核心：通过 URL 参数传递 ID
        card.innerHTML = `
            <img src="${game.cover}" alt="${game.title}" loading="lazy">
            <div class="card-info">
                <h3>${game.title}</h3>
                <p style="font-size:0.9em; color:#666">${game.short_desc}</p>
                <div>${game.tags.map(t => `<span class="card-tag">#${t}</span>`).join(' ')}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 渲染分类按钮
function renderCategories() {
    const categories = ['全部', ...new Set(allGames.map(g => g.category))];
    const container = document.getElementById('categoryButtons');
    container.innerHTML = categories.map(cat =>
        `<button onclick="filterGames('${cat}')" class="${cat === '全部' ? 'active' : ''}">${cat}</button>`
    ).join('');
}

function filterGames(category) {
    // 更新按钮样式
    const buttons = document.querySelectorAll('#categoryButtons button');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.innerText === category);
    });

    // 筛选数据
    if (category === '全部') {
        renderGames(allGames);
    } else {
        renderGames(allGames.filter(g => g.category === category));
    }
}

// 3. 详情页逻辑
function initGameDetail() {
    // 获取 URL 中的 ?id=xxx
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');
    const game = allGames.find(g => g.id === gameId);

    if (!game) {
        document.querySelector('main').innerHTML = '<h2>未找到该游戏信息</h2>';
        return;
    }

    // 填充文本信息
    document.title = `${game.title} - 游戏详情`;
    document.getElementById('gTitle').innerText = game.title;
    document.getElementById('gShortDesc').innerText = game.short_desc;
    document.getElementById('gDesc').innerHTML = game.description;
    document.getElementById('gTags').innerHTML = game.tags.map(t => `<span class="card-tag">#${t}</span>`).join(' ');

    // 填充更新日志
    const updatesHtml = game.updates.length > 0
        ? game.updates.map(u => `<li><b>${u.date}</b>: ${u.content}</li>`).join('')
        : '<li>暂无更新记录</li>';
    document.getElementById('gUpdates').innerHTML = updatesHtml;

    // 填充下载链接
    const downloadHtml = game.download.map(d => `
        <div>
            <a href="${d.url}" target="_blank" class="download-btn">下载 (${d.platform})</a>
            ${d.password ? `<span class="password">提取码: ${d.password}</span>` : ''}
        </div>
    `).join('');
    document.getElementById('gDownload').innerHTML = downloadHtml;

    // 初始化轮播图
    initCarousel(game.media);
}

// 轮播图逻辑
function initCarousel(mediaList) {
    const wrapper = document.getElementById('carouselWrapper');
    if (!mediaList || mediaList.length === 0) {
        document.querySelector('.carousel-container').style.display = 'none';
        return;
    }

    wrapper.innerHTML = mediaList.map(m => {
        if (m.type === 'video') {
            return `<div class="carousel-slide"><video controls src="${m.src}"></video></div>`;
        }
        return `<div class="carousel-slide"><img src="${m.src}"></div>`;
    }).join('');
}

function moveSlide(direction) {
    const wrapper = document.getElementById('carouselWrapper');
    const totalSlides = wrapper.children.length;
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
}
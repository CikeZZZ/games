// --- DOM Elements (缓存) ---
const gameTitleEl = document.getElementById('game-title');
const gameVersionEl = document.getElementById('game-version');
const gameDeveloperEl = document.getElementById('game-developer');
const gameShortDescEl = document.getElementById('game-short-desc');
const gameLongDescEl = document.getElementById('game-long-desc');
const developerEmailEl = document.getElementById('developer-email');
const categoriesContainer = document.getElementById('game-categories');
const tagsContainer = document.getElementById('game-tags');
const updatesContainer = document.getElementById('game-updates');
const windowsDownloadsContainer = document.getElementById('windows-downloads');
const androidDownloadsContainer = document.getElementById('android-downloads');
const previewSlider = document.getElementById('preview-slider');
const previewIndicators = document.getElementById('preview-indicators');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const gameContentEl = document.querySelector('.game-content');

// --- Modal and Toast Elements ---
const modal = document.getElementById('preview-modal');
const modalImg = document.getElementById('modal-preview-img');
const modalVideo = document.getElementById('modal-preview-video');
const modalClose = document.querySelector('.close-modal');
const modalPrevBtn = document.getElementById('modal-prev-btn');
const modalNextBtn = document.getElementById('modal-next-btn');
const copyToast = document.getElementById('copy-toast');

// --- 全局变量 ---
let currentSlideIndex = 0;
let autoPlayInterval;
let totalSlides = 0; // 用于预览轮播
let previewItems = []; // 存储预览项数据，供模态框使用

// --- 主函数 ---
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (gameId) {
        loadGameDetail(gameId);
    } else {
        window.location.href = 'index.html';
    }
});

// --- 加载游戏详情 ---
function loadGameDetail(gameId) {
    const game = getGameById(gameId);

    if (!game) {
        window.location.href = 'index.html';
        return;
    }

    // 存储预览项数据
    previewItems = game.preview;

    populateGameInfo(game);
    initPreviewSlider(game.preview);
    setupModal(); // 设置模态框
    setupEmailCopy(); // 设置邮箱复制
    addPageLoadAnimation(); // 显示内容
}

function populateGameInfo(game) {
    gameTitleEl.textContent = game.name;
    gameVersionEl.textContent = `v${game.version}`;
    gameDeveloperEl.textContent = game.developer;
    gameShortDescEl.textContent = game.shortDescription;
    gameLongDescEl.textContent = game.longDescription;
    developerEmailEl.textContent = game.contactEmail;
    // developerEmailEl.href = `mailto:${game.contactEmail}`; // 移除 mailto 链接，改用复制功能
    developerEmailEl.href = '#'; // 设置为空链接或锚点

    // 填充分类 - 添加点击事件
    categoriesContainer.innerHTML = '';
    game.categories.forEach(category => {
        const span = document.createElement('span');
        span.className = 'tag'; // 使用 'tag' 类保持样式一致
        span.textContent = category;
        span.onclick = () => filterByType('category', category); // 绑定点击事件
        span.style.cursor = 'pointer';
        span.title = `点击筛选 ${category} 分类的游戏`;
        categoriesContainer.appendChild(span);
    });

    // 填充标签 - 添加点击事件
    tagsContainer.innerHTML = '';
    game.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        span.onclick = () => filterByType('tag', tag); // 绑定点击事件
        span.style.cursor = 'pointer';
        span.title = `点击筛选 ${tag} 标签的游戏`;
        tagsContainer.appendChild(span);
    });

    // 填充更新日志
    updatesContainer.innerHTML = '';
    game.updates.forEach(update => {
        const li = document.createElement('li');
        li.textContent = update;
        updatesContainer.appendChild(li);
    });

    // 填充下载链接
    renderDownloadLinks(game.downloads, 'windows', windowsDownloadsContainer);
    renderDownloadLinks(game.downloads, 'android', androidDownloadsContainer);
}

// --- 渲染下载链接 ---
function renderDownloadLinks(downloads, platform, container) {
    const platformDownloads = downloads[platform];
    const downloadLinksContainer = container.querySelector('.download-links');

    if (platformDownloads && platformDownloads.length > 0) {
        downloadLinksContainer.innerHTML = '';
        platformDownloads.forEach(dl => {
            const link = document.createElement('a');
            link.href = dl.url;
            link.className = 'download-link';
            link.textContent = dl.name;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.onclick = () => console.log(`下载 ${dl.name} - ${dl.url}`); // 统计逻辑可在此添加
            downloadLinksContainer.appendChild(link);
        });
        container.style.display = 'block'; // 显示该平台部分
    } else {
        container.style.display = 'none'; // 隐藏该平台部分
    }
}

// --- 初始化预览轮播 ---
function initPreviewSlider(previewItemsData) {
    if (!previewItemsData || previewItemsData.length === 0) {
        previewSlider.innerHTML = '<div class="preview-slide"><p>暂无预览内容</p></div>';
        totalSlides = 1;
        return;
    }

    totalSlides = previewItemsData.length;
    previewSlider.innerHTML = '';
    previewIndicators.innerHTML = '';

    previewItemsData.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'preview-slide';

        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = `预览 ${index + 1}`;
            // 添加点击事件以打开模态框
            img.addEventListener('click', () => openModal(index));
            slide.appendChild(img);
        } else if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            video.controls = true;
            video.autoplay = false;
            video.muted = true;
            // 添加点击事件以打开模态框
            video.addEventListener('click', () => openModal(index));
            slide.appendChild(video);
        }

        previewSlider.appendChild(slide);

        // 创建指示器
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.dataset.index = index;
        indicator.onclick = () => goToSlide(index);
        indicator.title = `预览 ${index + 1}`;
        previewIndicators.appendChild(indicator);
    });

    // 设置初始状态
    updateSlider();

    // 设置按钮事件
    prevBtn.addEventListener('click', () => changeSlide(-1));
    nextBtn.addEventListener('click', () => changeSlide(1));

    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') changeSlide(-1);
        else if (e.key === 'ArrowRight') changeSlide(1);
    });

    // 自动播放
    startAutoPlay();
}

function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    else if (index >= totalSlides) index = 0;

    currentSlideIndex = index;
    updateSlider();
    resetAutoPlay(); // 重置自动播放计时器
}

function changeSlide(direction) {
    let newIndex = currentSlideIndex + direction;
    if (newIndex < 0) newIndex = totalSlides - 1;
    else if (newIndex >= totalSlides) newIndex = 0;

    goToSlide(newIndex);
}

function updateSlider() {
    // 移动滑块
    previewSlider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    // 更新指示器
    const indicators = previewIndicators.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlideIndex);
    });
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// --- 页面加载动画 ---
function addPageLoadAnimation() {
    // 初始隐藏
    gameContentEl.style.opacity = '0';
    gameContentEl.style.transform = 'translateY(20px)';

    // 触发显示
    setTimeout(() => {
        gameContentEl.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        gameContentEl.style.opacity = '1';
        gameContentEl.style.transform = 'translateY(0)';
    }, 100);
}

// --- 按类型筛选 (分类或标签) ---
function filterByType(type, value) {
    // 构建查询参数
    let queryParam = '';
    if (type === 'category') {
        queryParam = `category=${encodeURIComponent(value)}`;
    } else if (type === 'tag') {
        queryParam = `tag=${encodeURIComponent(value)}`;
    }

    // 跳转到首页并应用筛选
    window.location.href = `index.html?${queryParam}`;
}

// --- 预览模态框 ---
function setupModal() {
    // 关闭模态框
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); // 点击背景关闭
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); // ESC关闭
        if (e.key === 'ArrowLeft' && !modal.classList.contains('hidden')) showPreview(-1); // 左箭头
        if (e.key === 'ArrowRight' && !modal.classList.contains('hidden')) showPreview(1);  // 右箭头
    });

    // 模态框导航按钮
    modalPrevBtn.addEventListener('click', () => showPreview(-1));
    modalNextBtn.addEventListener('click', () => showPreview(1));
}

function openModal(index) {
    if (previewItems.length === 0) return;

    currentSlideIndex = index; // 同步全局索引
    showPreview(0); // 显示当前项
    modal.classList.remove('hidden'); // 显示模态框
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

function showPreview(direction) {
    let newIndex = currentSlideIndex + direction;
    if (newIndex < 0) newIndex = totalSlides - 1;
    else if (newIndex >= totalSlides) newIndex = 0;

    currentSlideIndex = newIndex;

    const item = previewItems[currentSlideIndex];
    if (item.type === 'image') {
        modalImg.src = item.src;
        modalImg.alt = `预览 ${currentSlideIndex + 1}`;
        modalImg.style.display = 'block';
        modalVideo.style.display = 'none';
        modalVideo.src = ''; // 清空视频src
    } else if (item.type === 'video') {
        modalVideo.src = item.src;
        modalVideo.style.display = 'block';
        modalImg.style.display = 'none';
        modalImg.src = ''; // 清空图片src
        modalVideo.load(); // 加载视频
        // 可以选择是否自动播放
        // modalVideo.play();
    }
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // 恢复背景滚动
}

// --- 邮箱复制 ---
function setupEmailCopy() {
    developerEmailEl.addEventListener('click', async (e) => {
        e.preventDefault(); // 阻止默认跳转行为
        const email = developerEmailEl.textContent;

        try {
            await navigator.clipboard.writeText(email);
            showToast('邮箱已复制到剪贴板');
        } catch (err) {
            console.error('复制失败: ', err);
            // 降级方案：使用execCommand (虽然已废弃，但仍有支持)
            const textArea = document.createElement('textarea');
            textArea.value = email;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('邮箱已复制到剪贴板 (降级方案)');
        }
    });
}

function showToast(message) {
    copyToast.textContent = message;
    copyToast.classList.remove('hidden');
    setTimeout(() => {
        copyToast.classList.add('hidden');
    }, 2000); // 2秒后隐藏
}

// --- 主题切换相关 (已删除) ---
// setupDarkThemeToggle, setupThemeToggleButton, toggleDarkTheme, updateThemeButtonIcon functions removed.
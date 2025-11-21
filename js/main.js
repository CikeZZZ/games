// --- DOM Elements (缓存，减少DOM查询) ---
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const categoryFilter = document.getElementById('category-filter');
const tagFilter = document.getElementById('tag-filter');
const gamesGrid = document.getElementById('games-grid');
const paginationContainer = document.getElementById('pagination');

// --- 配置 ---
const ITEMS_PER_PAGE = 15;

// --- 主函数 ---
document.addEventListener('DOMContentLoaded', function () {
    initPage();
    setupEventListeners(); // 统一设置事件监听器
    setupKeyboardShortcuts(); // 设置键盘快捷键
});

// --- 初始化 ---
function initPage() {
    loadFilterOptions();

    // 检查URL参数以应用初始筛选
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category');
    const initialTag = urlParams.get('tag');

    // 设置下拉框的值
    if (initialCategory) {
        categoryFilter.value = initialCategory;
    }
    if (initialTag) {
        tagFilter.value = initialTag;
    }

    // 显示游戏列表，会自动应用当前下拉框的值
    displayGames(1, ITEMS_PER_PAGE);
    // addPageLoadAnimation(); // 此功能已集成到 displayGames 中
}

// --- 事件监听器设置 ---
function setupEventListeners() {
    // 搜索
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            displayGames(1); // 搜索时重置到第一页
        }, 300);
    });
    searchBtn.addEventListener('click', () => displayGames(1));
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') displayGames(1);
    });

    // 筛选
    categoryFilter.addEventListener('change', () => displayGames(1)); // 筛选时重置到第一页
    tagFilter.addEventListener('change', () => displayGames(1));

    // 分页按钮事件将动态添加，因此需要事件委托
    paginationContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-btn') && !e.target.classList.contains('active')) {
            const page = parseInt(e.target.dataset.page);
            if (!isNaN(page)) {
                displayGames(page);
            }
        }
    });
}

// --- 键盘快捷键 ---
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // 按 '/' 键聚焦搜索框
        if (e.key === '/') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// --- 加载筛选选项 ---
function loadFilterOptions() {
    const categories = getAllCategories();
    const tags = getAllTags();

    populateSelect(categoryFilter, categories);
    populateSelect(tagFilter, tags);
}

function populateSelect(selectElement, optionsArray) {
    selectElement.innerHTML = '<option value="">全部</option>';
    optionsArray.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
}

// --- 显示游戏列表 ---
function displayGames(page = 1, itemsPerPage = ITEMS_PER_PAGE) {
    const searchQuery = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value; // 使用下拉框的当前值
    const selectedTag = tagFilter.value;         // 使用下拉框的当前值

    // 过滤游戏
    let filteredGames = gamesData.filter(game => {
        const matchesSearch = !searchQuery ||
            game.name.toLowerCase().includes(searchQuery) ||
            game.shortDescription.toLowerCase().includes(searchQuery) ||
            game.developer.toLowerCase().includes(searchQuery);
        const matchesCategory = !selectedCategory || game.categories.includes(selectedCategory);
        const matchesTag = !selectedTag || game.tags.includes(selectedTag);
        return matchesSearch && matchesCategory && matchesTag;
    });

    // 计算分页数据
    const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex > filteredGames.length ? filteredGames.length : startIndex + itemsPerPage; // 防止越界
    const gamesToShow = filteredGames.slice(startIndex, endIndex);

    // 清空现有游戏卡片
    gamesGrid.innerHTML = '';

    // 生成游戏卡片
    gamesToShow.forEach((game, index) => {
        const gameCard = createGameCard(game);
        // 添加延迟动画效果
        gameCard.style.animationDelay = `${index * 0.05}s`;
        gamesGrid.appendChild(gameCard);
    });

    // 更新分页
    updatePagination(page, totalPages);
    updateResultsCount(filteredGames.length);
}

// --- 更新结果计数 ---
function updateResultsCount(count) {
    // 移除现有的结果计数
    const existingCount = document.querySelector('.results-count');
    if (existingCount) existingCount.remove();

    // 添加新的结果计数
    const resultsCount = document.createElement('div');
    resultsCount.className = 'results-count';
    resultsCount.textContent = `找到 ${count} 个游戏`;

    const searchSection = document.querySelector('.search-section');
    // 插入到搜索框下方
    searchSection.appendChild(resultsCount);
}

// --- 创建游戏卡片 ---
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';

    const coverPreview = game.preview.find(p => p.type === 'image');
    // 修正错误：使用 coverPreview.src 而不是 p.src
    const coverSrc = coverPreview ? coverPreview.src : 'assets/images/default-game.jpg';

    card.innerHTML = `
        <div class="game-card-image">
            <img src="${coverSrc}" alt="${game.name}" loading="lazy">
        </div>
        <div class="game-card-content">
            <h3>${game.name}</h3>
            <p class="short-description">${game.shortDescription}</p>
            <div class="game-meta">
                <span class="version">${game.version}</span>
                <span class="developer">${game.developer}</span>
            </div>
            <div class="categories" id="categories-${game.id}"> <!-- 添加唯一ID -->
                ${game.categories.map(cat => `<span class="category">${cat}</span>`).join('')} <!-- 先渲染所有 -->
            </div>
            <div class="tags" id="tags-${game.id}"> <!-- 添加唯一ID -->
                ${game.tags.map(tag => `<span class="tag">${tag}</span>`).join('')} <!-- 先渲染所有 -->
            </div>
        </div>
    `;

    // 点击跳转到详情页
    card.addEventListener('click', () => {
        window.location.href = `game-detail.html?id=${game.id}`;
    });

    // 渲染完成后，调整标签和分类显示
    // 使用 setTimeout 将操作推迟到下一个事件循环，确保DOM已渲染
    setTimeout(() => {
        truncateTagsAndCategories(`categories-${game.id}`, game.categories);
        truncateTagsAndCategories(`tags-${game.id}`, game.tags);
    }, 0);

    return card;
}

// --- 截断标签和分类显示 ---
function truncateTagsAndCategories(containerId, itemsArray) {
    const container = document.getElementById(containerId);
    if (!container || itemsArray.length <= 0) return;

    const childSpans = container.querySelectorAll('span'); // 获取所有标签span元素
    if (childSpans.length <= 1) return; // 如果只有一个或没有，无需处理

    const containerWidth = container.offsetWidth;
    let currentWidth = 0;
    let visibleCount = 0;

    for (let i = 0; i < childSpans.length; i++) {
        const span = childSpans[i];
        // 强制重排以获取准确的offsetWidth
        span.style.display = 'inline-block';
        const spanWidth = span.offsetWidth;

        if (currentWidth + spanWidth <= containerWidth) {
            // 如果加上当前span的宽度没有超出容器，则显示它
            currentWidth += spanWidth;
            visibleCount++;
        } else {
            // 如果超出，隐藏后面的span
            // 但要确保至少显示一个
            if (visibleCount === 0) {
                // 如果第一个span就超宽，强制显示它
                visibleCount = 1;
                break;
            }
            // 隐藏当前及之后的span
            span.style.display = 'none';
        }
    }

    // 如果有隐藏的项，添加一个“更多”标签
    if (visibleCount < itemsArray.length) {
        const moreSpan = document.createElement('span');
        moreSpan.className = 'tag more'; // 使用 'tag' 类以保持样式一致
        if (containerId.startsWith('categories-')) {
            moreSpan.className = 'category more'; // 如果是分类容器，使用 'category' 类
        }
        moreSpan.textContent = `+${itemsArray.length - visibleCount}`;
        container.appendChild(moreSpan);
    } else {
        // 如果没有隐藏的项，移除可能存在的“更多”标签（如果之前添加过）
        const existingMore = container.querySelector('.more');
        if (existingMore) {
            existingMore.remove();
        }
    }

    // 隐藏的span可能会留下空白，可以隐藏整个容器再显示来重置布局
    // 但这可能会影响性能，通常上面的 display: none 就足够了
    // container.style.display = 'none';
    // container.offsetHeight; // 触发重排
    // container.style.display = '';
}

// --- 更新分页 ---
function updatePagination(currentPage, totalPages) {
    paginationContainer.innerHTML = ''; // 清空

    if (totalPages <= 1) return;

    const maxVisiblePages = 5; // 最多显示5个页码按钮（包括当前页、前后各一个、首尾页）

    // 上一页按钮
    if (currentPage > 1) {
        const prevBtn = createPageButton(currentPage - 1, '上一页');
        paginationContainer.appendChild(prevBtn);
    }

    // 页码按钮逻辑
    let pagesToShow = [];

    if (totalPages <= maxVisiblePages) {
        // 如果总页数小于等于最大显示页数，则显示所有页码
        pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        // 否则，计算需要显示的页码
        const startPage = Math.max(1, currentPage - 1); // 当前页前一个
        const endPage = Math.min(totalPages, currentPage + 1); // 当前页后一个

        pagesToShow.push(1); // 总是显示第一页

        if (startPage > 2) {
            pagesToShow.push('ellipsis_start'); // 第一页后需要省略号
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i !== 1 && i !== totalPages) { // 避免重复添加首尾页
                pagesToShow.push(i);
            }
        }

        if (endPage < totalPages - 1) {
            pagesToShow.push('ellipsis_end'); // 最后一页前需要省略号
        }

        if (totalPages > 1) {
            pagesToShow.push(totalPages); // 总是显示最后一页
        }
    }

    // 根据计算出的数组生成按钮
    pagesToShow.forEach(pageNum => {
        if (pageNum === 'ellipsis_start' || pageNum === 'ellipsis_end') {
            const ellipsis = createEllipsis();
            paginationContainer.appendChild(ellipsis);
        } else {
            const pageBtn = createPageButton(pageNum, null, pageNum === currentPage);
            pageBtn.dataset.page = pageNum; // 添加数据属性用于事件委托
            paginationContainer.appendChild(pageBtn);
        }
    });

    // 下一页按钮
    if (currentPage < totalPages) {
        const nextBtn = createPageButton(currentPage + 1, '下一页');
        paginationContainer.appendChild(nextBtn);
    }
}


function createPageButton(page, text, isActive = false) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${isActive ? 'active' : ''}`;
    btn.textContent = text || page;
    if (!isActive) {
        btn.dataset.page = page; // 未激活的按钮才需要存储页码
    }
    return btn;
}

function createEllipsis() {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    // 使用CSS类而不是内联样式，确保样式一致
    ellipsis.className = 'ellipsis';
    return ellipsis;
}
// --- 主题切换相关 (已删除) ---
// setupDarkThemeToggle, setupThemeToggleButton, toggleDarkTheme, updateThemeButtonIcon functions removed.
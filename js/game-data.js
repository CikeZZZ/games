// 游戏数据存储文件
const gamesData = [
    {
        id: 1,
        name: "测试 星界探险",
        version: "1.2.0",
        developer: "星际工作室",
        categories: ["冒险", "RPG", "科幻"],
        tags: ["单人", "探索", "剧情丰富"],
        shortDescription: "在未知的星系中展开冒险，发现神秘文明的遗迹",
        longDescription: "《星界探险》是一款开放世界的科幻冒险游戏。玩家将扮演一名星际探险家，在广阔的宇宙中探索未知星球，发现古老的文明遗迹，与外星生物互动，并解开宇宙的终极秘密。游戏拥有丰富的剧情线、多样的任务系统和深度的角色发展机制。",
        preview: [
            { type: "image", src: "access/images/宁宁.png" },
            { type: "image", src: "access/images/刻晴.jpg" }
        ],
        updates: [
            "v1.2.0: 新增3个星球，优化了战斗系统",
            "v1.1.5: 修复了多个bug，提升了游戏性能",
            "v1.1.0: 新增多人合作模式",
            "v1.0.0: 游戏首次发布"
        ],
        downloads: {
            windows: [
                { name: "完整版", url: "https://example.com/star-explorer-win-full.exe" },
                { name: "精简版", url: "https://example.com/star-explorer-win-lite.exe" }
            ],
            android: [
                { name: "Google Play", url: "https://play.google.com/store/apps/details?id=com.star.explorer" },
                { name: "APK下载", url: "https://example.com/star-explorer.apk" }
            ]
        },
        contactEmail: "contact@star-explorer.com"
    },
    {
        id: 2,
        name: "测试 像素英雄传说",
        version: "2.5.1",
        developer: "像素工坊",
        categories: ["动作", "RPG", "像素"],
        tags: ["复古", "挑战", "像素艺术"],
        shortDescription: "经典的像素风格动作RPG，重温童年游戏乐趣",
        longDescription: "《像素英雄传说》是一款致敬经典RPG的像素风格游戏。玩家将在充满挑战的地下城中冒险，与各种怪物战斗，收集装备和技能，最终击败邪恶的魔王。游戏拥有精美的像素艺术、动听的8-bit音乐和富有挑战性的战斗系统。",
        preview: [
            { type: "image", src: "assets/images/pixel-hero-1.jpg" },
            { type: "image", src: "assets/images/pixel-hero-2.jpg" }
        ],
        updates: [
            "v2.5.1: 修复了关卡加载问题",
            "v2.5.0: 新增4个新职业，平衡了游戏难度",
            "v2.4.5: 优化了存档系统"
        ],
        downloads: {
            windows: [
                { name: "完整版", url: "https://example.com/pixel-hero-win.exe" }
            ],
            android: [
                { name: "APK下载", url: "https://example.com/pixel-hero.apk" }
            ]
        },
        contactEmail: "dev@pixelhero.com"
    },
    {
        id: 3,
        name: "测试 梦境编织者",
        version: "1.0.3",
        developer: "梦境工作室",
        categories: ["解谜", "冒险", "独立"],
        tags: ["艺术", "氛围", "创新"],
        shortDescription: "在梦境中编织故事，解开隐藏的秘密",
        longDescription: "《梦境编织者》是一款独特的解谜冒险游戏。玩家将进入各种梦境世界，通过改变梦境的元素来解决谜题，推动故事发展。游戏拥有独特的艺术风格和创新的玩法机制，为玩家带来前所未有的沉浸式体验。",
        preview: [
            { type: "image", src: "assets/images/dream-weaver-1.jpg" },
            { type: "image", src: "assets/images/dream-weaver-2.jpg" },
            { type: "image", src: "assets/images/dream-weaver-3.jpg" }
        ],
        updates: [
            "v1.0.3: 修复了部分关卡的显示问题",
            "v1.0.2: 优化了游戏性能",
            "v1.0.1: 新增了开发者评论"
        ],
        downloads: {
            windows: [
                { name: "完整版", url: "https://example.com/dream-weaver-win.exe" }
            ],
            android: [
                { name: "Google Play", url: "https://play.google.com/store/apps/details?id=com.dream.weaver" }
            ]
        },
        contactEmail: "info@dreamweaver.com"
    },
    {
        id: 4,
        name: "测试 机械之心",
        version: "3.1.0",
        developer: "机械联盟",
        categories: ["射击", "科幻", "多人"],
        tags: ["机甲", "竞技", "团队合作"],
        shortDescription: "驾驶强大的机甲，在未来战场上展开激烈对战",
        longDescription: "《机械之心》是一款多人在线机甲战斗游戏。玩家可以自定义自己的机甲，选择不同的武器和装备，在各种地图上与其他玩家进行实时对战。游戏强调策略和团队合作，拥有丰富的自定义选项和深度的战斗系统。",
        preview: [
            { type: "image", src: "assets/images/mecha-heart-1.jpg" },
            { type: "video", src: "assets/videos/mecha-heart-trailer.mp4" }
        ],
        updates: [
            "v3.1.0: 新增3种机甲类型，平衡了武器伤害",
            "v3.0.5: 优化了匹配系统",
            "v3.0.0: 重做了用户界面，新增排位系统"
        ],
        downloads: {
            windows: [
                { name: "完整版", url: "https://example.com/mecha-heart-win.exe" },
                { name: "Steam版", url: "https://store.steampowered.com/app/mecha-heart" }
            ],
            android: [
                { name: "APK下载", url: "https://example.com/mecha-heart.apk" }
            ]
        },
        contactEmail: "support@mecha-heart.com"
    },
    {
        id: 5,
        name: "测试 森林守护者",
        version: "1.4.2",
        developer: "自然之友",
        categories: ["模拟", "策略", "环保"],
        tags: ["生态", "教育", "休闲"],
        shortDescription: "管理森林生态系统，保护自然环境",
        longDescription: "《森林守护者》是一款生态模拟游戏。玩家需要管理森林资源，保护野生动物，应对自然灾害和人为干扰。游戏通过真实的生态系统模拟，教育玩家关于环境保护的重要性，同时提供策略性的游戏体验。",
        preview: [
            { type: "image", src: "assets/images/forest-guardian-1.jpg" },
            { type: "image", src: "assets/images/forest-guardian-2.jpg" }
        ],
        updates: [
            "v1.4.2: 修复了季节系统的问题",
            "v1.4.1: 新增了10种新动物",
            "v1.4.0: 新增了多人合作模式"
        ],
        downloads: {
            windows: [
                { name: "完整版", url: "https://example.com/forest-guardian-win.exe" }
            ],
            android: [
                { name: "Google Play", url: "https://play.google.com/store/apps/details?id=com.forest.guardian" }
            ]
        },
        contactEmail: "info@forest-guardian.org"
    },
    {
        id: 6,
        name: "测试 时间旅者",
        version: "2.0.0",
        developer: "时间工作室",
        categories: ["冒险", "解谜", "时间"],
        tags: ["时间旅行", "剧情", "科幻"],
        shortDescription: "穿越时空，改变历史，拯救未来",
        longDescription: "《时间旅者》是一款基于时间旅行机制的冒险解谜游戏。玩家可以穿越到不同的历史时期，通过改变过去的事件来影响未来。游戏拥有复杂的剧情分支和多样的结局，玩家的每一个选择都可能带来不同的结果。",
        preview: [
            { type: "image", src: "assets/images/time-traveler-1.jpg" },
            { type: "image", src: "assets/images/time-traveler-2.jpg" },
            { type: "video", src: "assets/videos/time-traveler-trailer.mp4" }
        ],
        updates: [
            "v2.0.0: 新增了3个时代，重做了时间线系统",
            "v1.5.5: 优化了时间悖论处理机制",
            "v1.5.0: 新增了时间实验室功能"
        ],
        downloads: {
            windows: [
                { name: "完整版", url: "https://example.com/time-traveler-win.exe" }
            ],
            android: [
                { name: "APK下载", url: "https://example.com/time-traveler.apk" }
            ]
        },
        contactEmail: "contact@time-traveler.com"
    }
];

// 获取所有分类
function getAllCategories() {
    const categories = new Set();
    gamesData.forEach(game => {
        game.categories.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
}

// 获取所有标签
function getAllTags() {
    const tags = new Set();
    gamesData.forEach(game => {
        game.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}

// 根据ID获取游戏详情
function getGameById(id) {
    return gamesData.find(game => game.id === parseInt(id));
}
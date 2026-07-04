const products = [
  // ===== 数码家电 (7) =====
  {
    name: '轻薄无线降噪耳机',
    description: '适合通勤、办公和运动的无线耳机，支持主动降噪、快速配对和长续航。佩戴舒适，音质通透，续航长达 30 小时。',
    price: 399,
    category: '数码家电',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    stock: 86,
    tags: ['热销']
  },
  {
    name: '65W 氮化镓快充套装',
    description: '小体积高功率快充头，兼容手机、平板和轻薄笔记本，附带耐弯折数据线。三口输出，支持同时为多设备充电。',
    price: 129,
    category: '数码家电',
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80',
    stock: 140,
    discount: 10,
    tags: ['新品', '限时优惠']
  },
  {
    name: '智能运动手表',
    description: '支持心率、睡眠、运动模式和消息提醒，轻便表身适合全天佩戴。1.4 英寸 AMOLED 屏幕，续航可达 14 天。',
    price: 699,
    category: '数码家电',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    stock: 42,
    discount: 15,
    tags: ['热销', '限时优惠']
  },
  {
    name: '三模机械键盘',
    description: '蓝牙、有线、无线三模连接，热插拔轴体，适合办公和游戏桌面。RGB 背光，PBT 键帽，全键无冲突。',
    price: 299,
    category: '数码家电',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    stock: 68,
    tags: ['推荐']
  },
  {
    name: '便携蓝牙音箱',
    description: '防泼溅外壳、清晰低频和 12 小时续航，适合家用和户外聚会。小巧便携，自带挂绳，方便随身携带。',
    price: 199,
    category: '数码家电',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80',
    stock: 73,
    tags: ['新品']
  },
  {
    name: '27 英寸 4K 高清显示器',
    description: '细腻 4K 分辨率和低蓝光模式，适合设计、办公和影音娱乐。窄边框设计，支持 Type-C 一线连接笔记本。',
    price: 1499,
    category: '数码家电',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
    stock: 25,
    tags: ['推荐']
  },
  {
    name: '多功能无线充电座',
    description: '同时为手机、耳机和手表充电，支持 Qi 快充协议。横竖屏随意切换，办公追剧两不误，告别线缆杂乱。',
    price: 169,
    category: '数码家电',
    imageUrl: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=900&q=80',
    stock: 92,
    discount: 8,
    tags: ['新品', '限时优惠']
  },

  // ===== 服饰鞋包 (7) =====
  {
    name: '纯棉基础短袖',
    description: '柔软透气的日常短袖，版型简洁，适合单穿或叠穿。多色可选，不易变形缩水，四季皆宜的基础单品。',
    price: 89,
    category: '服饰鞋包',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    stock: 220,
    tags: ['热销']
  },
  {
    name: '轻量通勤双肩包',
    description: '多隔层设计，可放置 15 英寸电脑，肩带减压，适合通勤和短途旅行。防泼水面料，后侧防盗口袋设计。',
    price: 169,
    category: '服饰鞋包',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    stock: 96,
    discount: 10,
    tags: ['限时优惠']
  },
  {
    name: '透气缓震跑步鞋',
    description: '轻量鞋面搭配缓震中底，适合日常慢跑、健走和城市通勤。回弹充分，包裹性好，适合多种足型。',
    price: 329,
    category: '服饰鞋包',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    stock: 64,
    tags: ['推荐']
  },
  {
    name: '防晒冰丝外套',
    description: '轻薄防晒面料，触感清凉，适合夏季户外和通勤穿着。连帽设计，UPF50+ 高效防晒，透气不闷汗。',
    price: 139,
    category: '服饰鞋包',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    stock: 118,
    tags: ['新品']
  },
  {
    name: '经典直筒牛仔裤',
    description: '中腰直筒版型，纯棉丹宁面料，厚度适中四季可穿。经典五个口袋设计，百搭不出错的衣柜主力。',
    price: 199,
    category: '服饰鞋包',
    imageUrl: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80',
    stock: 85,
    tags: ['推荐']
  },
  {
    name: '休闲帆布鞋',
    description: '经典系带帆布鞋，橡胶大底防滑耐磨，轻便舒适。简约百搭款式，学生党和通勤族的日常心头好。',
    price: 129,
    category: '服饰鞋包',
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
    stock: 156,
    discount: 12,
    tags: ['热销', '限时优惠']
  },
  {
    name: '大容量托特包',
    description: '帆布材质大容量托特包，可装下平板、书籍和日常杂物。内衬防泼溅，肩带加宽不勒肩，通勤逛街都能背。',
    price: 89,
    category: '服饰鞋包',
    imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80',
    stock: 133,
    tags: ['新品']
  },

  // ===== 家居生活 (7) =====
  {
    name: '不锈钢保温杯',
    description: '双层真空保温，杯口易清洁，适合办公室、学校和旅行携带。保温 12 小时保冷 6 小时，316 不锈钢内胆。',
    price: 79,
    category: '家居生活',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
    stock: 168,
    tags: ['热销']
  },
  {
    name: '北欧陶瓷餐具套装',
    description: '简洁釉面餐具组合，包含碗、盘、汤勺，适合家庭日常使用。高温烧制不含有害物质，可微波炉加热。',
    price: 219,
    category: '家居生活',
    imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80',
    stock: 58,
    tags: ['推荐']
  },
  {
    name: '记忆棉护颈枕',
    description: '慢回弹记忆棉承托颈椎，午休、旅行和居家使用都舒适。可拆卸外套方便清洗，透气孔设计不闷热。',
    price: 99,
    category: '家居生活',
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80',
    stock: 112,
    tags: ['新品']
  },
  {
    name: '无线手持吸尘器',
    description: '强劲吸力、轻便机身和多刷头组合，适合地面、沙发和车内清洁。HEPA 过滤系统，续航 40 分钟。',
    price: 799,
    category: '家居生活',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    stock: 34,
    discount: 15,
    tags: ['热销', '限时优惠']
  },
  {
    name: '天然香薰蜡烛礼盒',
    description: '植物精油调香，包含白茶、檀木、柑橘三种香型。大豆蜡环保无黑烟，燃烧时长约 40 小时/罐。',
    price: 99,
    category: '家居生活',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80',
    stock: 76,
    tags: ['推荐']
  },
  {
    name: '多功能收纳盒套装',
    description: '大小搭配六件套，适合衣柜、书桌和浴室的物品分类收纳。PP 材质安全无毒，可叠放节省空间。',
    price: 49,
    category: '家居生活',
    imageUrl: 'https://images.pexels.com/photos/220685/pexels-photo-220685.jpeg?auto=compress&cs=tinysrgb&w=900',
    stock: 198,
    tags: ['新品']
  },
  {
    name: '纯棉毛巾四件套',
    description: '精梳棉工艺，吸水性好且不易掉毛。包含面巾两条和浴巾两条，适合家庭日常替换使用。',
    price: 79,
    category: '家居生活',
    imageUrl: 'https://images.pexels.com/photos/20523089/pexels-photo-20523089.jpeg?auto=compress&cs=tinysrgb&w=900',
    stock: 143,
    discount: 20,
    tags: ['限时优惠']
  },

  // ===== 运动户外 (7) =====
  {
    name: '加厚防滑瑜伽垫',
    description: '高密度材质，防滑耐磨，适合瑜伽、拉伸和居家训练。6mm 厚度保护关节，附绑带方便收纳携带。',
    price: 69,
    category: '运动户外',
    imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=80',
    stock: 155,
    tags: ['新品']
  },
  {
    name: '可调节家用哑铃',
    description: '一对多档位重量调节，节省空间，满足力量训练入门需求。防滑握把，秒速切换，相当于一组哑铃架。',
    price: 259,
    category: '运动户外',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    stock: 47,
    tags: ['推荐']
  },
  {
    name: '户外折叠露营椅',
    description: '轻量可折叠结构，承重稳定，适合露营、钓鱼和阳台休闲。收纳小巧放后备箱不占空间，配杯架扶手。',
    price: 119,
    category: '运动户外',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80',
    stock: 88,
    tags: ['推荐']
  },
  {
    name: '弹力训练带套装',
    description: '五条不同阻力级别，配备把手和门扣。适合热身拉伸、臀部训练和康复练习，居家健身的省空间之选。',
    price: 39,
    category: '运动户外',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80',
    stock: 210,
    tags: ['热销']
  },
  {
    name: '运动冷水壶',
    description: '750ml 大容量，弹跳盖单手操作，防漏设计。Tritan 材质安全无异味，适合健身、登山和骑行补水。',
    price: 49,
    category: '运动户外',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=80',
    stock: 176,
    tags: ['新品']
  },
  {
    name: '户外速干T恤',
    description: '吸湿排汗面料，UPF30 防晒，夏季徒步、登山和骑行都适合。轻至 120g，折叠不占空间。',
    price: 89,
    category: '运动户外',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
    stock: 134,
    discount: 10,
    tags: ['限时优惠']
  },
  {
    name: '碳素登山杖',
    description: '碳纤维杖身仅重 220g，EVA 防滑握把，四节伸缩。配泥托和雪托，适合各种地形徒步登山。',
    price: 179,
    category: '运动户外',
    imageUrl: 'https://images.pexels.com/photos/8795599/pexels-photo-8795599.jpeg?auto=compress&cs=tinysrgb&w=900',
    stock: 63,
    tags: ['推荐']
  },

  // ===== 美妆个护 (7) =====
  {
    name: '温和氨基酸洁面乳',
    description: '绵密泡沫、温和清洁，适合日常洁面和敏感肌肤使用。添加神经酰胺和氨基酸成分，洗完不紧绷不假滑。',
    price: 59,
    category: '美妆个护',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
    stock: 180,
    tags: ['热销']
  },
  {
    name: '修护保湿面霜',
    description: '清爽质地与长效保湿配方，帮助改善干燥紧绷感。含透明质酸和积雪草提取物，适合干性和敏感肌肤。',
    price: 129,
    category: '美妆个护',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80',
    stock: 108,
    tags: ['推荐']
  },
  {
    name: '声波电动牙刷',
    description: '多模式清洁、两分钟定时提醒和长续航，提升日常口腔护理效率。IPX7 防水，配多个替换刷头。',
    price: 199,
    category: '美妆个护',
    imageUrl: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80',
    stock: 76,
    discount: 10,
    tags: ['限时优惠']
  },
  {
    name: '清爽防晒霜',
    description: 'SPF50+ PA++++ 高倍防晒，水感质地轻薄不假白。适合日常通勤和户外活动，无需专业卸妆即可洗净。',
    price: 89,
    category: '美妆个护',
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
    stock: 155,
    tags: ['热销']
  },
  {
    name: '修护发膜',
    description: '深层滋养受损发质，角蛋白和摩洛哥坚果油配方。每周一次改善干枯和分叉，让发丝柔顺有光泽。',
    price: 69,
    category: '美妆个护',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=900&q=80',
    stock: 122,
    tags: ['新品']
  },
  {
    name: '滋养护手霜礼盒',
    description: '三支装包含玫瑰、乳木果和洋甘菊香型，滋润修复干燥手部肌肤。小巧便携，适合办公桌和随身包放一支。',
    price: 59,
    category: '美妆个护',
    imageUrl: 'https://images.pexels.com/photos/6724485/pexels-photo-6724485.jpeg?auto=compress&cs=tinysrgb&w=900',
    stock: 98,
    discount: 15,
    tags: ['热销', '限时优惠']
  },
  {
    name: '补水面膜套装',
    description: '20 片装补水保湿面膜，三种成分交替使用：玻尿酸、胶原蛋白和维 C。适合日常密集补水护理。',
    price: 79,
    category: '美妆个护',
    imageUrl: 'https://images.pexels.com/photos/9775296/pexels-photo-9775296.jpeg?auto=compress&cs=tinysrgb&w=900',
    stock: 165,
    tags: ['推荐']
  },

  // ===== 母婴宠物 (7) =====
  {
    name: '婴儿柔湿巾组合装',
    description: '加厚亲肤无香型湿巾，适合宝宝清洁和家庭日常备用。EDI 纯水配方，无酒精无荧光剂，妈妈放心选。',
    price: 39,
    category: '母婴宠物',
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',
    stock: 260,
    tags: ['热销']
  },
  {
    name: '宠物自动饮水机',
    description: '循环过滤活水设计，低噪运行，帮助猫狗保持饮水习惯。2L 大容量，缺水指示灯提醒，滤芯可更换。',
    price: 159,
    category: '母婴宠物',
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
    stock: 61,
    tags: ['新品']
  },
  {
    name: '婴儿安抚毛绒玩具',
    description: '柔软短毛绒，内置响铃和牙胶环，适合 0 岁以上宝宝。可机洗不变形，通过安全检测不含 BPA。',
    price: 49,
    category: '母婴宠物',
    imageUrl: 'https://images.pexels.com/photos/4887156/pexels-photo-4887156.jpeg?auto=compress&cs=tinysrgb&w=900',
    stock: 145,
    tags: ['推荐']
  },
  {
    name: '猫抓板磨爪器',
    description: '高密度瓦楞纸，弧形设计贴合猫咪抓挠习惯，附带猫薄荷。保护家具的好帮手，猫咪一用就爱上。',
    price: 29,
    category: '母婴宠物',
    imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=900&q=80',
    stock: 182,
    tags: ['热销']
  },
  {
    name: '宠物营养狗粮',
    description: '鸡肉配方全价成犬粮，添加益生菌和 Omega-3。无人工色素和防腐剂，便便成形好，毛发更亮丽。',
    price: 129,
    category: '母婴宠物',
    imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=900&q=80',
    stock: 94,
    discount: 12,
    tags: ['推荐', '限时优惠']
  },
  {
    name: '儿童保温吸管水杯',
    description: '316 不锈钢内胆，吸管防呛设计，卡通图案让宝宝爱上喝水。容量 350ml，适合幼儿园和外出使用。',
    price: 79,
    category: '母婴宠物',
    imageUrl: 'https://images.pexels.com/photos/3737800/pexels-photo-3737800.jpeg?auto=compress&cs=tinysrgb&w=900',
    stock: 127,
    tags: ['新品']
  },
  {
    name: '婴幼儿爬行垫',
    description: 'XPE 环保材质双面爬行垫，加厚 2cm 防摔缓冲，防滑纹理保障宝宝学步安全。易清洁防水面层，一擦即净。',
    price: 149,
    category: '母婴宠物',
    imageUrl: 'https://images.pexels.com/photos/3875233/pexels-photo-3875233.jpeg?auto=compress&cs=tinysrgb&w=900',
    stock: 88,
    discount: 10,
    tags: ['限时优惠', '热销']
  },

  // ===== 食品饮品 (7) =====
  {
    name: '精品挂耳咖啡组合',
    description: '多产区挂耳咖啡组合，独立包装，适合办公室和居家冲泡。包含埃塞、哥伦比亚和云南三款风味体验装。',
    price: 88,
    category: '食品饮品',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
    stock: 132,
    tags: ['推荐']
  },
  {
    name: '每日坚果混合装',
    description: '7 种坚果和果干科学配比，每日一包约 25g。独立锁鲜包装，无油炸无添加，健康零食首选。',
    price: 69,
    category: '食品饮品',
    imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=900',
    stock: 188,
    tags: ['热销']
  },
  {
    name: '高山龙井绿茶',
    description: '明前采摘一芽一叶，豆香清雅回味甘醇。100g 密封罐装，自饮送礼两相宜，冲泡三次仍有余香。',
    price: 168,
    category: '食品饮品',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80',
    stock: 56,
    tags: ['推荐']
  },
  {
    name: '天然洋槐蜂蜜',
    description: '秦岭洋槐蜜源，清甜不腻，适合冲饮、抹面包和调味。500g 玻璃罐装，低温灌装保留活性酶。',
    price: 59,
    category: '食品饮品',
    imageUrl: 'https://images.pexels.com/photos/5865194/pexels-photo-5865194.jpeg?auto=compress&cs=tinysrgb&w=900',
    stock: 108,
    discount: 10,
    tags: ['限时优惠']
  },
  {
    name: '即食燕麦片',
    description: '澳洲进口原料，快熟免煮，搭配牛奶或酸奶即食。富含膳食纤维，低 GI 健康早餐，1kg 家庭装。',
    price: 39,
    category: '食品饮品',
    imageUrl: 'https://images.pexels.com/photos/4725736/pexels-photo-4725736.jpeg?auto=compress&cs=tinysrgb&w=900',
    stock: 245,
    tags: ['热销']
  },
  {
    name: '比利时黑巧克力',
    description: '72% 可可含量，微苦回甘，口感丝滑。独立小块包装方便分享，冷藏后口感更佳，下午茶的绝佳拍档。',
    price: 49,
    category: '食品饮品',
    imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80',
    stock: 163,
    tags: ['新品']
  },
  {
    name: '日式抹茶粉',
    description: '宇治抹茶原料，色泽翠绿、粉质细腻，适合拿铁、烘焙和冰淇淋制作。100g 铝箔密封罐，保留新鲜风味。',
    price: 79,
    category: '食品饮品',
    imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=900&q=80',
    stock: 87,
    tags: ['推荐']
  },

  // ===== 办公学习 (7) =====
  {
    name: '人体工学办公椅',
    description: '可调节腰托、头枕和扶手，适合长时间办公学习使用。网面靠背透气不闷汗，SGS 认证气杆安全稳固。',
    price: 899,
    category: '办公学习',
    imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80',
    stock: 28,
    discount: 15,
    tags: ['推荐', '限时优惠']
  },
  {
    name: 'A4 复印纸整箱',
    description: '打印顺滑不易卡纸，适合办公室、学校和家庭打印需求。70g 厚度，一箱五包共 2500 张，经济实惠。',
    price: 139,
    category: '办公学习',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    stock: 95,
    tags: ['热销']
  },
  {
    name: '软皮笔记本套装',
    description: 'A5 软皮封面，96 页道林纸内芯，适合会议记录和日常笔记。附带同色系按动中性笔，送礼自用都不错。',
    price: 39,
    category: '办公学习',
    imageUrl: 'https://images.pexels.com/photos/8702211/pexels-photo-8702211.jpeg?auto=compress&cs=tinysrgb&w=900',
    stock: 178,
    tags: ['新品']
  },
  {
    name: '学生护眼 LED 台灯',
    description: '无频闪、无蓝光危害，三档色温无极调光。灯臂可多角度调节，适合阅读写字，专注学习不疲劳。',
    price: 149,
    category: '办公学习',
    imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80',
    stock: 103,
    tags: ['热销']
  },
  {
    name: '金属桌面文件架',
    description: '三层铁艺架子，放置文件、书籍和办公用品，桌面瞬间清爽。安装简单，承重稳固，节省桌面空间。',
    price: 59,
    category: '办公学习',
    imageUrl: 'https://images.pexels.com/photos/7428214/pexels-photo-7428214.jpeg?auto=compress&cs=tinysrgb&w=900',
    stock: 138,
    tags: ['推荐']
  },
  {
    name: '白板墙贴',
    description: '60x90cm 可移除墙贴，附白板笔和擦布。适合办公备忘、家庭留言和儿童涂鸦，不伤墙面复用多次。',
    price: 35,
    category: '办公学习',
    imageUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&w=900&q=80',
    stock: 246,
    tags: ['新品']
  },
  {
    name: '静音无线鼠标',
    description: '2.4G 无线连接，左右键和滚轮均为静音设计，图书馆和深夜使用不打扰。人体工学握持，一节电池用一年。',
    price: 69,
    category: '办公学习',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80',
    stock: 192,
    discount: 20,
    tags: ['热销', '限时优惠']
  }
];

module.exports = { products };

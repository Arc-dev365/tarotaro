// 塔罗牌数据库
export const tarotCards = [
  {
    id: 0,
    name: '愚者',
    nameEn: 'The Fool',
    arcana: 'major', // 大阿卡纳
    number: 0,
    img: '/static/tarot/major/0-愚者.jpg',
    keywords: ['开始', '冒险', '自发性', '纯真'],
    uprightMeaning: '新的开始，冒险，自发性，纯真，自由精神',
    reversedMeaning: '鲁莽，冒失，风险，愚蠢的选择',
    description: '愚者代表着新的开始和冒险。他站在悬崖边缘，象征着未知和可能性。他的行囊轻便，表示他不受过去的束缚。'
  },
  {
    id: 1,
    name: '魔术师',
    nameEn: 'The Magician',
    arcana: 'major',
    number: 1,
    img: '/static/tarot/major/01_Magician.jpg',
    keywords: ['创造力', '意志力', '技能', '行动'],
    uprightMeaning: '创造力，意志力，技能，行动，主动性',
    reversedMeaning: '操纵，欺骗，才能浪费，拖延',
    description: '魔术师代表着创造力和意志力。他的桌子上有四种元素的象征，表示他掌握了所有工具，可以将想法转化为现实。'
  },
  {
    id: 2,
    name: '女祭司',
    nameEn: 'The High Priestess',
    arcana: 'major',
    number: 2,
    img: '/static/tarot/major/RWS_Tarot_02_High_Priestess.jpg',
    keywords: ['直觉', '潜意识', '神秘', '内在知识'],
    uprightMeaning: '直觉，潜意识，神秘，内在知识，神圣女性',
    reversedMeaning: '秘密，断开连接，表面知识，恐惧未知',
    description: '女祭司代表着直觉和潜意识。她坐在两根柱子之间，象征着二元性和平衡。她的卷轴包含着神秘的知识。'
  },
  {
    id: 3,
    name: '女皇',
    nameEn: 'The Empress',
    arcana: 'major',
    number: 3,
    img: '/static/tarot/major/RWS_Tarot_03_Empress.jpg',
    keywords: ['丰饶', '母性', '创造', '自然'],
    uprightMeaning: '丰饶，母性，创造，自然，滋养',
    reversedMeaning: '依赖，过度保护，创造力阻塞，空虚',
    description: '女皇代表着丰饶和母性。她坐在舒适的环境中，周围是繁茂的自然，象征着创造力和生命力。'
  },
  {
    id: 4,
    name: '皇帝',
    nameEn: 'The Emperor',
    arcana: 'major',
    number: 4,
    img: '/static/tarot/major/RWS_Tarot_04_Emperor.jpg',
    keywords: ['权威', '结构', '控制', '父性'],
    uprightMeaning: '权威，结构，控制，父性，稳定',
    reversedMeaning: '专制，过度控制，刚性，固执',
    description: '皇帝代表着权威和结构。他坐在石头宝座上，象征着稳定和坚固的基础。他的姿态显示出控制和领导力。'
  },
  {
    id: 5,
    name: '教皇',
    nameEn: 'The Hierophant',
    arcana: 'major',
    number: 5,
    img: '/static/tarot/major/RWS_Tarot_05_Hierophant.jpg',
    keywords: ['传统', '精神指导', '遵从', '信仰'],
    uprightMeaning: '传统，精神指导，遵从，信仰，教育',
    reversedMeaning: '反叛，非传统，个人信仰，挑战权威',
    description: '教皇代表着传统和社会指导。他坐在宗教环境中，象征着制度化的信仰和教义。他的手势表示祝福和教导。'
  },
  {
    id: 6,
    name: '恋人',
    nameEn: 'The Lovers',
    arcana: 'major',
    number: 6,
    img: '/static/tarot/major/RWS_Tarot_06_Lovers.jpg',
    keywords: ['爱', '和谐', '关系', '价值观'],
    uprightMeaning: '爱，和谐，关系，价值观，选择',
    reversedMeaning: '不和谐，不平衡，价值观冲突，不良选择',
    description: '恋人代表着爱和关系。画面中的亚当和夏娃象征着二元性和选择。天使在上方祝福，表示神圣的联系。'
  },
  {
    id: 7,
    name: '战车',
    nameEn: 'The Chariot',
    arcana: 'major',
    number: 7,
    img: '/static/tarot/major/RWS_Tarot_07_Chariot.jpg',
    keywords: ['控制', '意志力', '胜利', '断言'],
    uprightMeaning: '控制，意志力，胜利，断言，决心',
    reversedMeaning: '自我怀疑，缺乏方向，侵略性',
    description: '战车代表着控制和意志力。驾驶者站立不动，通过意志控制着两只狮身兽，象征着通过内在力量克服障碍。'
  },
  {
    id: 8,
    name: '力量',
    nameEn: 'Strength',
    arcana: 'major',
    number: 8,
    img: '/static/tarot/major/RWS_Tarot_08_Strength.jpg',
    keywords: ['勇气', '说服', '影响', '耐心'],
    uprightMeaning: '勇气，说服，影响，耐心，内在力量',
    reversedMeaning: '自我怀疑，弱点，缺乏自信，原始冲动',
    description: '力量代表着勇气和内在力量。女性温柔地控制着狮子，象征着通过温和和耐心而非暴力来驾驭原始力量。'
  },
  {
    id: 9,
    name: '隐士',
    nameEn: 'The Hermit',
    arcana: 'major',
    number: 9,
    img: '/static/tarot/major/RWS_Tarot_09_Hermit.jpg',
    keywords: ['内省', '寻找', '指导', '孤独'],
    uprightMeaning: '内省，寻找，指导，孤独，内在智慧',
    reversedMeaning: '孤立，退缩，拒绝建议，不成熟',
    description: '隐士代表着内省和寻找。他站在山顶，举着灯，象征着在黑暗中寻找真理和智慧。他的姿态表示独处和沉思。'
  },
  {
    id: 10,
    name: '命运之轮',
    nameEn: 'Wheel of Fortune',
    arcana: 'major',
    number: 10,
    img: '/static/tarot/major/RWS_Tarot_10_Wheel_of_Fortune.jpg',
    keywords: ['命运', '转折点', '机会', '变化'],
    uprightMeaning: '命运，转折点，机会，变化，循环',
    reversedMeaning: '坏运气，阻力，打破循环，意外中断',
    description: '命运之轮代表着命运和变化。轮子不断旋转，象征着生活的起起落落和循环。四个角落的生物代表着四个元素和固定星座。'
  },
  {
    id: 11,
    name: '正义',
    nameEn: 'Justice',
    arcana: 'major',
    number: 11,
    img: '/static/tarot/major/RWS_Tarot_11_Justice.jpg',
    keywords: ['公正', '真相', '法律', '清晰'],
    uprightMeaning: '公正，真相，法律，清晰，因果',
    reversedMeaning: '不公正，不诚实，不平衡，缺乏责任',
    description: '正义代表着公正和真相。女性手持天平和剑，象征着平衡的判断和清晰的决断。她的姿态表示公正和不偏不倚。'
  },
  {
    id: 12,
    name: '倒吊人',
    nameEn: 'The Hanged Man',
    arcana: 'major',
    number: 12,
    img: '/static/tarot/major/RWS_Tarot_12_Hanged_Man.jpg',
    keywords: ['暂停', '放弃', '新视角', '牺牲'],
    uprightMeaning: '暂停，放弃，新视角，牺牲，转变',
    reversedMeaning: '拖延，抵抗，不必要的牺牲，依恋',
    description: '倒吊人代表着暂停和新视角。他倒挂在树上，但表情平静，象征着通过自愿的牺牲获得新的理解和智慧。'
  },
  {
    id: 13,
    name: '死神',
    nameEn: 'Death',
    arcana: 'major',
    number: 13,
    img: '/static/tarot/major/RWS_Tarot_13_Death.jpg',
    keywords: ['结束', '变化', '转变', '过渡'],
    uprightMeaning: '结束，变化，转变，过渡，释放',
    reversedMeaning: '抵抗变化，停滞，拒绝放手，恐惧转变',
    description: '死神代表着结束和转变。骷髅骑士象征着事物的结束，但同时也预示着新的开始。太阳在背景中升起，表示希望和重生。'
  },
  {
    id: 14,
    name: '节制',
    nameEn: 'Temperance',
    arcana: 'major',
    number: 14,
    img: '/static/tarot/major/RWS_Tarot_14_Temperance.jpg',
    keywords: ['平衡', '适度', '耐心', '调和'],
    uprightMeaning: '平衡，适度，耐心，调和，目的',
    reversedMeaning: '不平衡，过度，缺乏远见，冲突',
    description: '节制代表着平衡和适度。天使在两个杯子之间倒水，象征着调和和流动。一只脚在水中，一只脚在陆地上，表示在不同领域之间找到平衡。'
  },
  {
    id: 15,
    name: '恶魔',
    nameEn: 'The Devil',
    arcana: 'major',
    number: 15,
    img: '/static/tarot/major/RWS_Tarot_15_Devil.jpg',
    keywords: ['束缚', '物质主义', '欲望', '阴影'],
    uprightMeaning: '束缚，物质主义，欲望，阴影面，依赖',
    reversedMeaning: '释放，摆脱束缚，恢复控制，面对恐惧',
    description: '恶魔代表着束缚和物质主义。恶魔站在祭坛上，下方是被锁链束缚的人，象征着我们被自己的欲望和恐惧所束缚。'
  },
  {
    id: 16,
    name: '塔',
    nameEn: 'The Tower',
    arcana: 'major',
    number: 16,
    img: '/static/tarot/major/RWS_Tarot_16_Tower.jpg',
    keywords: ['突变', '混乱', '启示', '觉醒'],
    uprightMeaning: '突变，混乱，启示，觉醒，真相',
    reversedMeaning: '避免灾难，延迟变化，恐惧变化',
    description: '塔代表着突变和混乱。闪电击中高塔，人们从中坠落，象征着突然的变化和旧结构的崩塌，但也带来了新的认识和自由。'
  },
  {
    id: 17,
    name: '星星',
    nameEn: 'The Star',
    arcana: 'major',
    number: 17,
    img: '/static/tarot/major/RWS_Tarot_17_Star.jpg',
    keywords: ['希望', '信念', '目的', '更新'],
    uprightMeaning: '希望，信念，目的，更新，灵感',
    reversedMeaning: '绝望，失去信心，沮丧，不灵感',
    description: '星星代表着希望和信念。女性跪在水边，一只脚在水中，一只脚在陆地上，象征着物质和精神的平衡。星星在上方闪耀，表示指引和灵感。'
  },
  {
    id: 18,
    name: '月亮',
    nameEn: 'The Moon',
    arcana: 'major',
    number: 18,
    img: '/static/tarot/major/RWS_Tarot_18_Moon.jpg',
    keywords: ['幻觉', '恐惧', '焦虑', '潜意识'],
    uprightMeaning: '幻觉，恐惧，焦虑，潜意识，不确定',
    reversedMeaning: '恐惧释放，清晰，误解，混乱',
    description: '月亮代表着幻觉和潜意识。月光照耀着不确定的道路，狗和狼在嚎叫，象征着我们内心的恐惧和本能。小龙虾从水中爬出，表示从潜意识中浮现的内容。'
  },
  {
    id: 19,
    name: '太阳',
    nameEn: 'The Sun',
    arcana: 'major',
    number: 19,
    img: '/static/tarot/major/RWS_Tarot_19_Sun.jpg',
    keywords: ['快乐', '活力', '成功', '真相'],
    uprightMeaning: '快乐，活力，成功，真相，清晰',
    reversedMeaning: '暂时的抑郁，缺乏清晰，过度 optimistic',
    description: '太阳代表着快乐和活力。太阳明亮地照耀着，孩子骑在白马上，象征着纯真和自由的喜悦。向日葵代表着生命力和成长。'
  },
  {
    id: 20,
    name: '审判',
    nameEn: 'Judgement',
    arcana: 'major',
    number: 20,
    img: '/static/tarot/major/RWS_Tarot_20_Judgement.jpg',
    keywords: ['重生', '内在呼唤', '释放', '觉醒'],
    uprightMeaning: '重生，内在呼唤，释放，觉醒，反思',
    reversedMeaning: '自我怀疑，拒绝呼唤，缺乏自我反思',
    description: '审判代表着重生和觉醒。天使吹响号角，人们从棺材中复活，象征着对更高目的的觉醒和过去的释放。'
  },
  {
    id: 21,
    name: '世界',
    nameEn: 'The World',
    arcana: 'major',
    number: 21,
    img: '/static/tarot/major/RWS_Tarot_21_World.jpg',
    keywords: ['完成', '整合', '成就', '旅程'],
    uprightMeaning: '完成，整合，成就，旅程，和谐',
    reversedMeaning: '未完成，短缺，延迟，缺乏整合',
    description: '世界代表着完成和整合。女性在花环中跳舞，四个角落的生物象征着四个元素和固定星座。这张牌表示一个周期的完成和新周期的开始。'
  }
  // 小阿尔卡纳牌将在后续添加
];

// 塔罗牌牌阵解释
export const spreadTypes = {
  threeCard: {
    name: '三张牌阵',
    description: '最基本的牌阵之一，三张牌可以代表过去、现在和未来，或者问题、行动和结果。',
    positions: [
      { id: 0, name: '第一张牌', meaning: '代表过去或问题的根源' },
      { id: 1, name: '第二张牌', meaning: '代表现在或当前的情况' },
      { id: 2, name: '第三张牌', meaning: '代表未来或可能的结果' }
    ]
  },
  // 可以添加更多牌阵类型
};

// 塔罗牌解读辅助函数
export const interpretCards = (cards, spreadType, question = '') => {
  // 这里是一个简单的解读逻辑，实际项目中可能需要更复杂的算法或AI接入
  let interpretation = '';
  
  if (spreadType === 'threeCard') {
    interpretation += `基于您的问题"${question || '今日运势'}",以下是三张牌的解读：\n\n`;
    
    // 第一张牌解读
    interpretation += `${spreadTypes.threeCard.positions[0].name}（${cards[0].name}）：\n`;
    interpretation += `${cards[0].uprightMeaning}\n\n`;
    
    // 第二张牌解读
    interpretation += `${spreadTypes.threeCard.positions[1].name}（${cards[1].name}）：\n`;
    interpretation += `${cards[1].uprightMeaning}\n\n`;
    
    // 第三张牌解读
    interpretation += `${spreadTypes.threeCard.positions[2].name}（${cards[2].name}）：\n`;
    interpretation += `${cards[2].uprightMeaning}\n\n`;
    
    // 综合解读
    interpretation += `综合解读：\n`;
    interpretation += `这三张牌共同表明...（这里需要更复杂的逻辑或AI接入来生成综合解读）`;
  }
  
  return interpretation;
};

// 随机抽取指定数量的塔罗牌
/**
 * 随机抽取指定数量的塔罗牌
 * @param {Number} count - 要抽取的牌数量
 * @param {Array} excludeIds - 要排除的牌ID
 * @param {String} arcanaType - 牌的类型，可选值：'all'(所有牌), 'major'(大阿尔卡纳), 'minor'(小阿尔卡纳)
 * @returns {Array} - 抽取的牌数组
 */
export const drawRandomCards = (count = 3, excludeIds = [], arcanaType = 'all') => {
  // 根据类型过滤牌
  let filteredCards = tarotCards;
  
  if (arcanaType === 'major') {
    // 只抽取大阿尔卡纳牌
    filteredCards = tarotCards.filter(card => card.arcana === 'major');
  } else if (arcanaType === 'minor') {
    // 只抽取小阿尔卡纳牌
    filteredCards = tarotCards.filter(card => card.arcana === 'minor');
  }
  
  // 过滤掉已经抽取的牌
  const availableCards = filteredCards.filter(card => !excludeIds.includes(card.id));
  
  // 洗牌 - 使用Fisher-Yates算法进行更彻底的洗牌
  const shuffled = [...availableCards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // 抽取指定数量的牌
  const drawnCards = shuffled.slice(0, count);
  
  // 为每张牌添加正逆位
  return drawnCards.map(card => {
    // 为每张牌单独判断正逆位，50%概率正位，50%概率逆位
    // 使用更强的随机性方法，确保每张牌的正逆位真正独立
    // 添加时间戳和卡牌ID作为额外的随机因子
    const randomSeed = Date.now() + Math.random() + card.id;
    const isUpright = (Math.sin(randomSeed) + 1) / 2 > 0.5;
    
    return {
      ...card,
      isUpright,
      // 根据正逆位选择对应的含义
      meaning: isUpright ? card.uprightMeaning : card.reversedMeaning,
      // 添加显示名称，逆位时添加"逆位"标识
      displayName: isUpright ? card.name : `${card.name}（逆位）`
      // 移除imgStyle属性，改为在组件中通过CSS类控制旋转
    };
  });
};
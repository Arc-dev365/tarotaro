/**
 * 模拟塔罗牌解读服务
 * 用于前端生成塔罗牌解读，不依赖外部API
 */

/**
 * 生成塔罗牌解读
 * @param {Array} cards - 抽取的塔罗牌数组
 * @param {String} spreadType - 牌阵类型
 * @param {String} question - 用户问题（可选）
 * @param {String} type - 塔罗类型（'daily', 'quick', 'custom'）
 * @param {Function} onProgress - 流式输出回调函数（可选）
 * @returns {Promise<String>} - 返回生成的塔罗牌解读
 */
export const generateTarotReading = async (cards, spreadType, question = '', type = 'daily', onProgress) => {
  console.log(`开始生成塔罗牌解读: 类型=${type}, 牌阵=${spreadType}, 问题=${question || '无'}`);
  console.log('抽取的牌:', cards.map(card => card.name).join(', '));
  
  // 构建解读文本
  let reading = '';
  
  // 根据解读类型设置标题
  if (type === 'daily') {
    reading += `**今日塔罗解读**\n\n`;
  } else if (type === 'quick') {
    reading += `**快速塔罗解读**\n\n`;
  } else if (type === 'custom') {
    reading += `**定向塔罗解读: ${question}**\n\n`;
  }
  
  // 模拟流式输出
  if (typeof onProgress === 'function') {
    onProgress(reading);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 添加每张牌的解读
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    let position = '';
    
    // 根据解读类型确定位置名称
    if (type === 'daily' || type === 'quick') {
      position = i === 0 ? '过去/问题根源' : i === 1 ? '现在/当前情况' : '未来/可能结果';
    } else if (type === 'custom') {
      position = i === 0 ? '当前状况' : i === 1 ? '障碍或助力' : '建议或结果';
    }
    
    reading += `**${position} - ${card.name}**\n\n`;
    reading += `${card.name}代表着${getRandomMeaning(card.name)}。在${position}的位置，它${card.isUpright ? '正位' : '逆位'}显示${getRandomAdvice(position, card.isUpright)}。\n\n`;
    
    // 模拟流式输出
    if (typeof onProgress === 'function') {
      onProgress(reading);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // 添加牌与牌之间的关系分析
  reading += `**牌与牌之间的关系分析**\n\n`;
  reading += `${cards[0].name}与${cards[1].name}的组合显示，你的过去经历正在影响当前的情况。${cards.length > 2 ? `而${cards[2].name}则预示着可能的未来发展方向。` : ''}\n\n`;
  
  // 模拟流式输出
  if (typeof onProgress === 'function') {
    onProgress(reading);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 添加综合解读和建议
  reading += `**综合解读和建议**\n\n`;
  
  if (type === 'daily') {
    reading += `今天是充满${getRandomSituation()}的一天。过去的经验已经为你奠定了基础，现在的情况虽有挑战但也蕴含机会，未来的发展取决于你今天的选择。保持积极的心态，相信自己的直觉，今天将会是富有成效的一天。\n\n`;
  } else if (type === 'quick') {
    reading += `近期你可能会经历${getRandomSituation()}。这段时间里，重要的是保持平衡和专注，不要被短期的困难所干扰。接下来的发展将取决于你如何应对当前的挑战和机遇。\n\n`;
  } else if (type === 'custom') {
    reading += `关于"${question}"，这三张牌共同表明，你正处于一个${getRandomSituation()}的阶段。当前的情况需要你${getRandomAdvice('建议', true)}，未来的发展将会${getRandomOutcome()}。\n\n`;
  }
  
  // 模拟流式输出
  if (typeof onProgress === 'function') {
    onProgress(reading);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 添加具体建议
  reading += `**具体建议**\n\n`;
  reading += `1. ${getRandomAdvice('建议', true)}\n`;
  reading += `2. ${getRandomAdvice('建议', true)}\n`;
  reading += `3. ${getRandomAdvice('建议', true)}\n`;
  
  // 模拟流式输出
  if (typeof onProgress === 'function') {
    onProgress(reading);
  }
  
  return reading;
};

/**
 * 获取随机含义
 * @private
 */
const getRandomMeaning = (cardName) => {
  const meanings = [
    '内在力量和潜能',
    '转变和新的开始',
    '智慧和内在的声音',
    '稳定和物质基础',
    '选择和决策时刻',
    '和谐与平衡',
    '成功和成就',
    '内在的平静和满足'
  ];
  return meanings[Math.floor(Math.random() * meanings.length)];
};

/**
 * 获取随机建议
 * @private
 */
const getRandomAdvice = (position, isUpright = true) => {
  const positiveAdvices = [
    '保持开放的心态，接受新的可能性',
    '相信自己的直觉和判断',
    '关注当下，不要过分担忧未来',
    '寻求平衡，不要走向极端',
    '勇敢面对挑战，这将带来成长',
    '与重要的人保持沟通和联系',
    '给自己一些时间和空间进行反思',
    '采取具体行动，而不仅仅是计划'
  ];
  
  const negativeAdvices = [
    '注意不要过于冲动或鲁莽',
    '避免过度分析导致的犹豫不决',
    '警惕可能的误导或欺骗',
    '不要忽视重要的细节或警告信号',
    '避免过度依赖他人的意见',
    '注意不要陷入消极思维模式',
    '避免逃避责任或困难情况',
    '不要让过去的失败阻碍你前进'
  ];
  
  const advices = isUpright ? positiveAdvices : negativeAdvices;
  return advices[Math.floor(Math.random() * advices.length)];
};

/**
 * 获取随机情境
 * @private
 */
const getRandomSituation = () => {
  const situations = [
    '转变和成长',
    '反思和内省',
    '决策和选择',
    '稳定和巩固',
    '挑战和机遇并存',
    '收获和成就'
  ];
  return situations[Math.floor(Math.random() * situations.length)];
};

/**
 * 获取随机结果
 * @private
 */
const getRandomOutcome = () => {
  const outcomes = [
    '带来新的机会和可能性',
    '帮助你做出重要决定',
    '让你收获之前努力的成果',
    '虽有挑战，但最终会有所收获',
    '引导你发现新的方向和目标',
    '帮助你与重要的人建立更深层次的联系'
  ];
  return outcomes[Math.floor(Math.random() * outcomes.length)];
};

// 同时提供默认导出和命名导出，保持兼容性
const mockReadingService = {
  generateTarotReading
};

export default mockReadingService;
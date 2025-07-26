/**
 * 通义千问API服务
 * 用于生成塔罗牌解读
 */

// 通义千问API配置
const QIANWEN_API_KEY = 'sk-a062a77e63754101845860d5a53abce3';
// 使用兼容模式的新endpoint
const QIANWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const MODEL_NAME = 'qwen-plus'; // 使用通义千问Plus模型

/**
 * 创建节流版本的回调函数，减少UI更新频率
 * @private
 */
const createThrottledCallback = (callback, delay = 100) => {
  let lastCall = 0;
  let timeoutId = null;
  let lastText = '';
  
  return (text) => {
    const now = Date.now();
    lastText = text;
    
    // 如果是第一次调用或者已经超过延迟时间，立即更新
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(text);
    } else {
      // 否则设置一个定时器，在延迟结束后更新
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        callback(lastText);
      }, delay);
    }
  };
};

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
  
  // 构建提示词
  const prompt = buildPrompt(cards, spreadType, question, type);
  
  try {
    // 如果没有API密钥，抛出错误
    if (!QIANWEN_API_KEY) {
      console.error('未找到通义千问API密钥');
      throw new Error('未找到通义千问API密钥，请配置API密钥');
    }
    
    // 使用节流版本的回调函数，减少UI更新频率
    const throttledCallback = typeof onProgress === 'function' 
      ? createThrottledCallback(onProgress, 80) // 80ms的节流延迟
      : null;
    
    // 调用通义千问API
    return await callQianwenAPI(prompt, throttledCallback);
  } catch (error) {
    console.error('通义千问API调用失败:', error);
    // 抛出错误，不使用备用解读
    throw new Error(`通义千问API调用失败: ${error.message}`);
  }
};

/**
 * 构建提示词
 * @private
 */
const buildPrompt = (cards, spreadType, question, type) => {
  // 构建牌面信息
  const cardsInfo = cards.map((card, index) => {
    let position = '';
    
    // 根据解读类型确定位置名称
    if (type === 'daily' || type === 'quick') {
      position = index === 0 ? '过去/问题根源' : index === 1 ? '现在/当前情况' : '未来/可能结果';
    } else if (type === 'custom') {
      position = index === 0 ? '当前状况' : index === 1 ? '障碍或助力' : '建议或结果';
    }
    
    return `${position}: ${card.name}(${card.isUpright ? '正位' : '逆位'}) - ${card.isUpright ? card.uprightMeaning : card.reversedMeaning}`;
  }).join('\n');
  
  // 获取关键词
  let keyword = '';
  if (type === 'daily') {
    keyword = '今日';
  } else if (type === 'quick') {
    keyword = '生活';
  } else if (type === 'custom') {
    keyword = question;
  }
  
  // 构建提示词
  let prompt = '';
  
  if (type === 'daily') {
    prompt = `请你作为一位专业的塔罗牌解读师，使用通义千问-Plus模型为我解读今日塔罗牌。我抽到了以下三张牌:\n${cardsInfo}\n\n请详细解释每张牌在其位置上的含义，分别解释每张牌代表的含义并且分析不同牌面之间的关系，结合关键词「${keyword}」进行综合分析和占卜。解读应包括:\n1. 每张牌的详细含义和象征\n2. 牌在特定位置的深度解读\n3. 三张牌之间的关联性和互动关系分析\n4. 对今日的综合解读、占卜结果和相关建议\n\n请在输出文字中适当加入🔮✨🌙⭐️🌟等小图标增加时尚感，并使用Markdown格式，包括标题和分段。`;
  } else if (type === 'quick') {
    prompt = `请你作为一位专业的塔罗牌解读师，使用通义千问-Plus模型为我进行快速塔罗解读。我抽到了以下三张牌:\n${cardsInfo}\n\n请详细解释每张牌在其位置上的含义，分别解释每张牌代表的含义并且分析不同牌面之间的关系，结合关键词「${keyword}」进行综合分析和占卜。解读应包括:\n1. 每张牌的详细含义和象征\n2. 牌在特定位置的深度解读\n3. 三张牌之间的关联性和互动关系分析\n4. 近期的综合解读、占卜结果和相关建议\n\n请在输出文字中适当加入🔮✨🌙⭐️🌟等小图标增加时尚感，并使用Markdown格式，包括标题和分段。`;
  } else if (type === 'custom') {
    prompt = `请你作为一位专业的塔罗牌解读师，使用通义千问-Plus模型为我解答以下问题: "${question}"。我抽到了以下三张牌:\n${cardsInfo}\n\n请详细解释每张牌在其位置上的含义，分别解释每张牌代表的含义并且分析不同牌面之间的关系，结合用户提供的问题/关键词进行综合分析和占卜。解读应包括:\n1. 每张牌的详细含义和象征\n2. 牌在特定位置的深度解读\n3. 三张牌之间的关联性和互动关系分析\n4. 针对问题的综合解读、占卜结果和相关建议\n\n请在输出文字中适当加入🔮✨🌙⭐️🌟等小图标增加时尚感，并使用Markdown格式，包括标题和分段。`;
  }
  
  return prompt;
};

/**
 * 调用通义千问API
 * @private
 */
const callQianwenAPI = async (prompt, onProgress) => {
  // 构建请求参数 - 使用兼容模式格式
  const requestBody = {
    model: MODEL_NAME,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    stream: true, // 启用流式输出
    max_tokens: 2000 // 设置较大的输出长度以确保完整解读
  };
  
  try {
    // 使用性能监控工具
    performanceMonitor.start('API调用');
    
    // 如果需要流式输出
    if (typeof onProgress === 'function') {
      const result = await streamQianwenAPI(requestBody, onProgress);
      performanceMonitor.end('API调用');
      return result;
    } else {
      // 非流式输出 - 禁用流式以获取完整响应
      requestBody.stream = false;
      
      console.log('开始非流式调用通义千问API...');
      const response = await fetch(QIANWEN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${QIANWEN_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`通义千问API错误: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      // 兼容模式的响应格式
      const content = data.choices[0].message.content;
      
      const duration = performanceMonitor.end('API调用');
      console.log(`✅ 非流式API调用完成，响应长度: ${content.length}字符，耗时: ${duration}ms`);
      
      return content;
    }
  } catch (error) {
    performanceMonitor.end('API调用'); // 确保计时器被清理
    throw error; // 向上传递错误
  }
};

/**
 * 流式调用通义千问API
 * @private
 */
const streamQianwenAPI = async (requestBody, onProgress) => {
  let fullText = '';
  let chunkCount = 0;
  let firstChunkTime = 0;
  
  try {
    // 使用性能监控工具
    performanceMonitor.start('API请求');
    
    const response = await fetch(QIANWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QIANWEN_API_KEY}`
        // 兼容模式不需要X-DashScope-SSE头
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`通义千问API错误: ${errorData.error?.message || response.statusText}`);
    }
    
    const connectionTime = performanceMonitor.end('API请求');
    console.log(`🚀 API连接成功，耗时: ${connectionTime}ms`);
    
    // 开始监控流式输出
    performanceMonitor.start('流式输出');
    
    // 处理SSE流
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const jsonStr = line.slice(5).trim();
            if (jsonStr === '[DONE]') continue;
            
            const data = JSON.parse(jsonStr);
            // 兼容模式的响应格式
            if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
              chunkCount++;
              
              // 记录首个内容块的时间
              if (chunkCount === 1) {
                firstChunkTime = Date.now();
                console.log(`⚡ 首个内容块接收，耗时: ${firstChunkTime - performanceMonitor.startTimes['流式输出']}ms`);
              }
              
              const content = data.choices[0].delta.content;
              fullText += content;
              
              // 只有当回调函数存在时才调用
              if (typeof onProgress === 'function') {
                onProgress(fullText);
              }
            }
          } catch (e) {
            console.error('解析SSE数据失败:', e);
          }
        }
      }
    }
    
    const streamTime = performanceMonitor.end('流式输出');
    console.log(`✨ 流式输出完成，共接收${chunkCount}个内容块，总耗时: ${streamTime}ms`);
    return fullText;
  } catch (error) {
    console.error('流式调用通义千问API失败:', error);
    performanceMonitor.end('API请求'); // 确保计时器被清理
    performanceMonitor.end('流式输出'); // 确保计时器被清理
    throw error;
  }
};

// 导入独立的性能监控工具
import performanceMonitor from './performance-monitor.js';

// 同时提供默认导出和命名导出，保持兼容性
const qianwenService = {
  generateTarotReading,
  // 导出性能监控工具，方便在组件中使用
  performanceMonitor
};

export default qianwenService;
export { performanceMonitor };
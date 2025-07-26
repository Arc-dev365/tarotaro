/**
 * 通义千问API服务
 * 用于生成塔罗牌解读
 */

// 导入性能监控工具
import performanceMonitor from './performance-monitor.js';
// 导入千问服务
import qianwenService from './qianwen-service.js';
// 导入模拟解读服务作为备选
import mockReadingService from './mock-reading-service.js';
// 导入网络请求适配器
import { adaptedFetch } from './fetch-adapter.js';
// 导入SSE适配器
import { sseAdapter } from './sse-adapter.js';

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

// 通义千问API配置
// 直接硬编码API密钥，解决密钥无法正确读取的问题
const QIANWEN_API_KEY = 'sk-a062a77e63754101845860d5a53abce3';
// 使用兼容模式的新endpoint
const QIANWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const MODEL_NAME = 'qwen-plus'; // 使用通义千问Plus模型

/**
 * 生成塔罗牌AI深度解读
 * @param {Array} cards - 抽取的塔罗牌数组
 * @param {String} spreadType - 牌阵类型
 * @param {String} question - 用户问题（可选）
 * @param {String} type - 塔罗类型（'daily', 'quick', 'custom'）
 * @param {String} baseReading - 基础解读结果
 * @param {Function} onProgress - 流式输出回调函数（可选）
 * @returns {Promise<String>} - 返回生成的AI深度解读
 */
export const generateAIInsight = async (cards, spreadType, question = '', type = 'daily', baseReading = '', onProgress) => {
  console.log(`开始生成AI深度解读: 类型=${type}, 牌阵=${spreadType}, 问题=${question || '无'}`);
  console.log('抽取的牌:', cards.map(card => card.name).join(', '));
  
  // 构建提示词
  const prompt = buildInsightPrompt(cards, spreadType, question, type, baseReading);
  
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
    
    // 使用性能监控工具
    performanceMonitor.start('AI深度解读');
    
    try {
      // 尝试调用通义千问API
      const result = await callQianwenAPI(prompt, throttledCallback);
      
      // 记录性能数据
      const duration = performanceMonitor.end('AI深度解读');
      console.log(`✅ AI深度解读生成完成，总耗时: ${duration}ms，内容长度: ${result.length}字符`);
      
      return result;
    } catch (apiError) {
      console.error('通义千问API调用失败，使用本地模拟服务作为备选:', apiError);
      
      // 使用本地模拟服务作为备选
      console.log('使用本地模拟服务生成AI深度解读...');
      const mockResult = await mockReadingService.generateTarotReading(
        cards,
        spreadType,
        question,
        type,
        throttledCallback
      );
      
      // 记录性能数据
      const duration = performanceMonitor.end('AI深度解读');
      console.log(`✅ 本地模拟AI深度解读生成完成，总耗时: ${duration}ms，内容长度: ${mockResult.length}字符`);
      
      return mockResult;
    }
  } catch (error) {
    console.error('AI深度解读生成失败:', error);
    // 确保即使出错也结束计时
    performanceMonitor.end('AI深度解读');
    // 抛出错误
    throw new Error(`AI深度解读生成失败: ${error.message}`);
  }
};

/**
 * 构建AI深度解读提示词
 * @private
 */
const buildInsightPrompt = (cards, spreadType, question, type, baseReading) => {
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
  
  // 基础解读内容
  const readingContent = baseReading ? `基础解读内容：\n${baseReading}\n\n` : '';
  
  console.log(`构建AI深度解读提示词: 类型=${type}, 牌阵=${spreadType}, 问题=${keyword || '无'}`);
  
  if (type === 'daily') {
    prompt = `请你作为一位专业的塔罗牌解读师和心理学专家，使用通义千问-Plus模型为我提供今日塔罗牌的深度AI解读。我抽到了以下三张牌:\n${cardsInfo}\n\n${readingContent}请基于以上信息，提供更深层次的心理学和象征意义分析，包括：\n1. 从心理学角度分析这些牌面组合反映的潜意识状态\n2. 提供更具体的行动建议和自我提升方向\n3. 分析可能面临的挑战和如何克服\n4. 提供一个简短的冥想或反思练习，帮助我更好地应用这个解读\n\n请使用专业但易于理解的语言，在输出文字中适当加入🧠💭🌈✨等小图标增加可读性，并使用Markdown格式，包括标题和分段。`;
  } else if (type === 'quick') {
    prompt = `请你作为一位专业的塔罗牌解读师和心理学专家，使用通义千问-Plus模型为我提供生活问题的深度AI解读。我抽到了以下三张牌:\n${cardsInfo}\n\n${readingContent}请基于以上信息，提供更深层次的心理学和象征意义分析，包括：\n1. 从心理学角度分析这些牌面组合反映的潜意识状态\n2. 提供更具体的行动建议和自我提升方向\n3. 分析可能面临的挑战和如何克服\n4. 提供一个简短的冥想或反思练习，帮助我更好地应用这个解读\n\n请使用专业但易于理解的语言，在输出文字中适当加入🧠💭🌈✨等小图标增加可读性，并使用Markdown格式，包括标题和分段。`;
  } else if (type === 'custom') {
    prompt = `请你作为一位专业的塔罗牌解读师和心理学专家，使用通义千问-Plus模型为我提供关于"${question}"的深度AI解读。我抽到了以下三张牌:\n${cardsInfo}\n\n${readingContent}请基于以上信息，提供更深层次的心理学和象征意义分析，包括：\n1. 从心理学角度分析这些牌面组合反映的潜意识状态\n2. 提供更具体的行动建议和自我提升方向\n3. 分析可能面临的挑战和如何克服\n4. 提供一个简短的冥想或反思练习，帮助我更好地应用这个解读\n\n请使用专业但易于理解的语言，在输出文字中适当加入🧠💭🌈✨等小图标增加可读性，并使用Markdown格式，包括标题和分段。`;
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
    performanceMonitor.start('AI解读API调用');
    
    // 如果需要流式输出
    if (typeof onProgress === 'function') {
      const result = await streamQianwenAPI(requestBody, onProgress);
      performanceMonitor.end('AI解读API调用');
      return result;
    } else {
      // 非流式输出 - 禁用流式以获取完整响应
      requestBody.stream = false;
      
      console.log('开始非流式调用通义千问API...');
      const response = await adaptedFetch(QIANWEN_API_URL, {
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
      
      const duration = performanceMonitor.end('AI解读API调用');
      console.log(`✅ 非流式API调用完成，响应长度: ${content.length}字符，耗时: ${duration}ms`);
      
      return content;
    }
  } catch (error) {
    performanceMonitor.end('AI解读API调用'); // 确保计时器被清理
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
    performanceMonitor.start('AI解读API请求');
    
    // 使用SSE适配器处理流式响应
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QIANWEN_API_KEY}`
        // 兼容模式不需要X-DashScope-SSE头
      },
      body: JSON.stringify(requestBody)
    };
    
    // 开始监控流式输出
    performanceMonitor.start('AI解读流式输出');
    
    // 使用SSE适配器处理流式响应
    const task = await sseAdapter.handleStreamResponse(
      QIANWEN_API_URL,
      options,
      (data) => {
        // 处理接收到的消息
        try {
          // 兼容模式的响应格式
          if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
            chunkCount++;
            
            // 记录首个内容块的时间
            if (chunkCount === 1) {
              firstChunkTime = Date.now();
              const connectionTime = performanceMonitor.end('AI解读API请求');
              console.log(`🚀 AI解读API连接成功，耗时: ${connectionTime}ms`);
              console.log(`⚡ 首个AI解读内容块接收，耗时: ${firstChunkTime - performanceMonitor.startTimes['AI解读流式输出']}ms`);
            }
            
            const content = data.choices[0].delta.content;
            fullText += content;
            
            // 只有当回调函数存在时才调用
            if (typeof onProgress === 'function') {
              onProgress(fullText);
            }
          }
        } catch (e) {
          console.error('处理SSE消息失败:', e);
        }
      },
      (error) => {
        // 处理错误
        console.error('SSE流处理错误:', error);
        performanceMonitor.end('AI解读API请求'); // 确保计时器被清理
        performanceMonitor.end('AI解读流式输出'); // 确保计时器被清理
      },
      () => {
        // 处理完成
        const streamTime = performanceMonitor.end('AI解读流式输出');
        console.log(`✨ AI解读流式输出完成，共接收${chunkCount}个内容块，总耗时: ${streamTime}ms`);
      }
    );
    
    // 等待一段时间，确保所有数据都已处理
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return fullText;
  } catch (error) {
    console.error('流式调用通义千问API失败:', error);
    performanceMonitor.end('AI解读API请求'); // 确保计时器被清理
    performanceMonitor.end('AI解读流式输出'); // 确保计时器被清理
    throw error;
  }
};

// 同时提供默认导出和命名导出，保持兼容性
const aiInsightService = {
  generateAIInsight
};

export default aiInsightService;
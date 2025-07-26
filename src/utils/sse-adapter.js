/**
 * SSE (Server-Sent Events) 适配器
 * 用于在不同环境下统一处理流式响应
 */

import { adaptedFetch } from './fetch-adapter.js';

/**
 * 创建SSE适配器
 * 在微信小程序环境下使用特殊处理来模拟SSE
 * 在其他环境下使用标准的fetch + ReadableStream处理
 */
export const createSSEAdapter = () => {
  // 判断是否在微信小程序环境
  const isWxMp = process.env.UNI_PLATFORM === 'mp-weixin';
  
  /**
   * 处理流式响应
   * @param {String} url - 请求URL
   * @param {Object} options - 请求选项
   * @param {Function} onMessage - 消息处理回调
   * @param {Function} onError - 错误处理回调
   * @param {Function} onComplete - 完成处理回调
   */
  const handleStreamResponse = async (url, options, onMessage, onError, onComplete) => {
    try {
      if (isWxMp) {
        console.log('使用微信小程序适配的SSE处理');
        
        // 微信小程序环境下，使用特殊处理
        const task = uni.request({
          url,
          method: options.method || 'POST',
          header: options.headers || {},
          data: options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : undefined,
          enableChunked: true, // 启用分块传输
          enableHttp2: true,   // 启用HTTP/2
          timeout: 30000,      // 设置较长的超时时间
          success: (res) => {
            // 成功回调通常不会被调用，因为我们使用了分块传输
            console.log('SSE请求成功完成');
            if (onComplete) onComplete();
          },
          fail: (err) => {
            console.error('SSE请求失败:', err);
            if (onError) onError(new Error(err.errMsg || '网络请求失败'));
          },
          complete: () => {
            console.log('SSE请求完成');
            if (onComplete) onComplete();
          }
        });
        
        // 监听数据返回事件
        if (task && task.onChunkReceived) {
          task.onChunkReceived((res) => {
            try {
              if (res && res.data) {
                // 处理接收到的数据块
                const chunk = res.data;
                const textDecoder = new TextDecoder();
                const text = textDecoder.decode(new Uint8Array(chunk));
                
                // 处理SSE格式数据
                const lines = text.split('\n').filter(line => line.trim() !== '');
                
                for (const line of lines) {
                  if (line.startsWith('data:')) {
                    try {
                      const jsonStr = line.slice(5).trim();
                      if (jsonStr === '[DONE]') continue;
                      
                      const data = JSON.parse(jsonStr);
                      if (onMessage) onMessage(data);
                    } catch (e) {
                      console.error('解析SSE数据失败:', e, line);
                    }
                  }
                }
              }
            } catch (error) {
              console.error('处理数据块失败:', error);
              if (onError) onError(error);
            }
          });
        } else {
          console.error('当前微信小程序版本不支持分块传输');
          if (onError) onError(new Error('当前微信小程序版本不支持分块传输'));
        }
        
        return task;
      } else {
        // 其他环境下使用标准fetch + ReadableStream处理
        console.log('使用标准fetch处理SSE');
        
        const response = await adaptedFetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log('SSE流结束');
            if (onComplete) onComplete();
            break;
          }
          
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          // 处理SSE格式数据
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // 保留最后一行，可能是不完整的
          
          for (const line of lines) {
            if (line.trim() === '') continue;
            
            if (line.startsWith('data:')) {
              try {
                const jsonStr = line.slice(5).trim();
                if (jsonStr === '[DONE]') continue;
                
                const data = JSON.parse(jsonStr);
                if (onMessage) onMessage(data);
              } catch (e) {
                console.error('解析SSE数据失败:', e, line);
              }
            }
          }
        }
        
        return { abort: () => reader.cancel() };
      }
    } catch (error) {
      console.error('SSE处理失败:', error);
      if (onError) onError(error);
      if (onComplete) onComplete();
      return { abort: () => {} };
    }
  };
  
  return { handleStreamResponse };
};

// 创建并导出SSE适配器实例
export const sseAdapter = createSSEAdapter();

// 默认导出
export default sseAdapter;
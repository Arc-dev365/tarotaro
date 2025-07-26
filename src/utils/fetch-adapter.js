/**
 * fetch适配器
 * 用于在不同环境下统一网络请求接口
 */

/**
 * 创建适配后的fetch函数
 * 在微信小程序环境下使用uni.request实现fetch功能
 * 在其他环境下使用原生fetch
 */
const createFetch = () => {
  // 判断是否在微信小程序环境
  const isWxMp = process.env.UNI_PLATFORM === 'mp-weixin';
  
  // 如果在微信小程序环境，使用uni.request实现fetch
  if (isWxMp) {
    console.log('使用微信小程序适配的fetch');
    
    return async (url, options = {}) => {
      return new Promise((resolve, reject) => {
        // 构建请求参数
        const requestOptions = {
          url,
          method: options.method || 'GET',
          header: options.headers || {},
          data: options.body,
          timeout: 10000, // 设置超时时间为10秒
          success: (res) => {
            // 构建类似fetch的Response对象
            const response = {
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              statusText: res.errMsg,
              headers: res.header,
              json: () => Promise.resolve(res.data),
              text: () => Promise.resolve(typeof res.data === 'string' ? res.data : JSON.stringify(res.data)),
              // 对于流式响应，提供一个模拟的body.getReader()
              body: {
                getReader: () => {
                  // 模拟ReadableStream的reader接口
                  let consumed = false;
                  return {
                    read: () => {
                      if (consumed) {
                        return Promise.resolve({ done: true, value: undefined });
                      }
                      consumed = true;
                      return Promise.resolve({
                        done: false,
                        value: new TextEncoder().encode(typeof res.data === 'string' ? res.data : JSON.stringify(res.data))
                      });
                    },
                    cancel: () => Promise.resolve()
                  };
                }
              }
            };
            resolve(response);
          },
          fail: (err) => {
            reject(new Error(err.errMsg || '网络请求失败'));
          }
        };
        
        // 发起请求
        uni.request(requestOptions);
      });
    };
  }
  
  // 在其他环境下使用原生fetch
  console.log('使用原生fetch');
  return fetch;
};

// 导出适配后的fetch函数
export const adaptedFetch = createFetch();

// 默认导出
export default adaptedFetch;
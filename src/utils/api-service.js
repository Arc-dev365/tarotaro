/**
 * API服务模块
 * 提供用户认证、数据获取等API接口
 */

// 模拟用户API服务
const userApi = {
  /**
   * 用户登录
   * @param {Object} loginData - 登录信息
   * @param {String} loginData.username - 用户名
   * @param {String} loginData.phone - 手机号
   * @param {String} loginData.password - 密码
   * @returns {Promise<Object>} - 返回登录结果
   */
  login: async (loginData) => {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟登录成功
    if ((loginData.username === 'admin' || loginData.phone === '13800138000') && loginData.password === '1234') {
      return {
        success: true,
        data: {
          userId: 'user_123456',
          username: loginData.username || '用户13800138000',
          token: 'mock_token_' + Date.now(),
          expiresIn: 7200
        }
      };
    }
    
    // 模拟登录失败
    return {
      success: false,
      message: '用户名或密码错误'
    };
  },
  
  /**
   * 用户注册
   * @param {Object} registerData - 注册信息
   * @param {String} registerData.username - 用户名
   * @param {String} registerData.phone - 手机号
   * @param {String} registerData.password - 密码
   * @returns {Promise<Object>} - 返回注册结果
   */
  register: async (registerData) => {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟注册成功
    return {
      success: true,
      data: {
        userId: 'user_' + Date.now(),
        username: registerData.username,
        token: 'mock_token_' + Date.now(),
        expiresIn: 7200
      }
    };
  },
  
  /**
   * 获取用户信息
   * @param {String} userId - 用户ID
   * @returns {Promise<Object>} - 返回用户信息
   */
  getUserInfo: async (userId) => {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟用户信息
    return {
      success: true,
      data: {
        userId: userId,
        username: '测试用户',
        phone: '138****8000',
        avatar: '/static/avatar.png',
        createdAt: '2023-01-01'
      }
    };
  }
};

// 导出API服务
export { userApi };
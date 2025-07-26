/**
 * 性能监控工具
 * 用于测量和记录应用中各个操作的性能数据
 */

/**
 * 性能监控对象
 * 提供开始计时、结束计时和获取耗时的功能
 */
const performanceMonitor = {
  // 存储各个标签的开始时间
  startTimes: {},
  
  /**
   * 开始计时
   * @param {String} label - 计时标签，用于标识不同的计时操作
   */
  start(label) {
    this.startTimes[label] = Date.now();
    console.log(`⏱️ [${label}] 开始计时`);
  },
  
  /**
   * 结束计时并返回耗时
   * @param {String} label - 计时标签，必须与start方法中使用的标签一致
   * @returns {Number} - 操作耗时（毫秒）
   */
  end(label) {
    if (!this.startTimes[label]) {
      console.warn(`⚠️ [${label}] 未找到开始时间`);
      return 0;
    }
    
    const duration = Date.now() - this.startTimes[label];
    console.log(`✅ [${label}] 完成，耗时: ${duration}ms`);
    delete this.startTimes[label];
    return duration;
  },
  
  /**
   * 获取当前耗时（不结束计时）
   * @param {String} label - 计时标签
   * @returns {Number} - 当前耗时（毫秒）
   */
  getCurrentDuration(label) {
    if (!this.startTimes[label]) {
      console.warn(`⚠️ [${label}] 未找到开始时间`);
      return 0;
    }
    
    return Date.now() - this.startTimes[label];
  },
  
  /**
   * 测量函数执行时间的包装器
   * @param {Function} fn - 要测量的函数
   * @param {String} label - 计时标签
   * @returns {Function} - 包装后的函数
   */
  measure(fn, label) {
    return async (...args) => {
      this.start(label);
      try {
        const result = await fn(...args);
        this.end(label);
        return result;
      } catch (error) {
        this.end(label);
        throw error;
      }
    };
  }
};

export default performanceMonitor;
import { defineStore } from 'pinia';
import { drawRandomCards } from '@/utils/tarot-data.js';
// 导入性能监控工具
import performanceMonitor from '@/utils/performance-monitor.js';
// 导入AI深度解读服务
import aiInsightService from '@/utils/ai-insight-service.js';

/**
 * 塔罗牌状态管理
 * 管理塔罗牌抽取、解读和历史记录
 */
export const useTarotStore = defineStore('tarot', {
  state: () => ({
    // 当前抽取的牌
    currentCards: [],
    // 当前解读结果
    currentReading: '',
    // 解读格式化后的富文本
    formattedReading: '',
    // 历史记录
    history: {},
    // 状态标志
    isDrawing: false,
    isReading: false,
    drawingProgress: 0,
    // 当前日期
    currentDate: '',
    // 是否已有今日解读
    hasTodayReading: false,
    // 刷新时间文本
    refreshTimeText: ''
  }),
  
  getters: {
    // 获取今日解读
    todayReading: (state) => {
      const today = new Date().toISOString().split('T')[0]; // 格式：YYYY-MM-DD
      return state.history[today] || null;
    },
    
    // 获取所有历史记录（按日期排序）
    sortedHistory: (state) => {
      return Object.entries(state.history)
        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
        .map(([date, reading]) => ({
          date,
          ...reading
        }));
    }
  },
  
  actions: {
    /**
     * 设置当前日期
     */
    setCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      this.currentDate = `${year}年${month}月${day}日`;
    },
    
    /**
     * 检查今日解读
     */
    checkTodayReading() {
      // 从本地存储加载历史记录
      this.loadHistory();
      
      // 恢复每日一次限制
      const today = new Date().toISOString().split('T')[0]; // 格式：YYYY-MM-DD
      
      if (this.history[today]) {
        this.hasTodayReading = true;
        this.calculateRefreshTime();
      } else {
        this.hasTodayReading = false;
      }
    },
    
    /**
     * 计算刷新时间
     */
    calculateRefreshTime() {
      // 计算距离明天0点的时间
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeRemaining = tomorrow - now;
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      
      this.refreshTimeText = `${hours}小时${minutes}分钟后可重新抽取`;
    },
    
    /**
     * 开始抽牌
     */
    async startDrawing() {
      if (this.isDrawing) return;
      
      // 暂时禁用每日一次限制，注释掉以下代码
      // if (this.hasTodayReading) {
      //   // 如果已有今日解读，直接显示结果
      //   const today = new Date().toISOString().split('T')[0];
      //   const todayReading = this.history[today];
      //   this.currentCards = todayReading.cards;
      //   this.currentReading = todayReading.reading;
      //   this.formatReading();
      //   return;
      // }
      
      this.isDrawing = true;
      this.drawingProgress = 0;
      this.currentCards = [];
      
      // 模拟抽牌过程
      return new Promise((resolve) => {
        const drawInterval = setInterval(() => {
          this.drawingProgress += 5;
          
          // 获取已抽取牌的ID列表，防止重复
          const drawnCardIds = this.currentCards.map(card => card.id);
          
          if (this.drawingProgress >= 33 && this.currentCards.length < 1) {
            // 抽第一张牌，只从大阿尔卡纳牌中抽取
            this.currentCards.push(this.drawMajorArcanaCard(drawnCardIds));
          } else if (this.drawingProgress >= 66 && this.currentCards.length < 2) {
            // 抽第二张牌，只从大阿尔卡纳牌中抽取
            this.currentCards.push(this.drawMajorArcanaCard(drawnCardIds));
          } else if (this.drawingProgress >= 100) {
            // 抽第三张牌，只从大阿尔卡纳牌中抽取
            this.currentCards.push(this.drawMajorArcanaCard(drawnCardIds));
            clearInterval(drawInterval);
            setTimeout(() => {
              this.isDrawing = false;
              resolve();
            }, 500);
          }
        }, 100);
      });
    },
    
    /**
     * 从大阿尔卡纳牌中抽取一张牌
     * @param {Array} excludeIds - 要排除的牌ID
     * @returns {Object} - 抽取的牌对象
     */
    drawMajorArcanaCard(excludeIds = []) {
      // 使用drawRandomCards函数，但过滤只保留大阿尔卡纳牌
      const card = drawRandomCards(1, excludeIds, 'major')[0];
      return card;
    },
    
    /**
     * 开始解读
     */
    async startReading() {
      this.isReading = true;
      this.currentReading = ''; // 清空之前的解读结果
      
      // 创建一个div元素用于显示流式输出
      this.formattedReading = '<div id="streaming-content"></div>';
      
      // 使用性能监控工具
      performanceMonitor.start('今日塔罗解读');
      
      // 显示初始加载状态
      this.formatReading(); // 立即格式化显示，即使是空内容
      
      try {
        // 使用后端AI服务生成解读
        console.log('正在使用后端AI服务生成解读...');
        
        // 使用后端AI服务生成解读
        const result = await aiInsightService.generateAIInsight(
          this.currentCards, 
          'threeCard', 
          '今日运势', 
          'daily', // 今日塔罗类型
          '', // 基础解读
          (streamText) => {
            // 更新解读结果
            this.currentReading = streamText;
            // 实时格式化并显示
            this.formatReading();
          }
        );
        
        // 检查结果是否为错误消息
        if (result && result.includes('很抱歉，解读生成失败')) {
          console.error('检测到错误消息:', result);
          throw new Error('后端AI服务生成解读失败');
        }
        
        // 记录性能数据
        const duration = performanceMonitor.end('今日塔罗解读');
        console.log(`✅ 今日塔罗解读生成完成，总耗时: ${duration}ms，内容长度: ${result.length}字符`);
        
        // 保存今日解读
        this.saveTodayReading();
        
        // 显示解读结果
        this.isReading = false;
      } catch (error) {
        console.error('后端AI服务生成解读失败:', error);
        
        // 结束性能监控
        performanceMonitor.end('今日塔罗解读');
        
        // 显示错误提示
        uni.showToast({
            title: `AI解读失败: ${error.message}`,
            icon: 'none',
            duration: 3000
          });
          
        // 重置状态
        this.currentReading = '';
        throw error; // 向上传递错误
      }
    },
    
    // 备用解读功能已移除
    
    /**
     * 格式化解读文本为富文本
     */
    formatReading() {
      // 使用性能监控工具
      performanceMonitor.start('格式化解读');
      
      // 将纯文本转换为富文本格式，支持更多Markdown语法
      if (!this.currentReading || this.currentReading.trim() === '') {
        // 显示一个空的div，但不显示加载文本，让TarotReading组件处理加载状态
        this.formattedReading = '<div id="streaming-content"></div>';
        performanceMonitor.end('格式化解读');
        return;
      }
      
      let formatted = this.currentReading
        // 处理标题 (# 文本)
        .replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
        // 处理粗体 (**文本**)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // 处理斜体 (*文本*)
        .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
        // 处理列表项 (数字列表)
        .replace(/^(\d+\.\s+)(.*?)$/gm, '<li>$2</li>')
        // 处理列表项 (无序列表)
        .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
        // 处理段落
        .replace(/\n\n/g, '</p><p>')
        // 处理换行
        .replace(/\n/g, '<br>');
      
      // 确保段落被正确包裹
      if (!formatted.startsWith('<h3>') && !formatted.startsWith('<p>')) {
        formatted = '<p>' + formatted;
      }
      if (!formatted.endsWith('</p>')) {
        formatted += '</p>';
      }
      
      // 将连续的列表项包装在<ul>标签中
      formatted = formatted.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
      
      this.formattedReading = formatted;
      
      // 结束性能监控
      performanceMonitor.end('格式化解读');
    },
    
    /**
     * 保存今日解读到历史记录
     */
    saveTodayReading() {
      const today = new Date().toISOString().split('T')[0]; // 格式：YYYY-MM-DD
      
      this.history[today] = {
        date: this.currentDate,
        cards: this.currentCards,
        reading: this.currentReading
      };
      
      // 保存到本地存储
      this.saveHistory();
      
      // 更新状态
      this.hasTodayReading = true;
      this.calculateRefreshTime();
    },
    
    /**
     * 保存历史记录到本地存储
     */
    saveHistory() {
      uni.setStorageSync('tarot_history', this.history);
    },
    
    /**
     * 从本地存储加载历史记录
     */
    loadHistory() {
      const history = uni.getStorageSync('tarot_history');
      if (history) {
        this.history = history;
      }
    },
    
    /**
     * 清除历史记录
     */
    clearHistory() {
      this.history = {};
      uni.removeStorageSync('tarot_history');
    },
    
    /**
     * 重置当前状态到初始界面
     */
    resetToInitial() {
      this.currentCards = [];
      this.currentReading = '';
      this.formattedReading = '';
      this.isDrawing = false;
      this.isReading = false;
      this.drawingProgress = 0;
    }
  }
});

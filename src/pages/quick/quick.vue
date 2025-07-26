<template>
  <view class="quick-container">
    <view class="header">
      <view class="title">快速塔罗</view>
      <view class="subtitle">快速解读近期运势</view>
    </view>
    
    <view class="content" v-if="!isReading && !readingResult">
      <view class="instruction">
        <view class="instruction-title">快速塔罗解读</view>
        <view class="instruction-text">跳过抽牌过程，直接获取三张牌的解读，了解近期可能发生的事情和建议。</view>
      </view>
      
      <button class="start-btn" @click="startQuickReading" :disabled="isLoading">
        <text v-if="!isLoading">开始快速解读</text>
        <text v-else>解读中...</text>
      </button>
    </view>
    
    <view class="reading-container" v-if="isReading">
      <view class="reading-text">正在生成快速解读...</view>
      <view class="cards-display">
        <view class="card-item" v-for="(card, index) in drawnCards" :key="index">
          <image class="card-image" :src="card.img || '/static/tarot/major/0-愚者.jpg'" mode="aspectFit" :class="{'reversed-image': card.isUpright === false}"></image>
          <view class="card-name">{{ card.name }}</view>
          <view class="card-orientation" :class="{'reversed': card.isUpright === false}">
            {{ card.isUpright ? '正位' : '逆位' }}
          </view>
          <view class="card-position">
            {{ index === 0 ? '过去/根源' : index === 1 ? '现在/情况' : '未来/结果' }}
          </view>
        </view>
      </view>
      <view class="loading-dots">
        <view class="dot"></view>
        <view class="dot"></view>
        <view class="dot"></view>
      </view>
    </view>
    
    <view class="result-container" v-if="readingResult">
      <view class="result-header">
        <view class="result-title">快速塔罗解读</view>
        <view class="result-date">{{ currentDate }}</view>
      </view>
      
      <view class="cards-display">
        <view class="card-item" v-for="(card, index) in drawnCards" :key="index">
          <image class="card-image" :src="card.img || '/static/tarot/major/0-愚者.jpg'" mode="aspectFit" :class="{'reversed-image': card.isUpright === false}"></image>
          <view class="card-name">{{ card.name }}</view>
          <view class="card-orientation" :class="{'reversed': card.isUpright === false}">
            {{ card.isUpright ? '正位' : '逆位' }}
          </view>
          <view class="card-position">
            {{ index === 0 ? '过去/根源' : index === 1 ? '现在/情况' : '未来/结果' }}
          </view>
        </view>
      </view>
      
      <view class="reading-text">
        <rich-text :nodes="formattedReading"></rich-text>
      </view>
      
      <view class="action-buttons">
        <button class="share-btn" @click="shareReading">分享解读</button>
        <button class="save-btn" @click="saveReading">保存解读</button>
      </view>
      
      <button class="new-reading-btn" @click="resetReading">新的解读</button>
    </view>
  </view>
</template>

<script>
import { drawRandomCards } from '@/utils/tarot-data.js';
import performanceMonitor from '@/utils/performance-monitor.js';
import aiInsightService from '@/utils/ai-insight-service.js';
import { shareReading, saveReadingToLocal } from '@/utils/share-save-utils.js';

export default {
  data() {
    return {
      isLoading: false,
      isReading: false,
      drawnCards: [],
      readingResult: '',
      formattedReading: '',
      currentDate: ''
    }
  },
  onLoad() {
    this.setCurrentDate();
  },
  onShow() {
    // 每次页面显示时重置状态，确保显示初始界面
    this.resetReading();
    this.isLoading = false;
    this.isReading = false;
  },
  methods: {
    setCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      this.currentDate = `${year}年${month}月${day}日`;
    },
    startQuickReading() {
      if (this.isLoading) return;
      
      this.isLoading = true;
      this.isReading = true;
      
      // 随机抽取三张牌，分别抽取以确保每张牌的正逆位独立
      this.drawnCards = [];
      // 第一张牌
      this.drawnCards.push(drawRandomCards(1)[0]);
      // 第二张牌，排除已抽过的牌
      const excludeIds1 = this.drawnCards.map(card => card.id);
      this.drawnCards.push(drawRandomCards(1, excludeIds1)[0]);
      // 第三张牌，排除已抽过的牌
      const excludeIds2 = this.drawnCards.map(card => card.id);
      this.drawnCards.push(drawRandomCards(1, excludeIds2)[0]);
      
      // 清空之前的解读结果
      this.readingResult = '';
      
      // 创建一个div元素用于显示流式输出
      this.formattedReading = '<div id="streaming-content"></div>';
      
      // 使用性能监控工具
      performanceMonitor.start('快速塔罗解读');
      
      // 显示初始加载状态
      this.formattedReading = '<div class="loading-message">正在连接AI服务...</div>';
      
      // 立即开始调用AI服务生成解读，不再使用setTimeout延迟
      this.generateReading();
    },
    
    async generateReading() {
      try {
        // 使用AI服务生成解读，传入回调函数处理流式输出
        const result = await aiInsightService.generateAIInsight(
          this.drawnCards, 
          'threeCard', 
          '', // 无具体问题
          'quick', // 快速塔罗类型
          '', // 基础解读
          (streamText) => {
            // 更新解读结果
            this.readingResult = streamText;
            // 实时格式化并显示
            this.formatReading();
          }
        );
        
        // 检查结果是否为错误消息
        if (result && result.includes('很抱歉，解读生成失败')) {
          console.error('检测到错误消息:', result);
          throw new Error('AI服务生成解读失败');
        }
        
        // 记录性能数据
        const duration = performanceMonitor.end('快速塔罗解读');
        console.log(`✅ 快速塔罗解读生成完成，总耗时: ${duration}ms，内容长度: ${result.length}字符`);
        
        // 格式化最终解读结果
        this.formatReading();
        
        // 保存到最近解读列表
        this.saveToRecentReadings();
        
        // 显示解读结果
        this.isReading = false;
        this.isLoading = false;
      } catch (error) {
        console.error('解读生成失败:', error);
        
        // 结束性能监控
        performanceMonitor.end('快速塔罗解读');
        
        // 显示错误提示
        uni.showToast({
          title: `AI解读失败: ${error.message}`,
          icon: 'none',
          duration: 3000
        });
        
        // 重置状态
        this.readingResult = '';
        this.formattedReading = '<div class="error-message">AI解读生成失败，请稍后重试</div>';
        this.isReading = false;
        this.isLoading = false;
      }
    },
    formatReading() {
      // 使用性能监控工具
      performanceMonitor.start('格式化');
      
      // 如果没有内容，显示加载中
      if (!this.readingResult) {
        this.formattedReading = '<div class="loading-message">正在生成解读...</div>';
        performanceMonitor.end('格式化');
        return;
      }
      
      // 将纯文本转换为富文本格式 - 优化正则表达式处理
      let formatted = this.readingResult
        // 处理标题 (# 文本)
        .replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
        // 处理粗体 (**文本**)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // 处理斜体 (*文本*)
        .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
        // 处理列表项
        .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
        // 处理段落
        .replace(/\n\n/g, '</p><p>')
        // 处理换行
        .replace(/\n/g, '<br>');
      
      // 确保内容被段落标签包裹
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
      performanceMonitor.end('格式化');
    },
    saveToRecentReadings() {
      // 添加到最近解读列表
      const recentReadings = uni.getStorageSync('recent_readings') || [];
      recentReadings.unshift({
        id: Date.now().toString(),
        date: this.currentDate,
        type: '快速塔罗',
        question: '近期运势',
        cards: this.drawnCards,
        reading: this.readingResult
      });
      
      // 只保留最近10条记录
      if (recentReadings.length > 10) {
        recentReadings.pop();
      }
      
      uni.setStorageSync('recent_readings', recentReadings);
    },
    async shareReading() {
      try {
        const readingData = {
          title: '快速塔罗解读',
          date: this.currentDate,
          cards: this.drawnCards,
          content: this.readingResult,
          question: '近期运势'
        };
        
        await shareReading(readingData);
      } catch (error) {
        console.error('分享失败:', error);
        uni.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 2000
        });
      }
    },
    saveReading() {
      try {
        const readingData = {
          title: '快速塔罗解读',
          date: this.currentDate,
          cards: this.drawnCards,
          content: this.readingResult,
          question: '近期运势',
          type: 'quick'
        };
        
        saveReadingToLocal(readingData);
      } catch (error) {
        console.error('保存失败:', error);
        uni.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        });
      }
    },
    resetReading() {
      this.readingResult = '';
      this.drawnCards = [];
      this.formattedReading = '';
    }
  }
}
</script>

<style>
.quick-container {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding-bottom: 50rpx;
}

.header {
  background-color: #673AB7;
  padding: 40rpx 30rpx;
  color: #FFFFFF;
  text-align: center;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  opacity: 0.9;
}

.content {
  padding: 30rpx;
}

.instruction {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.instruction-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #673AB7;
  margin-bottom: 15rpx;
}

.instruction-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.start-btn {
  background-color: #673AB7;
  color: #FFFFFF;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 16px;
  border-radius: 45rpx;
  margin-top: 40rpx;
}

.start-btn[disabled] {
  background-color: #B39DDB;
  color: #FFFFFF;
}

.reading-container {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.reading-text {
  font-size: 32rpx;
  color: #673AB7;
  font-weight: bold;
  margin-bottom: 40rpx;
}

.cards-display {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 30rpx 0;
}

.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180rpx;
}

.card-image {
  width: 180rpx;
  height: 300rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
  transition: transform 0.5s ease;
  object-fit: contain;
  background-color: #f5f5f5;
}

.reversed-image {
  transform: rotate(180deg);
}

.card-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-top: 15rpx;
  text-align: center;
}

.card-orientation {
  font-size: 26rpx;
  font-weight: bold;
  text-align: center;
  margin-top: 5rpx;
}

.card-orientation.reversed {
  color: #e74c3c;
}

.card-position {
  font-size: 24rpx;
  color: #666;
  margin-top: 5rpx;
  text-align: center;
}

.loading-dots {
  display: flex;
  margin-top: 30rpx;
}

.dot {
  width: 20rpx;
  height: 20rpx;
  background-color: #673AB7;
  border-radius: 50%;
  margin: 0 10rpx;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.result-container {
  padding: 30rpx;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.result-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.result-date {
  font-size: 28rpx;
  color: #666;
}

.reading-text {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 30rpx 0;
  line-height: 1.6;
  font-size: 32rpx;
  color: #333;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
}

.share-btn, .save-btn {
  width: 48%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-btn {
  background-color: #673AB7;
  color: #FFFFFF;
}

.save-btn {
  background-color: #FFFFFF;
  color: #673AB7;
  border: 1rpx solid #673AB7;
}

.new-reading-btn {
  background-color: #F5F5F5;
  color: #333;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  border-radius: 40rpx;
  margin-top: 40rpx;
  border: 1rpx solid #E0E0E0;
}
</style>
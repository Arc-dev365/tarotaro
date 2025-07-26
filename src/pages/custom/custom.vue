<template>
  <view class="custom-container">
    <view class="header">
      <view class="title">定向塔罗</view>
      <view class="subtitle">针对特定问题的解读</view>
    </view>
    
    <view class="content" v-if="!isDrawing && !isReading && !readingResult">
      <view class="instruction">
        <view class="instruction-title">定向塔罗解读</view>
        <view class="instruction-text">输入你想要解答的问题，通过塔罗牌获取针对性的指引。</view>
      </view>
      
      <view class="question-input">
        <view class="input-label">你的问题</view>
        <textarea 
          class="input-area" 
          v-model="question" 
          placeholder="例如：我的事业发展方向如何？我的感情将会有什么变化？" 
          maxlength="100"
        ></textarea>
        <view class="input-counter">{{ question.length }}/100</view>
      </view>
      
      <view class="question-tips">
        <view class="tips-title">提问技巧</view>
        <view class="tips-list">
          <view class="tip-item">• 使用开放性问题，避免是/否问题</view>
          <view class="tip-item">• 具体描述你的情况，但不要过于复杂</view>
          <view class="tip-item">• 关注你能控制的方面，而非他人的想法</view>
        </view>
      </view>
      
      <button class="start-btn" @click="startDrawing" :disabled="!question.trim()">
        开始抽牌
      </button>
    </view>
    
    <!-- 抽牌状态：使用TarotDrawing组件 -->
    <TarotDrawing 
      v-if="isDrawing"
      :isDrawing="isDrawing"
      :drawingText="'正在洗牌...'"
      :drawnCards="drawnCards"
      :progress="drawingProgress"
      :cardCount="3"
    />
    
    <!-- 解读状态：使用TarotReading组件 -->
    <TarotReading 
      v-if="isReading || readingResult"
      :title="'定向塔罗解读'"
      :date="currentDate"
      :cards="drawnCards"
      :positions="cardPositions"
      :content="formattedReading"
      :isFormatted="true"
      :loading="isReading"
      :loadingText="'正在解读塔罗牌...'"
      @share="shareReading"
      @save="saveReading"
    />
    
    <!-- 问题显示 -->
    <view class="question-display" v-if="isDrawing || isReading || readingResult">{{ question }}</view>
    
    <!-- 重置按钮 -->
    <button class="new-reading-btn" v-if="readingResult" @click="resetReading">新的解读</button>
  </view>
</template>

<script>
import { drawRandomCards } from '@/utils/tarot-data.js';
import performanceMonitor from '@/utils/performance-monitor.js';
import aiInsightService from '@/utils/ai-insight-service.js';
import TarotDrawing from '@/components/TarotDrawing.vue';
import TarotReading from '@/components/TarotReading.vue';
import { shareReading, saveReadingToLocal } from '@/utils/share-save-utils.js';

export default {
  components: {
    TarotDrawing,
    TarotReading
  },
  data() {
    return {
      question: '',
      isDrawing: false,
      isReading: false,
      drawingProgress: 0,
      drawnCards: [],
      readingResult: '',
      formattedReading: '',
      currentDate: '',
      cardPositions: ['过去/根源', '现在/情况', '未来/结果'] // 牌位置描述
    }
  },
  onLoad() {
    this.setCurrentDate();
  },
  onShow() {
    // 每次页面显示时重置状态，确保显示初始界面
    this.resetReading();
    this.isDrawing = false;
    this.isReading = false;
    this.drawingProgress = 0;
  },
  methods: {
    setCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      this.currentDate = `${year}年${month}月${day}日`;
    },
    startDrawing() {
      if (!this.question.trim()) {
        uni.showToast({
          title: '请输入你的问题',
          icon: 'none'
        });
        return;
      }
      
      this.isDrawing = true;
      this.drawingProgress = 0;
      this.drawnCards = [];
      
      // 模拟抽牌过程
      const drawInterval = setInterval(() => {
        this.drawingProgress += 5;
        
        if (this.drawingProgress >= 33 && this.drawnCards.length < 1) {
          // 第一张牌
          this.drawnCards.push(drawRandomCards(1)[0]);
        } else if (this.drawingProgress >= 66 && this.drawnCards.length < 2) {
          // 第二张牌，排除已抽过的牌
          const excludeIds = this.drawnCards.map(card => card.id);
          this.drawnCards.push(drawRandomCards(1, excludeIds)[0]);
        } else if (this.drawingProgress >= 100) {
          // 第三张牌，排除已抽过的牌
          const excludeIds = this.drawnCards.map(card => card.id);
          this.drawnCards.push(drawRandomCards(1, excludeIds)[0]);
          clearInterval(drawInterval);
          setTimeout(() => {
            this.isDrawing = false;
            this.startReading();
          }, 500);
        }
      }, 100);
    },
    startReading() {
      this.isReading = true;
      this.readingResult = ''; // 清空之前的解读结果
      
      // 创建一个div元素用于显示流式输出
      this.formattedReading = '<div id="streaming-content"></div>';
      
      // 使用性能监控工具
      performanceMonitor.start('解读生成');
      
      // 立即格式化显示，即使是空内容
      this.formatReading();
      
      // 立即开始调用AI服务生成解读，不再使用setTimeout延迟
      this.generateReading();
    },
    
    async generateReading() {
      try {
        // 显示初始加载状态
        this.formattedReading = '<div class="loading-message">正在连接AI服务...</div>';
        
        // 使用AI服务生成解读，传入回调函数处理流式输出
        const result = await aiInsightService.generateAIInsight(
          this.drawnCards, 
          'threeCard', 
          this.question, 
          'custom', // 定向塔罗类型
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
        const duration = performanceMonitor.end('解读生成');
        console.log(`✅ 解读生成完成，总耗时: ${duration}ms，内容长度: ${result.length}字符`);
        
        // 格式化最终解读结果
        this.formatReading();
        
        // 保存到最近解读列表
        this.saveToRecentReadings();
        
        // 显示解读结果
        this.isReading = false;
      } catch (error) {
        console.error('解读生成失败:', error);
        
        // 结束性能监控
        performanceMonitor.end('解读生成');
        
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
      }
    },
    formatReading() {
      // 使用性能监控工具
      performanceMonitor.start('格式化');
      
      // 如果没有内容，显示空div
      if (!this.readingResult || this.readingResult.trim() === '') {
        // 显示一个空的div，但不显示加载文本，让TarotReading组件处理加载状态
        this.formattedReading = '<div id="streaming-content"></div>';
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
        type: '定向塔罗',
        question: this.question,
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
          title: '定向塔罗解读',
          date: this.currentDate,
          cards: this.drawnCards,
          content: this.readingResult,
          question: this.question || '定向解读'
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
          title: '定向塔罗解读',
          date: this.currentDate,
          cards: this.drawnCards,
          content: this.readingResult,
          question: this.question || '定向解读',
          type: 'custom'
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
      this.question = '';
    }
  }
}</script>

<style>
.custom-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 30px;
}

.header {
  background-color: #8e44ad;
  color: white;
  padding: 40rpx 30rpx;
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
  padding: 20px;
}

.instruction {
  background-color: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

.instruction-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  color: #8e44ad;
}

.instruction-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.question-input {
  background-color: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

.input-label {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  color: #333;
}

.input-area {
  width: 100%;
  height: 200rpx;
  border: 1rpx solid #ddd;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.input-counter {
  text-align: right;
  font-size: 24rpx;
  color: #999;
}

.question-tips {
  background-color: #f0e6f6;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.tips-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  color: #8e44ad;
}

.tips-list {
  font-size: 28rpx;
  color: #666;
}

.tip-item {
  margin-bottom: 10rpx;
  line-height: 1.5;
}

.start-btn {
  background-color: #8e44ad;
  color: white;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  border-radius: 45rpx;
  margin-top: 40rpx;
}

.start-btn[disabled] {
  background-color: #d1b3e1;
  color: #f8f8f8;
}

.question-display {
  background-color: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  font-size: 32rpx;
  color: #8e44ad;
  text-align: center;
  font-weight: bold;
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
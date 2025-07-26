<template>
  <view class="daily-container">
    <view class="header">
      <view class="title">今日塔罗</view>
      <view class="subtitle">每日运势指引</view>
    </view>
    
    <!-- 初始状态：显示说明和抽牌按钮 -->
    <view class="content" v-if="!tarotStore.isDrawing && !tarotStore.isReading && !tarotStore.currentReading">
      <view class="instruction">
        <view class="instruction-title">今日塔罗解读</view>
        <view class="instruction-text">通过塔罗牌了解今天的运势和指引。每天只能抽取一次，结果将保存至明天。</view>
      </view>
      
      <view class="date-display">
        <view class="current-date">{{ tarotStore.currentDate }}</view>
        <view class="time-remaining" v-if="tarotStore.hasTodayReading">
          <text>今日已抽取</text>
          <text class="refresh-time">{{ tarotStore.refreshTimeText }}</text>
        </view>
      </view>
      
      <view 
        class="card-deck" 
        @click="handleDeckClick" 
        :class="{disabled: tarotStore.isDrawing || tarotStore.hasTodayReading}"
      >
        <!-- 可点击的开始图片 -->
        <image class="start-image" src="/static/tarot/start.png" mode="aspectFit"></image>
        <view class="deck-text">{{ tarotStore.hasTodayReading ? '查看今日解读' : '点击抽牌' }}</view>
      </view>
    </view>
    
    <!-- 抽牌状态：使用TarotDrawing组件 -->
    <TarotDrawing 
      v-if="tarotStore.isDrawing"
      :isDrawing="tarotStore.isDrawing"
      :drawingText="'正在洗牌...'"
      :drawnCards="tarotStore.currentCards"
      :progress="tarotStore.drawingProgress"
      :cardCount="3"
    />
    
    <!-- 解读状态：使用TarotReading组件 -->
    <TarotReading 
      v-if="tarotStore.isReading || tarotStore.currentReading"
      :title="'今日塔罗解读'"
      :date="tarotStore.currentDate"
      :cards="tarotStore.currentCards"
      :positions="cardPositions"
      :content="tarotStore.formattedReading"
      :isFormatted="true"
      :loading="tarotStore.isReading"
      :loadingText="'正在解读塔罗牌...'"
      @share="shareReading"
      @save="saveReading"
    />
    
    <!-- 历史记录按钮已移除 -->
    
    <!-- 历史记录弹窗 -->
    <view class="history-modal" v-if="showHistory">
      <view class="modal-overlay" @click="showHistory = false"></view>
      <view class="modal-content">
        <view class="modal-header">
          <view class="modal-title">历史解读记录</view>
          <view class="modal-close" @click="showHistory = false">×</view>
        </view>
        
        <TarotHistory 
          :historyItems="tarotStore.sortedHistory"
          @select="selectHistoryItem"
          @clear="tarotStore.clearHistory"
        />
      </view>
    </view>
  </view>
</template>

<script>
import { useTarotStore } from '@/store/tarotStore.js';
import TarotDrawing from '@/components/TarotDrawing.vue';
import TarotReading from '@/components/TarotReading.vue';
import TarotHistory from '@/components/TarotHistory.vue';
import performanceMonitor from '@/utils/performance-monitor.js';
import { shareReading, saveReadingToLocal } from '@/utils/share-save-utils.js';
import aiInsightService from '@/utils/ai-insight-service.js';

export default {
  components: {
    TarotDrawing,
    TarotReading,
    TarotHistory
  },
  data() {
    return {
      showHistory: false, // 是否显示历史记录弹窗
      cardPositions: ['过去/根源', '现在/情况', '未来/结果'] // 牌位置描述
    }
  },
  computed: {
    // 使用Pinia的tarotStore
    tarotStore() {
      return useTarotStore();
    }
  },
  onLoad() {
    // 初始化塔罗牌状态
    this.tarotStore.setCurrentDate();
    this.tarotStore.checkTodayReading();
  },
  onShow() {
    // 每次页面显示时检查是否已有今日解读
    this.tarotStore.checkTodayReading();
    // 重置状态到初始界面，确保不显示上次的内容
    if (!this.tarotStore.hasTodayReading) {
      this.tarotStore.resetToInitial();
    }
  },
  methods: {
    /**
     * 处理牌组点击事件
     */
    async handleDeckClick() {
      if (this.tarotStore.isDrawing) return;
      
      // 恢复每日一次限制
      if (this.tarotStore.hasTodayReading) {
        // 如果已有今日解读，直接显示结果
        return;
      }
      
      // 使用性能监控工具测量从点击抽牌到完成整个流程的时间
      performanceMonitor.start('塔罗完整体验');
      
      try {
        // 开始抽牌
        await this.tarotStore.startDrawing();
        // 抽牌完成后开始解读
        await this.startReading();
        
        // 记录整个流程的耗时
        const totalDuration = performanceMonitor.end('塔罗完整体验');
        console.log(`🎉 塔罗完整体验结束，总耗时: ${totalDuration}ms`);
      } catch (error) {
        // 确保即使出错也结束计时
        performanceMonitor.end('塔罗完整体验');
        console.error('塔罗体验过程出错:', error);
      }
    },
    
    /**
     * 开始解读
     */
    async startReading() {
      // 使用性能监控工具测量整个解读过程
      performanceMonitor.start('今日塔罗完整流程');
      try {
        await this.tarotStore.startReading();
        const duration = performanceMonitor.end('今日塔罗完整流程');
        console.log(`✅ 今日塔罗完整流程结束，总耗时: ${duration}ms`);
      } catch (error) {
        // 确保即使出错也结束计时
        performanceMonitor.end('今日塔罗完整流程');
        console.error('塔罗解读过程出错:', error);
      }
    },
    
    /**
     * 分享解读
     */
    async shareReading() {
      try {
        const readingData = {
          title: '今日塔罗解读',
          date: this.tarotStore.currentDate,
          cards: this.tarotStore.currentCards,
          content: this.tarotStore.currentReading,
          question: '今日运势'
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
    
    /**
     * 保存解读
     */
    saveReading() {
      try {
        const readingData = {
          title: '今日塔罗解读',
          date: this.tarotStore.currentDate,
          cards: this.tarotStore.currentCards,
          content: this.tarotStore.currentReading,
          question: '今日运势',
          type: 'daily'
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
    
    /**
     * 选择历史记录项
     */
    selectHistoryItem(item) {
      // 使用性能监控工具测量加载历史记录的性能
      performanceMonitor.start('加载历史解读');
      
      try {
        // 显示历史解读
        this.tarotStore.currentCards = item.cards;
        this.tarotStore.currentReading = item.reading;
        this.tarotStore.formatReading();
        
        // 记录加载历史记录的耗时
        const duration = performanceMonitor.end('加载历史解读');
        console.log(`📜 历史解读加载完成，耗时: ${duration}ms`);
      } catch (error) {
        // 确保即使出错也结束计时
        performanceMonitor.end('加载历史解读');
        console.error('加载历史解读出错:', error);
      }
      
      // 关闭历史记录弹窗
      this.showHistory = false;
    }
  }
}</script>

<style>
.daily-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 30px;
}

.header {
  background-color: #4a90e2;
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
  color: #4a90e2;
}

.instruction-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.date-display {
  text-align: center;
  margin: 10px 0;
}

.current-date {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.time-remaining {
  font-size: 28rpx;
  color: #666;
}

.refresh-time {
  color: #4a90e2;
  font-weight: bold;
}

.card-deck {
  background-color: white;
  border-radius: 20rpx;
  padding: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
  width: 85%;
  margin: 0 auto;
}

.card-deck:active {
  transform: scale(0.98);
}

.card-deck.disabled {
  opacity: 0.7;
  cursor: default;
}

.deck-image {
  width: 200rpx;
  height: 300rpx;
  margin-bottom: 15rpx;
}

.deck-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #4a90e2;
}

/* 历史记录按钮样式已移除 */

/* 开始图片样式 */
.start-image {
  width: 90%;
  height: 400rpx;
  object-fit: contain;
  margin-bottom: 1rpx;
}

/* 历史记录弹窗 */
.history-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  right: 0rpx;
  bottom: 0rpx;
  background-color: rgba(0,0,0,0.5);
}

.modal-content {
  position: relative;
  width: 90%;
  max-height: 80vh;
  background-color: white;
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 101;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
}

.modal-close {
  font-size: 48rpx;
  color: #999;
  cursor: pointer;
}
</style>
  color: #666;
  line-height: 1.5;
}

.card-deck {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.card-deck.disabled {
  opacity: 0.7;
  pointer-events: none;
}

.deck-image {
  width: 200rpx;
  height: 300rpx;
  margin-bottom: 20rpx;
}

.deck-text {
  font-size: 32rpx;
  color: #FF9800;
  font-weight: bold;
}

.date-display {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  text-align: center;
}

.current-date {
  font-size: 36rpx;
  font-weight: bold;
  color: #FF9800;
  margin-bottom: 15rpx;
}

.time-remaining {
  font-size: 28rpx;
  color: #999;
}

.refresh-time {
  color: #FF9800;
  margin-left: 10rpx;
}

.drawing-container {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drawing-text {
  font-size: 32rpx;
  color: #FF9800;
  font-weight: bold;
  margin-bottom: 40rpx;
}

.cards-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 40rpx;
}

.card-placeholder {
  width: 180rpx;
  height: 300rpx;
  background-color: rgba(255, 152, 0, 0.1);
  border: 2rpx dashed #FF9800;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.card-drawn {
  background-color: #FFFFFF;
  border: none;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
  transform: translateY(-20rpx);
}

.card-number {
  font-size: 36rpx;
  color: #FF9800;
  opacity: 0.5;
}

.card-image {
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
  transition: transform 0.5s ease;
}

.reversed-image {
  transform: rotate(180deg);
}

.drawing-progress {
  width: 100%;
  margin-top: 20rpx;
}

.progress-bar {
  height: 10rpx;
  background-color: rgba(255, 152, 0, 0.2);
  border-radius: 10rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #FF9800;
  transition: width 0.3s;
}

.reading-container {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.card-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-top: 15rpx;
  text-align: center;
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
  background-color: #FF9800;
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
  font-size: 28rpx;
  color: #333;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  min-height: 400rpx;
}

.reading-text p {
  margin-bottom: 24rpx;
}

.reading-text strong {
  color: #FF9800;
  display: block;
  margin: 30rpx 0 16rpx;
  font-size: 32rpx;
}

.reading-text ul {
  padding-left: 40rpx;
  margin: 20rpx 0;
}

.reading-text li {
  margin-bottom: 16rpx;
}

.streaming-placeholder {
  color: #999;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200rpx;
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
  background-color: #FF9800;
  color: #FFFFFF;
}

.save-btn {
  background-color: #FFFFFF;
  color: #FF9800;
  border: 1rpx solid #FF9800;
}
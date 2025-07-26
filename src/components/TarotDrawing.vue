<template>
  <view class="tarot-drawing">
    <!-- 抽牌提示文本 -->
    <view class="drawing-text" v-if="isDrawing">{{ drawingText }}</view>
    
    <!-- 卡牌容器 -->
    <view class="cards-container">
      <view 
        class="card-placeholder" 
        v-for="(_, index) in cardCount" 
        :key="index"
        :class="{'card-drawn': drawnCards.length > index}"
      >
        <image 
          v-if="drawnCards.length > index" 
          class="card-image" 
          :src="drawnCards[index].img || '/static/tarot/major/0-愚者.jpg'" 
          mode="aspectFit"
          :class="{'reversed-image': drawnCards[index].isUpright === false}"
        ></image>
        <view v-else class="card-number">{{ index + 1 }}</view>
      </view>
    </view>
    
    <!-- 进度条 -->
    <view class="drawing-progress" v-if="isDrawing">
      <view class="progress-bar">
        <view class="progress-fill" :style="{width: `${progress}%`}"></view>
      </view>
      <view class="progress-text" v-if="showProgressText">{{ Math.floor(progress) }}%</view>
    </view>
  </view>
</template>

<script>
import performanceMonitor from '@/utils/performance-monitor.js';

export default {
  name: 'TarotDrawing',
  props: {
    // 是否正在抽牌
    isDrawing: {
      type: Boolean,
      default: false
    },
    // 抽牌文本
    drawingText: {
      type: String,
      default: '正在洗牌...'
    },
    // 已抽取的牌
    drawnCards: {
      type: Array,
      default: () => []
    },
    // 抽牌进度（0-100）
    progress: {
      type: Number,
      default: 0
    },
    // 要抽取的牌数量
    cardCount: {
      type: Number,
      default: 3
    },
    // 是否显示进度文本
    showProgressText: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * 开始抽牌
     */
    startDrawing() {
      // 使用性能监控工具测量抽牌过程
      performanceMonitor.start('抽牌动画');
      this.$emit('start-drawing');
    }
  },
  
  /**
   * 当组件更新时，检查抽牌是否完成
   */
  updated() {
    // 如果抽牌完成，结束计时
    if (this.drawnCards.length === this.cardCount && this.isDrawing === false) {
      // 只有当存在开始时间时才结束计时
      if (performanceMonitor.startTimes['抽牌动画']) {
        const duration = performanceMonitor.end('抽牌动画');
        console.log(`🃏 抽牌动画完成，耗时: ${duration}ms`);
      }
    }
  }
};
</script>

<style>
.tarot-drawing {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.drawing-text {
  text-align: center;
  font-size: 36rpx;
  margin-bottom: 40rpx;
}

.cards-container {
  display: flex;
  justify-content: space-around;
  margin: 30px 0;
}

.card-placeholder {
  width: 30%;
  height: 400rpx;
  border: 2rpx dashed #ccc;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
}

.card-drawn {
  border: none;
  transform: translateY(-10px);
}

.card-number {
  font-size: 48rpx;
  color: #999;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
}

.reversed-image {
  transform: rotate(180deg);
}

.drawing-progress {
  margin-top: 20px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  background-color: #4a90e2;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
}
</style>
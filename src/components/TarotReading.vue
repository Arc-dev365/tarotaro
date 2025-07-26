<template>
  <view class="tarot-reading">
    <!-- 解读标题 -->
    <view class="reading-header" v-if="title">
      <view class="reading-title">{{ title }}</view>
      <view class="reading-date" v-if="date">{{ date }}</view>
    </view>
    
    <!-- 卡牌显示区域 -->
    <view class="cards-display" v-if="cards && cards.length > 0">
      <view 
        class="card-item" 
        v-for="(card, index) in cards" 
        :key="index"
        :class="{'card-active': activeCardIndex === index}"
        @click="setActiveCard(index)"
      >
        <image 
          class="card-image" 
          :src="card.img || '/static/tarot/major/0-愚者.jpg'" 
          mode="aspectFit" 
          :class="{'reversed-image': card.isUpright === false}"
        ></image>
        <view class="card-name">{{ card.name }}</view>
        <view class="card-orientation" :class="{'reversed': card.isUpright === false}">
          {{ card.isUpright ? '正位' : '逆位' }}
        </view>
        <view class="card-position" v-if="positions && positions[index]">
          {{ positions[index] }}
        </view>
      </view>
    </view>
    
    <!-- 解读模式切换 -->
    <view class="reading-mode-tabs" v-if="formattedContent && !loading">
      <view 
        class="mode-tab" 
        :class="{'active': activeMode === 'basic'}"
        @click="switchMode('basic')"
      >
        基础解读
      </view>
      <view 
        class="mode-tab" 
        :class="{'active': activeMode === 'ai'}"
        @click="requestAIInsight"
      >
        AI深度解读
      </view>
    </view>
    
    <!-- 解读文本区域 -->
    <view class="reading-content">
      <!-- 加载中状态 - 只在没有任何内容时显示 -->
      <view class="loading-indicator" v-if="(loading && !formattedContent) || (aiInsightLoading && !formattedAIInsight)">
        <view class="loading-text">{{ aiInsightLoading ? 'AI深度解读生成中...' : loadingText }}</view>
        <view class="loading-dots">
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
        </view>
      </view>
      
      <!-- 基础解读内容 - 即使在loading时也显示，实现流式输出效果 -->
      <view class="reading-text" v-if="formattedContent && activeMode === 'basic'">
        <rich-text :nodes="formattedContent"></rich-text>
      </view>
      
      <!-- AI深度解读内容 - 即使在loading时也显示，实现流式输出效果 -->
      <view class="reading-text" v-if="formattedAIInsight && activeMode === 'ai'">
        <rich-text :nodes="formattedAIInsight"></rich-text>
      </view>
    </view>
    
    <!-- 操作按钮 -->
    <view class="action-buttons" v-if="showActions && !loading && !aiInsightLoading">
      <slot name="actions">
        <button class="share-btn" @click="$emit('share')">分享解读</button>
        <button class="save-btn" @click="$emit('save')">保存解读</button>
      </slot>
    </view>
  </view>
</template>

<script>
import performanceMonitor from '@/utils/performance-monitor.js';
import aiInsightService from '@/utils/ai-insight-service.js';

export default {
  name: 'TarotReading',
  props: {
    // 解读标题
    title: {
      type: String,
      default: '塔罗牌解读'
    },
    // 日期
    date: {
      type: String,
      default: ''
    },
    // 塔罗牌数组
    cards: {
      type: Array,
      default: () => []
    },
    // 牌位置描述
    positions: {
      type: Array,
      default: () => []
    },
    // 解读内容（纯文本或已格式化的HTML）
    content: {
      type: String,
      default: ''
    },
    // 是否已格式化
    isFormatted: {
      type: Boolean,
      default: false
    },
    // 是否显示加载中
    loading: {
      type: Boolean,
      default: false
    },
    // 加载中文本
    loadingText: {
      type: String,
      default: '正在解读塔罗牌...'
    },
    // 用户问题
    question: {
      type: String,
      default: ''
    },
    // 是否显示操作按钮
    showActions: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeCardIndex: -1, // 当前激活的卡牌索引
      formattedContent: '', // 格式化后的内容
      activeMode: 'basic', // 当前激活的解读模式：基础解读或AI深度解读
      aiInsight: '', // AI深度解读内容
      formattedAIInsight: '', // 格式化后的AI深度解读内容
      aiInsightLoading: false // AI深度解读加载状态
    };
  },
  watch: {
    // 监听内容变化，实时格式化
    content: {
      immediate: true,
      handler(newContent) {
        if (newContent) {
          if (this.isFormatted) {
            this.formattedContent = newContent;
          } else {
            this.formatContent(newContent);
          }
        } else {
          this.formattedContent = '';
        }
      }
    },
    // 监听AI解读内容变化，实时格式化
    aiInsight: {
      handler(newContent) {
        if (newContent) {
          this.formatAIInsight(newContent);
        }
      }
    }
  },
  methods: {
    /**
     * 设置当前激活的卡牌
     */
    setActiveCard(index) {
      this.activeCardIndex = this.activeCardIndex === index ? -1 : index;
      this.$emit('card-click', index, this.cards[index]);
    },
    
    /**
     * 切换解读模式
     */
    switchMode(mode) {
      this.activeMode = mode;
    },
    
    /**
     * 请求AI深度解读
     */
    async requestAIInsight() {
      // 如果已经有AI解读内容，直接切换模式
      if (this.formattedAIInsight) {
        this.activeMode = 'ai';
        return;
      }
      
      // 开始加载
      this.aiInsightLoading = true;
      this.activeMode = 'ai';
      
      try {
        // 准备卡牌数据
        const cardsData = this.cards.map((card, index) => ({
          name: card.name,
          isUpright: card.isUpright,
          uprightMeaning: card.uprightMeaning || '',
          reversedMeaning: card.reversedMeaning || '',
          position: this.positions && this.positions[index] ? this.positions[index] : ''
        }));
        
        // 确定牌阵类型
        let spreadType = 'general';
        if (this.title) {
          if (this.title.includes('今日')) {
            spreadType = 'daily';
          } else if (this.title.includes('三张牌')) {
            spreadType = 'three-card';
          }
        }
        
        // 确定问题类型
        let questionType = 'daily';
        if (this.title) {
          if (this.title.includes('快速')) {
            questionType = 'quick';
          } else if (this.title.includes('定制') || this.title.includes('定向')) {
            questionType = 'custom';
          } else if (this.title.includes('今日')) {
            questionType = 'daily';
          }
        }
        
        console.log('解读类型:', questionType);
        
        console.log('开始请求AI深度解读，卡牌数据:', cardsData);
        
        // 准备问题内容
        let questionContent = '';
        if (questionType === 'custom' && this.question) {
          questionContent = this.question;
        }
        
        // 调用AI解读服务
        await aiInsightService.generateAIInsight(
          cardsData,
          spreadType,
          questionContent, // 问题
          questionType, // 解读类型
          this.content, // 基础解读
          (text) => {
            this.aiInsight = text;
          }
        );
      } catch (error) {
        console.error('AI解读生成失败:', error);
        this.aiInsight = `AI深度解读失败: 通义千问API调用失败，请配置API密钥`;
        this.formatAIInsight(this.aiInsight);
      } finally {
        // 确保无论成功还是失败，都会关闭加载状态
        setTimeout(() => {
          this.aiInsightLoading = false;
        }, 500); // 短暂延迟以确保UI更新
      }
    },
    
    /**
     * 格式化AI解读内容
     */
    formatAIInsight(text) {
      try {
        let formatted = text
          // 处理标题 (# 文本)
          .replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
          // 处理粗体 (**文本**)
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          // 处理斜体 (*文本*)
          .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
          // 处理有序列表项 (1. 文本)
          .replace(/^(\d+\.\s+)(.*?)$/gm, '<li>$2</li>')
          // 处理无序列表项 (- 文本)
          .replace(/^-\s+(.*?)$/gm, '<li>$1</li>')
          // 处理段落 (空行分隔)
          .replace(/\n\n/g, '</p><p>')
          // 处理换行
          .replace(/\n/g, '<br>');
        
        // 确保段落被正确包裹
        if (!formatted.startsWith('<p>') && !formatted.startsWith('<h3>')) {
          formatted = '<p>' + formatted;
        }
        if (!formatted.endsWith('</p>')) {
          formatted = formatted + '</p>';
        }
        
        // 将连续的列表项包装在<ul>标签中
        formatted = formatted.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
        
        this.formattedAIInsight = formatted;
      } catch (error) {
        console.error('格式化AI解读内容出错:', error);
        // 使用简单格式化作为备选
        this.formattedAIInsight = '<p>' + text.replace(/\n/g, '<br>') + '</p>';
      }
    },
    
    /**
     * 格式化内容为富文本
     */
    formatContent(text) {
      // 使用性能监控工具测量格式化过程
      performanceMonitor.start('解读格式化');
      
      if (!text) {
        this.formattedContent = '';
        performanceMonitor.end('解读格式化');
        return;
      }
      
      try {
        let formatted = text
          // 处理标题 (# 文本)
          .replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
          // 处理粗体 (**文本**)
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          // 处理斜体 (*文本*)
          .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
          // 处理有序列表项 (1. 文本)
          .replace(/^(\d+\.\s+)(.*?)$/gm, '<li>$2</li>')
          // 处理无序列表项 (- 文本)
          .replace(/^-\s+(.*?)$/gm, '<li>$1</li>')
          // 处理段落 (空行分隔)
          .replace(/\n\n/g, '</p><p>')
          // 处理换行
          .replace(/\n/g, '<br>');
        
        // 确保段落被正确包裹
        if (!formatted.startsWith('<p>') && !formatted.startsWith('<h3>')) {
          formatted = '<p>' + formatted;
        }
        if (!formatted.endsWith('</p>')) {
          formatted = formatted + '</p>';
        }
        
        // 将连续的列表项包装在<ul>标签中
        formatted = formatted.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
        
        this.formattedContent = formatted;
        
        // 记录格式化耗时
        const duration = performanceMonitor.end('解读格式化');
        console.log(`📝 解读格式化完成，耗时: ${duration}ms，内容长度: ${text.length}字符`);
      } catch (error) {
        console.error('格式化解读内容出错:', error);
        // 确保即使出错也结束计时
        performanceMonitor.end('解读格式化');
        // 使用简单格式化作为备选
        this.formattedContent = '<p>' + text.replace(/\n/g, '<br>') + '</p>';
      }
    }
  }
};
</script>

<style>
.tarot-reading {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.reading-header {
  margin-bottom: 20px;
  text-align: center;
}

.reading-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.reading-date {
  font-size: 14px;
  color: #666;
}

.cards-display {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.card-item {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
  transition: transform 0.3s ease;
}

.card-active {
  transform: translateY(-10px);
}

.card-image {
  width: 100%;
  height: 300rpx;
  object-fit: contain;
  margin-bottom: 20rpx;
  transition: transform 0.5s ease;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
}

.reversed-image {
  transform: rotate(180deg);
}

.card-name {
  font-size: 28rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10rpx;
}

.card-orientation {
  font-size: 26rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10rpx;
}

.card-orientation.reversed {
  color: #e74c3c;
}

.card-position {
  font-size: 24rpx;
  color: #666;
  text-align: center;
}

/* 解读模式切换标签 */
.reading-mode-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  border-radius: 8rpx;
  overflow: hidden;
  background-color: #f0f0f0;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.mode-tab {
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  font-weight: bold;
  text-align: center;
  flex: 1;
  transition: all 0.3s ease;
  color: #666;
}

.mode-tab.active {
  background-color: #4a90e2;
  color: white;
}

.mode-tab:hover:not(.active) {
  background-color: #e0e0e0;
}

.reading-content {
  margin-bottom: 30px;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.loading-text {
  font-size: 16px;
  margin-bottom: 15px;
}

.loading-dots {
  display: flex;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #333;
  margin: 0 5px;
  animation: dot-pulse 1.5s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-pulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.reading-text {
  line-height: 1.6;
  font-size: 32rpx;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.share-btn, .save-btn {
  padding: 20rpx 40rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  border: none;
  text-align: center;
}

.share-btn {
  background-color: #4a90e2;
  color: white;
}

.save-btn {
  background-color: #50c878;
  color: white;
}
</style>
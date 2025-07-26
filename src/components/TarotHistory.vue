<template>
  <view class="tarot-history">
    <view class="history-header">
      <view class="history-title">{{ title }}</view>
      <view class="history-actions" v-if="showClearButton">
        <button class="clear-btn" @click="confirmClear">清除历史</button>
      </view>
    </view>
    
    <view class="history-empty" v-if="isEmpty">
      <view class="empty-text">{{ emptyText }}</view>
    </view>
    
    <view class="history-list" v-else>
      <view 
        class="history-item" 
        v-for="(item, index) in historyItems" 
        :key="index"
        @click="selectItem(item, index)"
      >
        <view class="item-date">{{ item.date }}</view>
        
        <view class="item-cards">
          <view class="mini-card" v-for="(card, cardIndex) in item.cards" :key="cardIndex">
            <image 
              class="mini-card-image" 
              :src="card.img" 
              mode="aspectFit"
              :class="{'reversed-image': card.isUpright === false}"
            ></image>
          </view>
        </view>
        
        <view class="item-preview">
          {{ getPreviewText(item.reading) }}
        </view>
        
        <view class="item-arrow">
          <text class="arrow-icon">›</text>
        </view>
      </view>
    </view>
    
    <!-- 确认清除对话框 -->
    <view class="confirm-dialog" v-if="showConfirmDialog">
      <view class="dialog-content">
        <view class="dialog-title">确认清除</view>
        <view class="dialog-message">确定要清除所有历史记录吗？此操作不可恢复。</view>
        <view class="dialog-buttons">
          <button class="cancel-btn" @click="showConfirmDialog = false">取消</button>
          <button class="confirm-btn" @click="clearHistory">确认清除</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import performanceMonitor from '@/utils/performance-monitor.js';

export default {
  name: 'TarotHistory',
  props: {
    // 标题
    title: {
      type: String,
      default: '历史记录'
    },
    // 历史记录数据
    historyItems: {
      type: Array,
      default: () => []
    },
    // 空记录提示文本
    emptyText: {
      type: String,
      default: '暂无历史记录'
    },
    // 是否显示清除按钮
    showClearButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showConfirmDialog: false
    };
  },
  computed: {
    isEmpty() {
      return !this.historyItems || this.historyItems.length === 0;
    }
  },
  methods: {
    /**
     * 获取预览文本
     */
    getPreviewText(reading) {
      // 使用性能监控工具测量文本处理性能
      performanceMonitor.start('预览文本处理');
      
      if (!reading) {
        performanceMonitor.end('预览文本处理');
        return '无解读内容';
      }
      
      try {
        // 移除Markdown标记并截取前30个字符
        const plainText = reading
          .replace(/^#\s+(.+)$/gm, '$1') // 移除标题标记
          .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
          .replace(/\*([^\*]+)\*/g, '$1') // 移除斜体标记
          .replace(/^(\d+\.\s+|-\s+)(.*?)$/gm, '$2') // 移除列表标记
          .replace(/\n/g, ' '); // 替换换行为空格
        
        const result = plainText.length > 30 ? plainText.substring(0, 30) + '...' : plainText;
        
        // 记录文本处理耗时
        const duration = performanceMonitor.end('预览文本处理');
        console.log(`📄 预览文本处理完成，耗时: ${duration}ms`);
        
        return result;
      } catch (error) {
        console.error('处理预览文本出错:', error);
        // 确保即使出错也结束计时
        performanceMonitor.end('预览文本处理');
        // 返回简单文本作为备选
        return reading.substring(0, 30) + '...';
      }
    },
    
    /**
     * 选择历史记录项
     */
    selectItem(item, index) {
      // 使用性能监控工具测量历史记录加载过程
      performanceMonitor.start('历史记录选择');
      
      // 发出选择事件
      this.$emit('select', item, index);
      
      // 记录历史记录选择耗时
      const duration = performanceMonitor.end('历史记录选择');
      console.log(`📜 历史记录选择完成，耗时: ${duration}ms`);
    },
    
    /**
     * 确认清除
     */
    confirmClear() {
      this.showConfirmDialog = true;
    },
    
    /**
     * 清除历史记录
     */
    clearHistory() {
      this.$emit('clear');
      this.showConfirmDialog = false;
    }
  }
};
</script>

<style>
.tarot-history {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-title {
  font-size: 20px;
  font-weight: bold;
}

.clear-btn {
  font-size: 14px;
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
}

.history-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.empty-text {
  color: #999;
  font-size: 16px;
}

.history-list {
  width: 100%;
}

.history-item {
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-bottom: 1px solid #eee;
  position: relative;
}

.item-date {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.item-cards {
  display: flex;
  margin-bottom: 10px;
}

.mini-card {
  width: 40px;
  height: 60px;
  margin-right: 10px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.mini-card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
  background-color: #f5f5f5;
}

.reversed-image {
  transform: rotate(180deg);
}

.item-preview {
  font-size: 14px;
  color: #666;
  margin-right: 20px;
}

.item-arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.arrow-icon {
  font-size: 24px;
  color: #999;
}

.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  width: 80%;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.dialog-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
}

.dialog-message {
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.dialog-buttons {
  display: flex;
  justify-content: space-around;
}

.cancel-btn, .confirm-btn {
  padding: 8px 20px;
  border-radius: 5px;
  font-size: 16px;
  border: none;
}

.cancel-btn {
  background-color: #eee;
  color: #333;
}

.confirm-btn {
  background-color: #f44336;
  color: white;
}
</style>
/**
 * 分享和保存解读功能工具
 * 提供塔罗牌解读的分享和保存功能
 */

/**
 * 生成分享文本
 * @param {Object} readingData - 解读数据
 * @param {string} readingData.title - 解读标题
 * @param {string} readingData.date - 解读日期
 * @param {Array} readingData.cards - 塔罗牌数组
 * @param {string} readingData.content - 解读内容
 * @param {string} readingData.question - 用户问题（可选）
 * @returns {string} 格式化的分享文本
 */
export const generateShareText = (readingData) => {
  const { title, date, cards, content, question } = readingData;
  
  let shareText = `🔮 ${title}\n`;
  
  if (date) {
    shareText += `📅 ${date}\n`;
  }
  
  if (question) {
    shareText += `❓ 问题：${question}\n`;
  }
  
  shareText += `\n🃏 抽取的牌：\n`;
  cards.forEach((card, index) => {
    const orientation = card.isUpright ? '正位' : '逆位';
    shareText += `${index + 1}. ${card.name}（${orientation}）\n`;
  });
  
  shareText += `\n📖 解读内容：\n`;
  // 移除HTML标签，保留纯文本
  const plainContent = content
    .replace(/<[^>]*>/g, '') // 移除HTML标签
    .replace(/&nbsp;/g, ' ') // 替换空格实体
    .replace(/&lt;/g, '<') // 替换小于号实体
    .replace(/&gt;/g, '>') // 替换大于号实体
    .replace(/&amp;/g, '&') // 替换和号实体
    .trim();
  
  shareText += plainContent;
  
  shareText += `\n\n✨ 来自塔罗牌解读应用`;
  
  return shareText;
};

/**
 * 分享解读到系统分享
 * @param {Object} readingData - 解读数据
 */
export const shareReading = async (readingData) => {
  try {
    const shareText = generateShareText(readingData);
    
    // 使用uni-app的分享API
    await uni.share({
      provider: 'system',
      type: 0, // 纯文本分享
      summary: shareText,
      success: () => {
        uni.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: (error) => {
        console.error('分享失败:', error);
        // 如果系统分享失败，则复制到剪贴板
        copyToClipboard(shareText);
      }
    });
  } catch (error) {
    console.error('分享功能出错:', error);
    // 降级到复制到剪贴板
    const shareText = generateShareText(readingData);
    copyToClipboard(shareText);
  }
};

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 */
export const copyToClipboard = (text) => {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({
        title: '已复制到剪贴板',
        icon: 'success',
        duration: 2000
      });
    },
    fail: () => {
      uni.showToast({
        title: '复制失败',
        icon: 'none',
        duration: 2000
      });
    }
  });
};

/**
 * 保存解读到本地存储
 * @param {Object} readingData - 解读数据
 * @param {string} storageKey - 存储键名，默认为'saved_readings'
 */
export const saveReadingToLocal = (readingData, storageKey = 'saved_readings') => {
  try {
    // 获取现有的保存记录
    let savedReadings = uni.getStorageSync(storageKey) || [];
    
    // 生成唯一ID
    const readingId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // 创建保存记录
    const savedReading = {
      id: readingId,
      ...readingData,
      savedAt: new Date().toISOString(),
      savedDate: new Date().toLocaleString('zh-CN')
    };
    
    // 添加到数组开头（最新的在前面）
    savedReadings.unshift(savedReading);
    
    // 限制保存数量，最多保存50条记录
    if (savedReadings.length > 50) {
      savedReadings = savedReadings.slice(0, 50);
    }
    
    // 保存到本地存储
    uni.setStorageSync(storageKey, savedReadings);
    
    uni.showToast({
      title: '解读已保存',
      icon: 'success',
      duration: 2000
    });
    
    return readingId;
  } catch (error) {
    console.error('保存解读失败:', error);
    uni.showToast({
      title: '保存失败',
      icon: 'none',
      duration: 2000
    });
    return null;
  }
};

/**
 * 获取保存的解读列表
 * @param {string} storageKey - 存储键名，默认为'saved_readings'
 * @returns {Array} 保存的解读列表
 */
export const getSavedReadings = (storageKey = 'saved_readings') => {
  try {
    return uni.getStorageSync(storageKey) || [];
  } catch (error) {
    console.error('获取保存的解读失败:', error);
    return [];
  }
};

/**
 * 删除保存的解读
 * @param {string} readingId - 解读ID
 * @param {string} storageKey - 存储键名，默认为'saved_readings'
 */
export const deleteSavedReading = (readingId, storageKey = 'saved_readings') => {
  try {
    let savedReadings = uni.getStorageSync(storageKey) || [];
    savedReadings = savedReadings.filter(reading => reading.id !== readingId);
    uni.setStorageSync(storageKey, savedReadings);
    
    uni.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 1500
    });
    
    return true;
  } catch (error) {
    console.error('删除保存的解读失败:', error);
    uni.showToast({
      title: '删除失败',
      icon: 'none',
      duration: 2000
    });
    return false;
  }
};

/**
 * 清空所有保存的解读
 * @param {string} storageKey - 存储键名，默认为'saved_readings'
 */
export const clearAllSavedReadings = (storageKey = 'saved_readings') => {
  try {
    uni.removeStorageSync(storageKey);
    uni.showToast({
      title: '已清空所有保存',
      icon: 'success',
      duration: 2000
    });
    return true;
  } catch (error) {
    console.error('清空保存的解读失败:', error);
    uni.showToast({
      title: '清空失败',
      icon: 'none',
      duration: 2000
    });
    return false;
  }
};

/**
 * 导出解读为文本文件（H5平台）
 * @param {Object} readingData - 解读数据
 */
export const exportReadingAsText = (readingData) => {
  // #ifdef H5
  try {
    const shareText = generateShareText(readingData);
    const blob = new Blob([shareText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `塔罗解读_${readingData.date || new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    uni.showToast({
      title: '导出成功',
      icon: 'success',
      duration: 2000
    });
  } catch (error) {
    console.error('导出失败:', error);
    uni.showToast({
      title: '导出失败',
      icon: 'none',
      duration: 2000
    });
  }
  // #endif
  
  // #ifndef H5
  uni.showToast({
    title: '该功能仅在H5平台支持',
    icon: 'none',
    duration: 2000
  });
  // #endif
};

/**
 * 生成解读图片（用于分享）
 * @param {Object} readingData - 解读数据
 * @returns {Promise<string>} 图片的临时路径
 */
export const generateReadingImage = async (readingData) => {
  // 这个功能需要canvas绘制，比较复杂，暂时返回null
  // 可以在后续版本中实现
  console.log('生成解读图片功能待实现');
  return null;
};
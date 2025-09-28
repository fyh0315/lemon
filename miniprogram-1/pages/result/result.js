Page({
    data: {
      id: -1,
    },
    
    onLoad(options) {
        // 获取携带的排练室ID
        this.setData({ id: options.id })
      },
  
    // “再来一单” 按钮点击事件
    onAgainTap: function () {
      // 跳转到“预约”页面（需替换为项目中实际的预约页路径）
      wx.navigateTo({
        url: '/pages/form/form?id=${this.data.id}',
      });
    },
  
    // “我知道啦” 按钮点击事件
    onConfirmTap: function () {
      wx.switchTab({
        url: '/pages/orders/orders',
      })
    },
  });
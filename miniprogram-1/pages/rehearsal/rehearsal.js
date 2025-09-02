// pages/rehearsal/list.js
Page({
    data: {
      rehearsalList: [], // 存储后端返回的列表（每条含imageUrl）
      searchKey: ''      // 搜索关键词
    },
  
    // 页面加载时请求数据
    onLoad() {
      this.fetchRehearsalList();
    },
  
    // 搜索输入时同步关键词
    onSearchInput(e) {
      this.setData({ searchKey: e.detail.value });
    },
  
    // 发起后端请求（POST + JSON传参）
    fetchRehearsalList() {
      wx.request({
        url: 'http://test-cn.your-api-server.com/store/query', // 后端接口地址
        method: 'POST',
        header: { 'Content-Type': 'application/json' }, // 声明JSON格式
        data: JSON.stringify({
          name: this.data.searchKey, // 搜索关键词（可扩展价格、标签等筛选）
          pageNum: 1,
          pageSize: 10
        }),
        success: (res) => {
          console.log('后端返回数据：', res.data); // 调试用，查看实际结构
          if (res.data.code === 1) { // 假设后端code=1为成功
            // 假设后端数据在 res.data.data.stores，且每条含imageUrl
            this.setData({
              rehearsalList: res.data.data.stores
            });
          } else {
            wx.showToast({ title: '数据获取失败', icon: 'none' });
          }
        },
        fail: (err) => {
          console.error('请求失败：', err);
          wx.showToast({ title: '网络错误', icon: 'none' });
        }
      });
    },
  
    // 预订按钮点击事件
    handleBook(e) {
      const roomId = e.currentTarget.dataset.id;
      wx.showToast({ title: `预订排练室ID: ${roomId}`, icon: 'none' });
      // 可扩展：跳转到预订详情页，如 wx.navigateTo({ url: '/pages/book/detail?id=' + roomId })
    }
  });
// pages/rehearsal/list.js
Page({
    data: {
      rehearsalList: [], // 存储后端返回的列表
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
  
    // 发起后端请求
    fetchRehearsalList() {
      wx.request({
        url: 'http://test-cn.your-api-server.com/store/query', // 后续改为后端接口地址
        method: 'GET',
        // 这个接口为什么后端是POST
        header: { 'Content-Type': 'application/json' }, // 声明JSON格式
        data: ({
          name: this.data.searchKey, // 搜索关键词（可扩展价格、标签等筛选）
          pageNum: 1,
          pageSize: 10
        }),
        success: (res) => {
          console.log('后端返回数据：', res.data); // 调试用，查看实际结构
          if (res.data.code === 1) { // 后端code=1为成功
            // 后端数据在 res.data.data.stores
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
    // 获取当前排练室的id（从data-id中获取）
    const roomId = e.currentTarget.dataset.id;
    
    // 跳转到详情页（假设详情页路径为 pages/rehearsal/detail）
    wx.navigateTo({
      url: `/pages/rhs_detail/rhs_detail?id=${roomId}`, 
    // 携带id参数到详情页
    });
  },
  });
// pages/rehearsal/list.js
Page({
    data: {
        rehearsalList: [], // 存储后端返回的列表
        total: 0, // 总记录数（用于分页）
        pageNum: 1, // 当前页码（默认1，与接口一致）
        pageSize: 10, // 每页条数（默认10，与接口一致）

        filterParams: {
        name: "", 
        minPrice: "",
        maxPrice: "", 
        tags: "" 
        }
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
        method: 'POST',
        // data部分
        data: ({
            pageNum,
            pageSize
        }),
        success: (res) => {
          console.log('后端返回数据：', res.data); 
          if (res.data.code === 1) { // code=1为成功
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
  
    // 上拉加载更多。。这部分没做
    onReachBottom() {
        const { pageNum, totalPages } = this.data;
        // 判断是否还有下一页
        if (pageNum < totalPages) {
          this.setData({
            pageNum: pageNum + 1 // 页码+1
          }, () => {
            this.fetchRehearsalList(); // 加载下一页数据（需修改fetchRehearsalList，合并旧数据）
          });
        } else {
          wx.showToast({
            title: "已加载全部排练室",
            icon: "none",
            duration: 1500
          });
        }
    },

     // 预订按钮点击事件
    // 预订按钮点击事件
    handleBook(e) {
        // 获取当前排练室的参数（从data-*中获取）
        const { 
            id: roomId, 
            name, 
            imageUrl, 
            description, 
            pricePerHour, 
            openTime, 
            closeTime, 
            tags, 
            address, 
            phone, 
            status 
        } = e.currentTarget.dataset; // 简化获取方式（解构赋值）
  
        // 跳转到详情页，正确拼接参数（无空格、用&分隔，特殊字符编码）
        wx.navigateTo({
            url: `/pages/rhs_detail/rhs_detail?` +
            `id=${encodeURIComponent(roomId)}&` +
            `name=${encodeURIComponent(name)}&` +
            `imageUrl=${encodeURIComponent(imageUrl)}&` +
            `description=${encodeURIComponent(description)}&` +
            `pricePerHour=${encodeURIComponent(pricePerHour)}&` +
            `openTime=${encodeURIComponent(openTime)}&` +
            `closeTime=${encodeURIComponent(closeTime)}&` +
            `tags=${encodeURIComponent(tags)}&` +
            `address=${encodeURIComponent(address)}&` +
            `phone=${encodeURIComponent(phone)}&` +
            `status=${encodeURIComponent(status)}`
    });
  }
  });
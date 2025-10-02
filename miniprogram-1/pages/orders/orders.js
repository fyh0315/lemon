Page({
    data: {
      orderList: [] // 存储从后端获取的订单列表
    },
  
    // 页面加载时触发，请求订单数据
    onLoad: function () {
      this.getOrderList();
    },
  
    // 从后端接口获取订单列表
    getOrderList: function () {
      wx.request({
        url: 'https://your-backend-api.com/orders', // 替换为实际后端接口地址
        method: 'GET',
        success: (res) => {
          // 假设后端返回格式：{ code: 200, data: [...] }
          if (res.data.code === 200) {
            this.setData({
              orderList: res.data.data // 将后端数据赋值给页面变量
            });
          } else {
            wx.showToast({
              title: '获取订单失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          wx.showToast({
            title: '网络错误，请稍后再试',
            icon: 'none'
          });
        }
      });
    },

    // 点击排练室店名跳转
    toRhs_detail: function (e) {
        const rhsId = e.currentTarget.dataset.rhsId;
        // 跳转到“预约”页面
        wx.navigateTo({
          url: '/pages/rhs_detail/rhs_detail?id=${rhsId}',
        });
      },
  
    // 退款操作（示例）
    handleRefund: function (e) {
      const orderId = e.currentTarget.dataset.orderId; // 获取订单ID
      // 调用退款接口逻辑（后端）
      wx.showToast({
        title: `订单${orderId}退款中...`,
        icon: 'none'
      });
    },
  
    // 再来一单操作（示例）
    handleRepeat: function (e) {
        const rhsId = e.currentTarget.dataset.rhsId;
        wx.navigateTo({
            url: '/pages/form/form?id=${rhsId}',
        });
    }
  });
Page({
    data: {
      userName: "乐萌萌", // 用户名（可从接口获取）
      level: 20 // 用户等级（可从接口获取）
    },
  
    onLoad: function () {
        this.getUser();
      },
    
      // 从后端接口获取订单列表
      getUser: function () {
        wx.request({
          url: 'https://your-backend-api.com/orders', // 替换为实际后端接口地址
          method: 'GET',
          success: (res) => {
            if (res.data.code === 1) {
              this.setData({
                userName: userName,
                level: level
              });
            } else {
              wx.showToast({
                title: '获取个人信息失败',
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
  
    // 收藏排练室按钮点击事件
    toCollect() {
      wx.showToast({
        title: "收藏排练室（后续可跳转页面）",
        icon: "none"
      });
      // 实际开发：wx.navigateTo({ url: "/pages/collect/collect" });
    },
  
    // 优惠券按钮点击事件
    toCoupon() {
      wx.showToast({
        title: "优惠券（后续可跳转页面）",
        icon: "none"
      });
      // 实际开发：wx.navigateTo({ url: "/pages/coupon/coupon" });
    },
  
    // 会员注册按钮点击事件
    toMember() {
      wx.showToast({
        title: "会员注册（后续可跳转页面）",
        icon: "none"
      });
      // 实际开发：wx.navigateTo({ url: "/pages/member/member" });
    },
  
    // 设置默认信息按钮点击事件
    toDefault() {
      wx.showToast({
        title: "设置默认信息（后续可跳转页面）",
        icon: "none"
      });
      // 实际开发：wx.navigateTo({ url: "/pages/default/default" });
    },
  
    // 帮助与反馈按钮点击事件
    toHelp() {
      wx.showToast({
        title: "帮助与反馈（后续可跳转页面）",
        icon: "none"
      });
      // 实际开发：wx.navigateTo({ url: "/pages/help/help" });
    }
  });
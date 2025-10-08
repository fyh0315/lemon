Page({
    data: {
      userName: "乐萌萌", // 用户名（可从接口获取）
      level: 20 // 用户等级（可从接口获取）
    },
  
    onLoad() {
      // 页面加载时的初始化逻辑（如请求用户信息）
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
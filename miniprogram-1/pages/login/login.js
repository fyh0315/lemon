Page({
    data: {
      userInfo: null // 存储用户信息
    },
  
    // 页面显示时检查登录状态
    onShow() {
      if (wx.hideHomeButton) {
        wx.hideHomeButton();
      }
      // 检查本地是否有 token，有则直接跳首页
      const token = wx.getStorageSync('token');
      if (token) {
        wx.redirectTo({ url: '/pages/home/home' });
      }
    },
  
    /**
     * 新授权逻辑：用户点击按钮后，调用 wx.getUserProfile 获取用户信息
     * 需用户主动触发（点击按钮），且必须传入 desc 说明授权用途
     */
    bindGetUserProfile() {
      // 调用微信官方授权接口
      wx.getUserProfile({
        desc: '用于完善会员资料和正常使用小程序功能', // 必传参数，说明授权用途
        success: (userRes) => {
          // 1. 授权成功，获取用户信息
          const userInfo = userRes.userInfo;
          this.setData({ userInfo });
  
          // 2. 同时获取登录凭证 code（用于后端鉴权）
          wx.login({
            success: (loginRes) => {
              const code = loginRes.code;
              // 3. 发送 code 和 userInfo 到后端完成登录
              this.loginRequest(code, userInfo);
            },
            fail: () => {
              wx.showToast({ title: '获取登录凭证失败', icon: 'none' });
            }
          });
        },
        fail: () => {
          // 2. 授权失败（用户拒绝）
          wx.showToast({ title: '请授权后继续使用', icon: 'none' });
        }
      });
    },
  
    /**
     * 向后端发送登录请求
     * @param {string} code - 微信登录凭证
     * @param {object} userInfo - 用户信息
     */
    loginRequest(code, userInfo) {
      wx.request({
        url: 'https://your-server.com/api/login', // 替换为你的后端登录接口
        method: 'POST',
        data: { code, userInfo },
        success: (res) => {
          if (res.data.code === 200) {
            // 登录成功：保存 token 和用户信息
            const { token } = res.data.data;
            wx.setStorageSync('token', token);
            wx.setStorageSync('userInfo', userInfo);
            // 提示并跳转首页
            wx.showToast({ title: '登录成功' });
            wx.switchTab({ url: '/pages/home/home' });
          } else {
            wx.showToast({ title: '登录失败：' + res.data.msg, icon: 'none' });
          }
        },
        fail: () => {
          wx.showToast({ title: '网络错误，请稍后重试', icon: 'none' });
        }
      });
    },
  
    /**
     * 用户点击取消按钮
     */
    onCancel() {
        wx.switchTab({
            url: '/pages/home/home'
            });
      // 若小程序必须登录才能使用，建议留在登录页并提示
    //   wx.showToast({ title: '请授权后使用小程序', icon: 'none' })
    }
  });
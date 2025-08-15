Page({
    data: {
      userInfo: null // 存储用户信息
    },
  
    // 隐藏按钮
    onShow() {
        if (wx.hideHomeButton) {
          wx.hideHomeButton(); // 隐藏小房子按钮
        }
      },

    /**
     * 用户点击「确定」，触发授权流程
     * - 通过 open-type="getUserInfo" 唤起微信授权弹框
     * - 成功授权后获取用户信息 + 登录凭证（code）
     */
    onGetUserInfo(e) {
      const { userInfo } = e.detail;
      if (userInfo) {
        // 1. 保存用户信息到页面数据
        this.setData({ userInfo });
  
        // 2. 获取登录凭证（code），用于后端鉴权
        wx.login({
          success: (loginRes) => {
            const code = loginRes.code;
            // 3. 发送 code + userInfo 到后端完成登录验证
            this.loginRequest(code, userInfo);
          },
          fail: () => {
            wx.showToast({ title: '登录失败，请重试', icon: 'none' });
          }
        });
      } else {
        // 用户拒绝授权
        wx.showToast({ title: '请授权以继续使用', icon: 'none' });
      }
    },
  
    /**
     * 模拟向后端发送登录请求（需根据实际接口修改）
     * @param {string} code - 微信登录凭证
     * @param {object} userInfo - 用户信息（头像、昵称等）
     */
    loginRequest(code, userInfo) {
      // 需要替换为真实接口
      wx.request({
        url: 'https://your-server.com/api/login', 
        method: 'POST',
        data: { code, userInfo },
        success: (res) => {
          if (res.data.code === 200) {
            // 登录成功：跳转首页或保存会话
            wx.showToast({ title: '登录成功' });
            wx.navigateBack(); // 关闭授权页
          } else {
            wx.showToast({ title: '登录失败', icon: 'none' });
          }
        },
        fail: () => {
          wx.showToast({ title: '网络错误', icon: 'none' });
        }
      });
    },
  
    /**
     * 用户点击「取消」
     */
    onCancel() {
      wx.navigateBack(); // 返回上一页
    }
  });
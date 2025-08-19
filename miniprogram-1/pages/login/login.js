Page({
    data: {
      userInfo: null // 存储用户信息
    },
  
    // 隐藏按钮
    onShow() {
        if (wx.hideHomeButton) {
          wx.hideHomeButton();
        }
    // 检查登录状态
    // 获取本地存储的 token
    const token = wx.getStorageSync('token');
    if (token) {
      // 已登录，跳转至首页
      wx.redirectTo({ url: '/pages/home/home' });
    } else {
      // 未登录，执行后续操作登录
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
     * 向后端发送登录请求（需根据实际接口修改）
     * @param {string} code - 微信登录凭证
     * @param {object} userInfo - 用户信息（头像、昵称等）
     */
    // 修改 login.js 中的 loginRequest 方法
    loginRequest(code, userInfo) {
        wx.request({
        url: 'https://your-server.com/api/login', 
        method: 'POST',
        data: { code, userInfo },
        success: (res) => {
        if (res.data.code === 200) {
          // 1. 获取后端返回的 token（根据实际接口字段调整）
            const { token } = res.data.data;
  
          // 2. 保存登录状态到本地存储
          // 保存 token（关键：用于后续接口鉴权）
            wx.setStorageSync('token', token);
          // 保存用户信息（可选：用于页面展示）
            wx.setStorageSync('userInfo', userInfo);
  
          // 3. 提示并跳转首页
            wx.showToast({ title: '登录成功' });
            wx.switchTab({
            url: '/pages/home/home'
            });
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
        wx.switchTab({
            url: '/pages/home/home'
            });


        ///wx.exitMiniProgram();
        // 退出小程序
    }
  });
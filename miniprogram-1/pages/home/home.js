Page({
    // 填充逻辑待修改 目前为静态页面
    data: {
      // 排练时长数据
      practiceTime: '0',
      practiceSub: '较上月提升5h',
      practiceDesc: '“于是，辣个无敌的吉他手诞生了……”',
      // 优惠金额数据
      discountAmount: '0',
      discountSub: '较上月提升30￥',
      //这里还有上面的逻辑待修改
      discountDesc: '“难道你真的是省钱的天才？”'
    },
  
    onLoad() {
        this.fetchUserInfo();
    },

    //跳转至排练室list
    onTapGoRehearsal() {
        wx.navigateTo({
          url: '/pages/rehearsal/rehearsal', 
          success: () => {
            console.log("跳转去排练页成功");
          },
          fail: (err) => {
            console.error("跳转失败：", err); 
          }
        });
      },

     //跳转至搜索页面   
      onTapGoResearch() {
        wx.navigateTo({
            url: '/pages/research/research', 
          });
      },

      fetchUserInfo() {
        const token = wx.getStorageSync('token'); 
        const openid = wx.getStorageSync('openid'); // 读取已保存的 openid
        const isLogin = wx.getStorageSync('isLogin'); // 读取登录状态
        if (!isLogin || !token || !openid) {
            wx.showModal({
                title: '登录状态失效',
                content: '请重新登录以获取用户信息',
                confirmText: '去登录',
                success: (res) => {
                  if (res.confirm) {
                    // 跳转
                    wx.switchTab({ url: '/pages/mine/mine' });
                  }
                }
            });
        }
        else{
            wx.request({
                url: 'http://test-cn.your-api-server.com/store/query', // 后续改为后端接口地址
                method: 'GET',
                header: {
                    'Authorization': `Bearer ${openid}`,
                    'Content-Type': 'application/json'
                  },
    
                success: (res) => {
                  if (res.data.code === 1) { // 后端code=1为成功
                    // 后端数据在 res.data.data.
                    this.setData({
                        practiceTime: res.data.data.rehearsalTime,
                        discountAmount: res.data.data.totalDiscount
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
        }
        
      }
  })
Page({
    onLoad: function(){
        setTimeout(() => {
            // 检查是否登录
            const isLogin = wx.getStorageSync('isLogin');
            if (isLogin) {
            // 已登录，跳转到首页
            wx.switchTab({ url: '/pages/home/home' });
            return;
            }
            // wx.login不会有弹窗
            wx.login({
                success: (loginRes) => {
                    if (loginRes.code) {
                        //发起网络请求,发送 code到后端完成登录
                        wx.request({
                            url: 'http://test-cn.your-api-server.com/login/login', // 替换为你的后端登录接口
                            method: 'POST',
                            data: {
                            code: loginRes.code
                          },
                          success: (res) => {
                            if (res.data.code === 1) {

                            // 登录成功：保存登陆状态
                            const { token, id} = res.data.data; 
                              wx.setStorageSync('token', token);
                              wx.setStorageSync('isLogin', true);
                              wx.setStorageSync('userId', id); 

                              // 提示并跳转首页
                              wx.showToast({ title: '登录成功' });
                              wx.switchTab({ url: '/pages/home/home' });
                            } else {
                              wx.showToast({ title: '登录失败：' + res.data.msg, 
                              icon: 'none',
                              duration: 3000
                             });
                            }
                          }
                        });
                      } else {
                        wx.showToast({ title: '登录失败', icon: 'none', duration: 3000 });
                      }

                },
                fail: () => {
                  wx.showToast({ title: '获取登录凭证失败', icon: 'none' , duration: 3000});
                }
              });
        
        //调试用，待删除 
        wx.switchTab({ url: '/pages/home/home' });
        },2000);
    }
});

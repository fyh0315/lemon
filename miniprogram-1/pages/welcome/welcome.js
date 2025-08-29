Page({
    onLoad: function(){
        setTimeout(() => {
            // 检查是否登录
            const isLogin = wx.getStorageSync('isLogin');
            if (isLogin) {
            // 已登录，跳转到首页
            wx.switchTab({ url: '/pages/home/home' });
}
            // wx.login不会有弹窗
            wx.login({
                success: (loginRes) => {
                    if (loginRes.code) {
                        // 调试用，后续删
                        wx.showToast({
                            title: '获取code成功',
                            icon: 'success',
                            duration: 2000
                          });
                        //发起网络请求,发送 code到后端完成登录
                        wx.request({
                            url: 'https://your-server.com/api/login', // 替换为你的后端登录接口
                            method: 'POST',
                            data: {
                            code: loginRes.code
                          },
                          success: (res) => {
                            // 此处待修改
                            if (res.data.code === 1) {

                            // 登录成功：保存 token 登陆状态(此处待完善) 
                            // 假设后端返回的数据格式为 { code:1, data: { token: 'xxx', userId: 'xxx' } }
                              const { token, userId } = res.data.data;
                              // 同步存储到本地缓存
                              wx.setStorageSync('token', token); // 保存token
                              wx.setStorageSync('isLogin', true); // 标记登录状态
                              wx.setStorageSync('userId', userId); // 保存用户ID

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
              
            // wx.redirectTo({
            //     url:'/pages/login/login'
            // });
        },2000);
    }
});

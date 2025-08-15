// pages/register/register.js
Page({
    data: {
        isHidden: true,

      },
    
      onShow(){
          let userInfo = wx.getStorageSync('userInfo')
          if(userInfo && userInfo.nickName){
            this.setData({
                userInfo:userInfo
            })
          } else{

          }
      },
    // 获取用户头像
    getAvatar(e){
        const avatarUrl = e.detail.avatarUrl;
        if (avatarUrl) {
        this.setData({
        avatarUrl: avatarUrl  // 更新头像路径
        });
    }
    },
    // 获取用户昵称
    getName(e){
         // 输入框的值在 e.detail.value
        const nickName = e.detail.value;
        this.setData({
        nickName: nickName  // 更新昵称
    });
    },
    goLogin(){
        this.setData({
            isHidden: false,       // 显示弹窗
            avatarUrl: '',         // 重置头像（避免显示上次的头像）
            nickName: ''           // 重置昵称（确保输入框为空）
        })
    },
    // 退出登录
    tuichu(){
        this.setData({
            userInfo:null
        })
        wx.setStorageSync('userInfo', null)
    },
    // 弹窗登录部分
    potNo(){
        this.setData({
            isHidden: true
        })
    },
    popYes(){
        let avatarUrl = this.data.avatarUrl
        let nickName = this.data.nickName
        if(!avatarUrl){
            wx.showToast({
                icon: 'error',
                title: '请获取头像',
            })
            return
        }
        if(!nickName){
            wx.showToast({
                icon: 'error',
                title: '请获取昵称',
            })
            return
        }

        let userInfo = {}
        userInfo.avatarUrl = avatarUrl
        userInfo.nickName = nickName
        wx.setStorageSync('userInfo', userInfo)
        this.setData({
            isHidden: true,
            userInfo: userInfo
        })
    }
})
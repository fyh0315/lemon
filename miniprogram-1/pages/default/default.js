Page({
    data: {
        nickname: '乐萌萌', // 昵称数据
        phone: '18888888888', // 手机号数据
        avatarUrl: '',
        // 新增：控制编辑状态的变量
        isEditingNickname: false, // 昵称是否处于编辑状态
        isEditingPhone: false     // 手机号是否处于编辑状态
    },
  
    onLoad: function() {
      // 此调用接口获取用户真实昵称、手机号等
    },
    

     // 切换昵称编辑状态（点击条目时触发）
    toggleNicknameEdit() {
        // 如果当前是手机号编辑状态，先关闭
        if (this.data.isEditingPhone) {
        this.setData({ isEditingPhone: false });
    }
    // 切换昵称编辑状态
    this.setData({ isEditingNickname: !this.data.isEditingNickname });
  },

    // 切换手机号编辑状态
    togglePhoneEdit() {
        if (this.data.isEditingNickname) {
            this.setData({ isEditingNickname: false });
        }
        this.setData({ isEditingPhone: !this.data.isEditingPhone });
    },

    // 保存昵称（输入框失去焦点/回车时触发）
    saveNickname(e) {
        const newNickname = e.detail.value?.trim(); // 获取输入值并去除首尾空格
        if (newNickname !== this.data.nickname) {
        this.setData({ nickname: newNickname });
        // 实际项目中可在此调用接口保存到服务器
        // wx.request({ url: 'xxx', data: { nickname: newNickname } })
    }
    // 关闭编辑状态
    this.setData({ isEditingNickname: false });
    },

    // 保存手机号（带格式验证）
    savePhone(e) {
        const newPhone = e.detail.value?.trim();
        // 手机号验证：11位数字
        const phoneReg = /^1[3-9]\d{9}$/;
        if (newPhone && !phoneReg.test(newPhone)) {
            wx.showToast({
            title: '请输入正确的手机号',
            icon: 'none',
            duration: 2000
        });
        return; // 验证失败不保存
        }
        // 验证通过则更新
        if (newPhone !== this.data.phone) {
            this.setData({ phone: newPhone });
            // 实际项目中保存到服务器
            // wx.request({ url: 'xxx', data: { phone: newPhone } })
        }
        // 关闭编辑状态
        this.setData({ isEditingPhone: false });
    },

      chooseAvatar() {
    wx.chooseMedia({
      count: 1, // 最多选择1个媒体
      mediaType: ['image'], // 只允许选择图片（排除视频）
      sizeType: ['compressed'], // 只选压缩图（节省空间）
      sourceType: ['album', 'camera'], // 支持相册和相机
      success: (res) => {
        // 从返回结果中获取图片临时路径
        // res.tempFiles 是媒体文件数组，每个元素包含 tempFilePath 等信息
        const tempAvatarPath = res.tempFiles[0].tempFilePath;
        
        // 更新页面头像展示
        this.setData({
          avatarUrl: tempAvatarPath
        });

        // （可选）实际项目中可上传到服务器，并保存服务器地址
        // this.uploadAvatar(tempAvatarPath);
      },
      fail: (err) => {
        console.log('选择图片失败', err);
      }
    });
  },

  /**
   * （可选）上传头像到服务器
   */
  uploadAvatar(tempPath) {
    wx.uploadFile({
      url: 'https://你的服务器地址/upload', // 替换为实际接口
      filePath: tempPath,
      name: 'avatar', // 后端接收的字段名
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 0) {
          // 上传成功后保存服务器返回的头像地址
          wx.setStorageSync('avatar', data.url);
        }
      }
    });
  }
  })
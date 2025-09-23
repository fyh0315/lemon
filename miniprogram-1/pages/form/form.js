Page({
    data: {
        // 排练室信息
        id: '',       
        imageUrl : "",  //排练室图片
        pricePerHour: 0.0,
        openTime : "",
        closeTime : "",
        // 预约日期
        selectedDate: '',
        // 排练时间
        startTime: '09:00', // 默认开始时间
        endTime: '10:00',   // 默认结束时间
        startHour: 9,       // 开始小时（用于计算）
        endHour: 10,     // 结束小时（用于计算）
        //人数
        peopleCount: 1,  
        // 优惠信息
        discount:[],
        // 价格
        price: 0,
      },
  
      // 页面加载时接收参数并请求数据
    onLoad(options) {
        // 接收前一页传递的id（如：pages/roomDetail/roomDetail?id=123）
        this.setData({ id: options.id }, () => {
          this.getRoomData(); // 回调中请求数据，确保id已赋值
        // 设置默认日期为当天
        this.setDefaultDate();
        });
      },

     // 页面显示时也更新日期（确保从后台返回时日期正确）
     onShow() {
        this.setDefaultDate();
      },
      
      // 设置默认日期为当天
      setDefaultDate() {
        const today = new Date();
        const year = today.getFullYear();
        // 月份从0开始，需要+1，并且确保两位数
        const month = String(today.getMonth() + 1).padStart(2, '0');
        // 日期确保两位数
        const day = String(today.getDate()).padStart(2, '0');
        // 格式化为YYYY-MM-DD，符合小程序date picker要求
        const formattedDate = `${year}-${month}-${day}`;
        
        this.setData({
          selectedDate: formattedDate
        });
      },
      
    
    // 根据id请求排练室数据
    getRoomData() {
        wx.request({
          url: 'https://your-api.com/roomdetail?roomid=id', 
          // 后端接口（需替换为实际地址）
          method: 'GET',
          success: (res) => {
            if (res.data.code === 200) { // 假设后端返回code=200为成功
              const data = res.data.data;
              this.setData({    
                imageUrl: data.imageUrl,
                name: data.name,
                // description: data.description,
                pricePerHour: data.pricePerHour,
                openTime: data.openTime,
                closeTime: data.closeTime,
                // tags: data.tags,
                // address: data.address,
                // phone: data.phone,
                // devices: data.devices,
                discount: data.discount,
              });
            }
          },
          fail: (err) => {
            console.error('获取排练室数据失败', err);
            wx.showToast({ title: '数据加载失败', icon: 'none' });
          }
        });
      },

    handleDateChange(e) {
        this.setData({
          selectedDate: e.detail.value
        });
    },

    // 开始时间选择事件
    handleStartTimeChange(e) {
      const time = e.detail.value;
      const hour = time.split(':')[0];
      this.setData({
        startTime: time,
        startHour: parseInt(hour)
      });
      this.validateTimeRange(); // 验证时间范围
    },
  
    // 结束时间选择事件
    handleEndTimeChange(e) {
      const time = e.detail.value;
      const hour = time.split(':')[0];
      this.setData({
        endTime: time,
        endHour: parseInt(hour)
      });
      this.validateTimeRange(); // 验证时间范围
    },
  
    // 时间范围验证
    validateTimeRange() {
      const { startHour, endHour } = this.data;
      if (endHour <= startHour) {
        wx.showToast({
          title: '结束时间需晚于开始时间',
          icon: 'none',
          duration: 1500
        });
        // 自动调整结束时间为开始时间+1小时
        this.setData({
          endTime: `${startHour + 1}:00`,
          endHour: startHour + 1
        });
      }
    },

    // 点击向上箭头：人数+1
    handlePeopleCountUp() {
    this.setData({
      peopleCount: this.data.peopleCount + 1
    });
    },

    // 点击向下箭头：人数-1（最小为1）
    handlePeopleCountDown() {
    if (this.data.peopleCount > 1) { // 防止人数小于1
      this.setData({
        peopleCount: this.data.peopleCount - 1
      });
    }
  },

    // 输入框手动输入时的校验（确保是正整数）
    handlePeopleCountInput(e) {
    let value = e.detail.value;
    // 过滤非数字字符
    value = value.replace(/[^\d]/g, '');
    // 转换为数字（如果为空或0，默认设为1）
    const count = value ? parseInt(value, 10) : 1;
    this.setData({
      peopleCount: count < 1 ? 1 : count // 确保最小为1
    });
  },

  });
Page({
    data: {
        id: '',
        name: '',       
        imageUrl : "", 
        pricePerHour: 0,
        openTime : "",
        closeTime : "",
        // 预约日期
        selectedDate: '',
        // 可预约时间
        rhsStartTime: '09:00',
        thsEndTime: '22:00',
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

        lastValidDate: '', // 上一次有效的可预约日期（用于回滚）
        bookableDates: [],// 可预约日期
      },
  
    // 页面加载时接收参数并请求数据
    onLoad(options) {
        // 接收参数（id和name直接获取，imageurl需要解码）
        const id = options.id;
        const name = options.name;
        const imageurl = options.imageurl; // 解码url
        
        // 后续可将参数存到data中使用
        this.setData({
          id,
          name,
          imageurl
        },() => {
            this.getRoomData();
        });
    },

     // 页面显示时也更新日期（确保从后台返回时日期正确）
     onShow() {
        this.getRoomData();
      },
      
      getRoomData() {
        wx.request({
          url: `https://your-api.com/roomdetail?roomid=${this.data.id}`,
          method: 'GET',
          success: (res) => {
            if (res.data.code === 200) { 
                // 取出后端返回的可预约日期列表
                const bookableDates = res.data.data;
                this.setData({    
                    bookableDates: bookableDates, // 存储可预约日期
                    lastValidDate: bookableDates[0] || '' // 初始lastValidDate为首个可预约日期
                }, () => {
                    // 2. 确保bookableDates获取后，再设置默认日期（关键：解决异步顺序问题）
                    this.setDefaultDate();
                    this.calculatePrice();
                });
      
                // 3. 边界处理：若暂无可预约日期，提前提示
                if (bookableDates.length === 0) {
                    wx.showToast({ title: '暂无可预约日期', icon: 'none', duration: 2000 });
                }
            }
          },
          fail: (err) => {
            console.error('获取排练室数据失败', err);
            wx.showToast({ title: '数据加载失败', icon: 'none' });
          }
        });
      },

      // 设置默认日期为当天或第一个可预约日期
      setDefaultDate() {
        const { bookableDates } = this.data;
        if (bookableDates.length === 0) return; // 无可用日期，直接返回
      
        // 1. 获取当天的 "YYYY-MM-DD" 格式
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
      
        // 2. 若当天可预约，默认用当天；否则用第一个可预约日期
        let defaultDate = bookableDates.includes(todayStr) ? todayStr : bookableDates[0];
      
        this.setData({
          selectedDate: defaultDate,
          lastValidDate: defaultDate // 同步更新lastValidDate
        });
      },

    //判断是否为可预约日期
      isDateBookable(date) {
        const { bookableDates } = this.data;
        if (bookableDates.length === 0) return true; // 无可用日期时，全部禁用
      
        // 1. 把日期对象转换成 "YYYY-MM-DD" 格式（和后端可预约日期格式对齐）
        const year = date.year;
        const month = String(date.month).padStart(2, '0'); // 补0（如10月→10，9月→09）
        const day = String(date.day).padStart(2, '0');
        const currentDateStr = `${year}-${month}-${day}`;
      
        // 2. 检查当前日期是否在可预约列表中：不在则禁用（返回true）
        return !bookableDates.includes(currentDateStr);
      },

    // handleDateChange(e) {
    //     this.setData({
    //       selectedDate: e.detail.value
    //     });
    // },

    handleDateChange(e) {
        const selectedDate = e.detail.value; // 用户新选的日期
        const { bookableDates, lastValidDate } = this.data;
      
        // 1. 校验：新选的日期是否在可预约列表中
        if (bookableDates.includes(selectedDate)) {
          // 可预约：更新选中日期和lastValidDate
          this.setData({
            selectedDate: selectedDate,
            lastValidDate: selectedDate // 记录当前有效日期，用于后续回滚
          });
        } else {
          // 不可预约：弹提示+回滚到上一次有效日期
          wx.showToast({ 
            title: '该日期不可预约，请选择其他日期', 
            icon: 'none', 
            duration: 1500 
          });
          this.setData({
            selectedDate: lastValidDate // 回滚
          });
        }
      },


    

    //  获取预约当天可预约时间段
    getAppointmentSlots(date) {
        const storeId = id;
        wx.request({
            url: `http://test-cn.your-api-server.com/appointment/${storeId}/time-slots?date=${selectedDate}`,
            method: 'GET',
            success(res) {
                const slots = res.data.data; 
                this.setData({
                rhsStartTime: slots.startTime,
                thsEndTime: slots.endTime,
                });
            }
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
      this.getPriceFromBackend(); // 请求价格
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
      this.getPriceFromBackend();
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


  //   价格校验
  getPriceFromBackend() {
    const { id: roomId, selectedDate, startTime, endTime } = this.data;
  
    // 边界校验：未选日期/时间时，不发请求并提示
    if (!selectedDate || !startTime || !endTime) {
      wx.showToast({ title: '请先选择日期和时间', icon: 'none' });
      this.setData({ price: 0 }); // 重置价格为0
      return;
    }
  
    // 发送请求到后端价格接口（需替换为你的实际接口地址）
    wx.request({
      url: 'https://your-api.com/calculate-price', // 后端计算价格的接口
      method: 'POST', 
      data: {
        roomId: roomId,       // 排练室ID
        appointmentDate: selectedDate,   // 预约日期（YYYY-MM-DD）
        startTime: startTime, // 开始时间（HH:MM）
        endTime: endTime      // 结束时间（HH:MM）
        // 若后端需要人数计算价格，补充：peopleCount: this.data.peopleCount
      },
      header: { 'content-type': 'application/json' },
      success: (res) => {
        if (res.data.code === 200 && res.data.data?.price !== undefined) {
          // 成功：更新显示的价格
          this.setData({ price: res.data.data.price });
        } else {
          // 失败：提示用户并重置价格
          wx.showToast({ title: res.data.msg || '获取价格失败', icon: 'none' });
          this.setData({ price: 0 });
        }
      },
      fail: (err) => {
        console.error('请求后端价格失败：', err);
        wx.showToast({ title: '网络错误，无法获取价格', icon: 'none' });
        this.setData({ price: 0 });
      },
      complete: () => {
        // 无论成功失败，都关闭加载提示
        wx.hideLoading();
      }
    });
  },



  handleSubmit() {
    // 1. 先获取本地存储的用户唯一标识（userId）
    const userId = wx.getStorageSync('userId'); // 从本地缓存读取userId
    
    // 2. 校验用户是否已登录（无userId则无法提交订单）
    // if (!userId) {
    //   wx.showToast({ title: '请先登录', icon: 'none' });
    //   // 引导用户跳转到登录页
    //   setTimeout(() => {
    //     wx.navigateTo({ url: '/pages/login/login' });
    //   }, 1500);
    //   return;
    // }
  
    // 3. 收集表单数据（新增userId）
    const { 
      id, selectedDate, startTime, endTime, 
      peopleCount, price, pricePerHour 
    } = this.data;
    
    // 4. 基础数据验证（同上）
    if (!selectedDate) {
      wx.showToast({ title: '请选择日期', icon: 'none' });
      return;
    }
    if (price <= 0) {
      wx.showToast({ title: '请选择有效的时间段', icon: 'none' });
      return;
    }
  
    // 5. 显示加载中提示
    wx.showLoading({ title: '提交中...' });
  
    // 6. 发送请求（新增userId字段）
    wx.request({
      url: 'https://your-api.com/submit-order', 
      method: 'POST',
      data: {
        userId: userId,          // 用户唯一标识（核心关联字段）
        storeId: id,              // 排练室ID
        appointmentDate: selectedDate,      // 预约日期
        startTime: startTime,               // 开始时间
        endTime: endTime,                 // 结束时间
        expectedPeople: peopleCount,             // 人数
        couponId: couponId || null,
        
        contactPhone: contactPhone || null,
        contactName: contactName || null,
        remark: remark || null,
      },
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({ title: '预约成功' });
          // 跳转到订单成功页（可携带订单ID，方便后续查看详情）
          setTimeout(() => {
            wx.navigateTo({ 
              url: `/pages/result/result?id=${this.data.id}` 
            });
          }, 1500);
        } else {
          wx.showToast({ title: res.data.msg || '提交失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('提交失败', err);
        wx.showToast({ title: '网络错误，请重试', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });

    wx.navigateTo({ 
        url: `/pages/result/result?id=${this.data.id}` 
      });
  }

  });
Page({
    data: {
      startTime: '09:00', // 默认开始时间
      endTime: '10:00',   // 默认结束时间
      startHour: 9,       // 开始小时（用于计算）
      endHour: 10         // 结束小时（用于计算）
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
    }
  });
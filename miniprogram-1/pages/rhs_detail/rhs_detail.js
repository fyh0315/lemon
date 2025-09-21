Page({
    data: {
      id: '',         // 接收的排练室ID
      slides: [],     // 幻灯片数据,此处待修改
      imageUrl : "",
      description: '',
      pricePerHour: 0.0,
      openTime : "",
      closeTime : "",
      tags : "",
      address : "",
      phone : "",
      devices :[],
      discount:[],
    },
  
    // 页面加载时接收参数并请求数据
    onLoad(options) {
      // 接收前一页传递的id（如：pages/roomDetail/roomDetail?id=123）
      this.setData({ id: options.id }, () => {
        this.getRoomData(); // 回调中请求数据，确保id已赋值
      });
    },
  
    // 根据id请求排练室数据
    getRoomData() {
      wx.request({
        url: 'https://your-api.com/room/${this.data.id}', 
        // 后端接口（需替换为实际地址）
        method: 'GET',
        success: (res) => {
          if (res.data.code === 200) { // 假设后端返回code=200为成功
            const data = res.data.data;
            this.setData({
              slides: data.slides,      
              imageUrl: data.imageUrl,
              // 轮播图数据（数组，含title等字段）
              name: data.name,
              description: data.description,
              pricePerHour: data.pricePerHour,
              openTime: data.openTime,
              closeTime: data.closeTime,
              tags: data.tags,
              address: data.address,
              phone: data.phone,
              devices: data.devices,
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
  
    // 跳转地图（根据地址打开地图）
    toMap() {
      // 需提前通过后端接口获取排练室的经纬度
      wx.openLocation({
        latitude: this.data.roomInfo.latitude || 31.230416, // 示例纬度（需替换为实际值）
        longitude: this.data.roomInfo.longitude || 121.473701, // 示例经度（需替换为实际值）
        address: this.data.roomInfo.location,
      });
    },
  
    // 拨打电话
    makeCall() {
      wx.makePhoneCall({
        phoneNumber: this.data.roomInfo.phone || '10123456789', // 示例电话（需替换为实际值）
      });
    },
  
    // 抢购优惠卡
    buyCard() {
      wx.navigateTo({
        url: `/pages/buyCard/buyCard?roomId=${this.data.id}`, // 跳转到购买页并传id
      });
    },
  
    // 跳转客服
    toService() {
      wx.navigateTo({ url: '/pages/service/service' }); // 跳转到客服页
    },
  
    // 标记“喜欢”
    likeRoom() {
      // 调用后端接口标记“喜欢”，这里简单提示
      wx.showToast({ title: '已添加到“我的喜欢”', icon: 'success' });
    },
  
    // 立即预订
    bookNow() {
      wx.navigateTo({
        url: '/pages/form/form?id=${this.data.id}', // 跳转到预订页并传id
      });
    },
  });
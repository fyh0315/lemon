Page({
    data: {
      id: '',         // 接收的排练室ID
      name: "",
      slides: [],     // 幻灯片数据,此处待修改
      imageUrl : "",
      description: '',
      pricePerHour: 0.0,
      openTime : "",
      closeTime : "",
      tags : "",
      address : "",
      phone : "",
      status : 0,
      devices :[],
      discount:[],
    },
  
    // 页面加载时接收参数并请求数据
    onLoad(options) {
        // 把 options 里的每个参数解码后，直接赋值给 data 对应字段
        this.setData({
          id: decodeURIComponent(options.id || ""),
          name: decodeURIComponent(options.name || ""),
          imageUrl: decodeURIComponent(options.imageUrl || ""),
          description: decodeURIComponent(options.description || ""),
          pricePerHour: decodeURIComponent(options.pricePerHour || 0),
          openTime: decodeURIComponent(options.openTime || ""),
          closeTime: decodeURIComponent(options.closeTime || ""),
          tags: decodeURIComponent(options.tags || ""),
          address: decodeURIComponent(options.address || ""),
          phone: decodeURIComponent(options.phone || ""),
          status: decodeURIComponent(options.status || 0)
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
        url: '/pages/form/form?id=${this.data.id}`', // 跳转到预订页并传数据
      });
    },
  });
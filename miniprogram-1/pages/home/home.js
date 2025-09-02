Page({
    // 填充逻辑待修改 目前为静态页面
    data: {
      // 排练时长数据
      practiceTime: '49 小时',
      practiceSub: '较上月提升5h',
      practiceDesc: '“于是，辣个无敌的吉他手诞生了……”',
      // 优惠金额数据
      discountAmount: '130 ￥',
      discountSub: '较上月提升30￥',
      discountDesc: '“难道你真的是省钱的天才？”'
    },
  
    onLoad() {
      // 页面加载时添加网络请求或数据初始化逻辑
      // 动态获取数据，在此处调用接口更新 data
      // wx.request({ })
        
    },

    //跳转至排练室list
    onTapGoRehearsal() {
        wx.navigateTo({
          url: '/pages/rehearsal/rehearsal', 
          success: () => {
            console.log("跳转去排练页成功"); //调试用
          },
          fail: (err) => {
            console.error("跳转失败：", err); 
          }
        });
      }
  })
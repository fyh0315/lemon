Page({
    /**
     * 页面的初始数据
     */
    data: {
      searchKeyword: "",  // 用户输入的搜索关键词
      suggestList: [],    // 接口返回的排练室名称建议列表
      showNoSuggest: false,  // 是否显示“无建议”提示
      debounceTimer: null  // 防抖定时器（避免频繁请求）
    },
  
    /**
     * 用户输入时触发：防抖后调用接口
     */
    onInputChange(e) {
      const keyword = e.detail.value.trim();  // 获取输入框的值（去空格）
      this.setData({ searchKeyword: keyword });  // 更新关键词到data
  
      // 1. 若关键词为空：清空建议列表和无建议提示
      if (!keyword) {
        this.setData({ suggestList: [], showNoSuggest: false });
        return;
      }
  
      // 2. 用户停止输入500ms后再调用接口
      clearTimeout(this.data.debounceTimer);  // 清空之前的定时器
      const newTimer = setTimeout(() => {
        this.getRehearsalSuggest(keyword);  // 调用接口
      }, 500);  // 延迟500ms，可按需调整
      this.setData({ debounceTimer: newTimer });
    },
  
    /**
     * 调用“排练室名称建议接口”
     */
    getRehearsalSuggest(keyword) {
      const that = this;  // 保存this指向（避免回调中this丢失）
      const limit = 10;  // 最多返回10条建议，按需调整
  
      // 小程序原生请求：wx.request
      wx.request({
        url: `http://test-cn.your-api-server.com/store/search/suggest`,  // 接口地址
        method: "GET", 
        data: { 
          keyword: encodeURIComponent(keyword),  // 处理中文/特殊字符
          limit: limit
        },
        header: {
          "content-type": "application/json" 
        },
        /**
         * 请求成功回调（接口有响应，无论code是1还是0）
         */
        success(res) {
          const result = res.data;  // 接口返回的数据
          if (result.code === 1) {
            const suggestList = result.data || [];
            that.setData({
              suggestList: suggestList,
              showNoSuggest: suggestList.length === 0  // 无数据时显示“无建议”
            });
          } else {
            // 接口返回失败（如关键词太短、参数错误）
            wx.showToast({  // 提示用户错误信息
              title: result.msg || "获取建议失败",
              icon: "none",  // 不显示图标
              duration: 1500  // 提示时长
            });
            that.setData({ suggestList: [], showNoSuggest: false });
          }
        },
        /**
         * 请求失败回调（网络错误、接口地址无效等）
         */
        fail(error) {
          wx.showToast({
            title: "网络错误，请重试",
            icon: "none",
            duration: 1500
          });
          that.setData({ suggestList: [], showNoSuggest: false });
          console.error("接口请求失败：", error);  // 打印错误日志，方便调试
        }
      });
    },

  
  
    /**
     * 页面销毁时：清空定时器（避免内存泄漏）
     */
    onUnload() {
      clearTimeout(this.data.debounceTimer);
    }
  });
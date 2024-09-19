Component({
  data: {
    autosize: {
      maxHeight: 120,
      minHeight: 20,
    },
    content: "",
    // 当前登录者信息
    login: {
      id: "user",
      user: "emo",
    },
    pendingReply: false,
    moveTop: 0,
    deductHeight: 0,
    bottom: 0,
    // 聊天信息
    chatList: [],
  },
  methods: {
    onBack() {
      wx.navigateBack();
    },
    onLoad() {
      this.scrollToBottom();
    },
    inputClick(e) {
      this.setData({
        content: e.detail.value,
      });
    },
    onFocus(e) {
      let query = wx.createSelectorQuery();
      let screenHeight = wx.getWindowInfo().screenHeight;
      query
        .select("#prompt")
        .boundingClientRect((rect) => {
          const move =
            ((rect.height + e.detail.height) / screenHeight) * 100 - 86;
          console.log(move);
          this.setData({ moveTop: move >= 0 ? move : 0 });
        })
        .exec();
      this.setData({ bottom: e.detail.height, moveTop: 0 });
    },
    onBlur(e) {
      this.setData({ bottom: 0, moveTop: 0 });
    },
    // 发送监听
    sendClick() {
      var that = this;
      var list = this.data.chatList;
      // 组装数据
      var msg = {
        msgId: this.data.login.id,
        message: this.data.content,
        type: "text",
      };
      var botMsg = {
        msgId: "bot",
        message: "testReply",
        type: "text",
      };
      this.setData(
        {
          chatList: list.concat(msg),
        },
        () => {
          //   that.scrollToBottom();
          that.setData({
            content: "",
          });
        }
      );
      setTimeout(() => {
        this.setData({ pendingReply: true });
      }, 10);
      list = list.concat(msg);
      setTimeout(() => {
        this.setData(
          { chatList: list.concat(botMsg), pendingReply: false },
          () => {
            that.scrollToBottom();
          }
        );
      }, 4000);
    },
    // 滑动到最底部
    scrollToBottom() {
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 200000,
          duration: 3,
        });
      }, 600);
    },
  },
});

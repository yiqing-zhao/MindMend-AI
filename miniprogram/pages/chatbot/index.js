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
    botReply: "",
    // 聊天信息
    chatList: [],
    scrollTop: 0,
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
            ((rect.height + e.detail.height) / screenHeight) * 100 - 76;
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
        message:
          botReply == ""
            ? "I'm sorry to hear that you're not feeling good, Sally. Do you want to talk about what's been bothering you? Sometimes sharing can make a big difference."
            : botReply,
        type: "text",
      };
      this.setData(
        {
          chatList: list.concat(msg),
        },
        () => {
          wx.createSelectorQuery()
            .select("#scrollList")
            .boundingClientRect(function (rect) {
              wx.pageScrollTo({
                scrollTop: rect.height,
                duration: 100, // 滑动速度
              });
              that.setData({
                scrollTop: rect.height - that.data.scrollTop,
              });
            })
            .exec();
          that.setData({
            content: "",
          });
        }
      );
      setTimeout(() => {
        this.setData({ pendingReply: true });
      }, 10);
      list = list.concat(msg);
      wx.request({
        url:
          "https://mindmend.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview",
        headers: {
          "Content-Type": "application/json",
          "api-key": "<<Your API Key>>",
        },
        method: "POST",
        data: {
          messages: [
            {
              role: "system",
              content: [
                {
                  type: "text",
                  text:
                    "You are a psychological consultant AI bot to support people.",
                },
              ],
            },
          ],
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 800,
        },
        dataType: "json",
        success(res) {
          this.setData({
            botReply: res.data,
          });
        },
      });

      setTimeout(() => {
        this.setData({
          chatList: list.concat(botMsg),
          pendingReply: false,
        });
      }, 4000);
    },
  },
});

Page({
  gotoBotPage() {
    wx.navigateTo({
      url: "/pages/chatbot/index",
    });
  },
  gotoDiagnosticPage() {
    wx.navigateTo({
      url: "/pages/diagnostic/index",
    });
  },
});

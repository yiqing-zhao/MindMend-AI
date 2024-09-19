Page({
  bindload(res) {
    console.log(res, res.detail);
  },
  binderror(err) {
    console.log(err, err.detail);
  },
});

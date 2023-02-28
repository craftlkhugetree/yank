// var url = "http://172.20.0.188:9000/";         // 开发环境
var url = "https://dwc.dev.angke.cn/"; // 开发环境

window.apiUrls = {
  readIdCard: "http://127.0.0.1:19196/readcard", // 读取身份证接口地址
  searchOrder: url + "angke-smartfactory/bill/getOrders", // 查询订单接口地址-根据身份证
  searchOrderByCard: url + "angke-smartfactory/bill/findByCardNo", // 查询订单接口地址-根据卡号
  saveCard: url + "angke-smartfactory/bill/openCard", // 保存开卡数据
  backCard: url + "angke-smartfactory/bill/returnCard", // 归还卡片
};

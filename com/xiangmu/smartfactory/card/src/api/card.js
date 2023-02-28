import service from "@/assets/js/util";

// 读取身份证号
export function readIdCard() {
  return service.postAjax({
    type: "GET",
    url: window.apiUrls.readIdCard + "&t=" + Math.random(),
  });
}

// 查询订单-根据身份证
export function searchOrderByID(data) {
  return service.postAjax({
    type: "POST",
    url: window.apiUrls.searchOrder,
    data,
  });
}

// 查询订单-根据卡号
export function searchOrderByCard(data) {
  return service.postAjax({
    type: "POST",
    url: window.apiUrls.searchOrderByCard,
    data,
  });
}

// 保存开卡数据
export function saveCard(data) {
  return service.postAjax({
    type: "POST",
    url: window.apiUrls.saveCard,
    isRep: true,
    data,
  });
}

// 归还卡片
export function backCard(id) {
  return service.postAjax({
    type: "GET",
    url: `${window.apiUrls.backCard}/${id}`,
  });
}

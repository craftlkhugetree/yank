import service from "@/assets/js/util";

// 消息列表
export function fetchMessageList(data) {
  return service.postAjax({
    code: 'url',
    url: 'message/pageQuery',
    data,
    isRep: true
  })
};

// 消息的详情
export function fetchMsgDetail(data) {
  return service.postAjax({
    code: 'url',
    url: 'message/findById',
    data,
  })
};






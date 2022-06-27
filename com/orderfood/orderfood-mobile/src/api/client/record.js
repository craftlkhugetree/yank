import service from "@/assets/js/util";

// 分页记录
export function fetchRecordList(data) {
  return service.postAjax({
    code: 'url',
    url: 'order/pageQuery',
    data,
    isRep: true
  })
};

// 地址
export function fetchAddress(data) {
  return service.postAjax({
    code: 'url',
    url: 'address/myAddress',
    data,
    isRep: true
  })
};

//保存地址
export function saveAddress(data) {
  return service.postAjax({
    code: 'url',
    url: 'address/save',
    data,
    isRep: true

  })
};






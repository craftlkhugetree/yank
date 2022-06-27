import service from "@/assets/js/util";

// 楼宇
export function fetchAreas(data) {
  return service.postAjax({
    code: 'url',
    url: 'area/areas',
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


// 地址详情
export function fetchAddressById(data) {
  return service.postAjax({
    code: 'url',
    url: 'address/findById',
    data,
  })
};

// 地址删除
export function fetchAddressDelete(data) {
  return service.postAjax({
    code: 'url',
    url: 'address/delete',
    data,
  })
};




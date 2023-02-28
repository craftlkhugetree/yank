import service from "@/assets/js/util";

// 预约首页所有资源列表
export function fetchResGrouptList(data) {
  return service.postAjax({
    code: 'url',
    url: 'resgroup/itemsFillRes',
    data,
    isRep: true
  })
}

// 资源集下的资源
export function fetchResList(data) {
  return service.postAjax({
    code: 'url',
    url: 'res/pageQuery',
    data,
    isRep: true
  })
}

// 资源详情
export function fetchResDetail(data) {
  return service.postAjax({
    code: 'url',
    url: 'res/findById',
    data,
  })
}

// 查询资源已被约的时间段
export function fetchHasAppoint(data) {
  return service.postAjax({
    code: 'url',
    url: 'res/noReservation',
    data,
  })
}
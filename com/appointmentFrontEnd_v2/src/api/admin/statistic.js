import service from '@/assets/js/util';

// 总览
export function dataOverview(data) {
  return service.postAjax({
    code: 'url',
    url: '/data/overview',
    data,
  });
}


// 预约次数对比分析
export function datayycsdbfx(data) {
  return service.postAjax({
    code: 'url',
    url: '/data/yycsdbfx',
    data,
  });
}

// 预约次数趋势分析
export function datayycsqsfx(data) {
  return service.postAjax({
    code: 'url',
    url: '/data/yycsqsfx',
    data,
  });
}

// 预约时长趋势分析
export function datayyscqsfx(data) {
  return service.postAjax({
    code: 'url',
    url: '/data/yyscqsfx',
    data,
  });
}

// 时间段
export function datasjdyycsfb(data) {
  return service.postAjax({
    code: 'url',
    url: '/data/sjdyycsfb',
    data,
  });
}

// 预约次数top10
export function dataorderTop10(data) {
  return service.postAjax({
    code: 'url',
    url: '/data/orderTop10',
    data,
  });
}

// 取消次数top10
export function datacancelTop10(data) {
  return service.postAjax({
    code: 'url',
    url: '/data/cancelTop10',
    data,
  });
}

// 未签到top10
export function dataunCheckinTop10(data) {
  return service.postAjax({
    code: 'url',
    url: '/data/unCheckinTop10',
    data,
  });
}
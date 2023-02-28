import service from '@/assets/js/util';

// 获取列表
export function pageQueryUnload(data) {
  return service.postAjax({
    code: 'url',
    url: 'order/query',
    isRep: true,
    data,
  });
}

// 删除
export function deleteUnload(id) {
  return service.postAjax({
    code: 'url',
    url: `order/delete/${id}`,
    isGet: true,
  });
}

// 保存
export function saveUnload(data) {
  return service.postAjax({
    code: 'url',
    url: 'order/save',
    isRep: true,
    data,
  });
}

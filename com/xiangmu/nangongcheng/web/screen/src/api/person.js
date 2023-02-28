import service from '@/assets/js/util';

// 角色列表
export function personQuery(data) {
  return service.postAjax({
    code: 'url',
    url: 'person/query',
    isRep: true,
    // loadingText: '',
    data,
  });
}

// 批量保存
export function personSaveBatch(data) {
  return service.postAjax({
    code: 'url',
    url: '/person/saveBatch',
    isRep: true,
    data,
  });
}

// 移动
export function personMove(data, direction) {
  return service.postAjax({
    code: 'url',
    url: '/person/' + direction,
    data,
  });
}
// 删除
export function personDelete(data) {
  return service.postAjax({
    code: 'url',
    url: '/person/delete/' + data,
    isGet: true,
  });
}

export function personFind(data) {
  return service.postAjax({
    code: 'url',
    url: '/person/find/' + data,
    isGet: true,
  });
}

export function personSave(data) {
  return service.postAjax({
    code: 'url',
    url: '/person/save',
    isRep: true,
    data,
  });
}

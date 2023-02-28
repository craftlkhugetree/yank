import service from '@/assets/js/util';

// 角色列表
export function QUERY(data) {
  let pre = data.apiPre
  const left = {...data}
  delete left.apiPre
  return service.postAjax({
    code: 'url',
    url: `/${pre}/query`,
    isRep: true,
    // loadingText: '',
    data: left,
  });
}

// 批量保存
export function SAVEBATCH(data, pre) {
  return service.postAjax({
    code: 'url',
    url: `/${pre}/saveBatch`,
    isRep: true,
    data,
  });
}

// 删除
export function DELETE(data, pre) {
  return service.postAjax({
    code: 'url',
    url: `/${pre}/delete/` + data,
    isGet: true,
  });
}

export function FIND(data, pre) {
  return service.postAjax({
    code: 'url',
    url: `/${pre}/find/` + data,
    isGet: true,
  });
}

export function SAVE(data, pre) {
  return service.postAjax({
    code: 'url',
    url: `/${pre}/save`,
    isRep: true,
    data,
  });
}

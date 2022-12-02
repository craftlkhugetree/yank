import service from '@/assets/js/util';

// 门禁列表
export function apAccLevelPageQuery(data) {
  return service.postAjax({
    code: 'url',
    url: '/apAccLevel/pageQuery',
    isRep: true,
    // loadingText: '',
    data,
  });
}

// 门禁列表
export function apAccLevelSave(data) {
  return service.postAjax({
    code: 'url',
    url: '/apAccLevel/save',
    isRep: true,
    loadingText: '保存中',
    data,
  });
}

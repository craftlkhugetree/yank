import service from '@/assets/js/util';

// 保存黑名单
export function apBlacklistSave(data) {
  return service.postAjax({
    code: 'url',
    url: '/apBlacklist/save',
    isRep: true,
    data,
  });
}

// 删除黑名单
export function apBlacklistDelete(data) {
  return service.postAjax({
    code: 'url',
    url: '/apBlacklist/delete/' + data,
    isGet: true,
  });
}

// 黑名单列表
export function apBlacklistPageQuery(data) {
  return service.postAjax({
    code: 'url',
    url: '/apBlacklist/pageQuery',
    isRep: true,
    data,
    loadingText: '查询中',
  });
}

// 违规记录列表
export function apViolationRecordPageQuery(data) {
  return service.postAjax({
    code: 'url',
    url: '/apViolationRecord/pageQuery',
    isRep: true,
    data,
    loadingText: '查询中',
  });
}

// 保存违规记录
export function apViolationRecordSave(data) {
  return service.postAjax({
    code: 'url',
    url: '/apViolationRecord/save',
    isRep: true,
    data,
  });
}

// 保存黑名单规则
export function apBlacklistRuleSaveBatch(data) {
  return service.postAjax({
    code: 'url',
    url: '/apBlacklistRule/saveBatch',
    isRep: true,
    data,
  });
}

// 查询黑名单规则
export function apBlacklistRulePageQuery(data) {
  return service.postAjax({
    code: 'url',
    url: '/apBlacklistRule/pageQuery',
    isRep: true,
    data,
  });
}

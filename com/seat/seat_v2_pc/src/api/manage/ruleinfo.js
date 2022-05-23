import service from "@/assets/js/util";
// 通知公告--- 规章制度
// 列表  
export function fetchRuleInfo(data) {
    return service.postAjax({
        code: "url",
        url: "ruleinfo/pageQuery",
        isRep: true,
        data,
    })
}

//保存  
export function saveRuleInfo(data) {
    return service.postAjax({
        code: "url",
        url: "ruleinfo/save",
        isRep: true,
        data,
    })
}

// 详情
export function queryById(data) {
    return service.postAjax({
        code: "url",
        url: "ruleinfo/findById",
        data,
    })
}

// 删除
export function deleteRuleInfo(data) {
    return service.postAjax({
        code: "url",
        url: "ruleinfo/delete",
        data,
    })
}

import service from "@/assets/js/util";

// 规则列表
export function fetchRuleList(data) {
    return service.postAjax({
        code: "url",
        url: "rule/pageQuery",
        isRep: true,
        data,
    })
}

// 所有规则
export function fetchRules(data) {
    return service.postAjax({
        code: "url",
        url: "rule/items",
        isRep: true,
        data,
    })
}

// 保存
export function saveRule(data) {
    return service.postAjax({
        code: "url",
        url: "rule/save",
        isRep: true,
        data,
    })
}

// 规则详情
export function fetchRuleById(data) {
    return service.postAjax({
        code: "url",
        url: "rule/findById",
        data,
    })
}

// 删除
export function deleteRule(data) {
    return service.postAjax({
        code: "url",
        url: "rule/delete",
        data,
    })
}
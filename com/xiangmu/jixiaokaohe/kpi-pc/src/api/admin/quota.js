import service from "@/assets/js/util";
import store from "@/store";

// 绩效额度列表
export function fetchQuotaList(data) {
    return service.postAjax({
        code: "url",
        url: "kpiquota/items",
        isRep: true,
        data
    })
}

// 保存绩效额度
export function saveQuota(data) {
    return service.postAjax({
        code: "url",
        url: "kpiquota/save",
        isRep: true,
        data
    })
}

// 获取操作记录
export function fetchQuotaRecord(data) {
    return service.postAjax({
        code: "url",
        url: "kpiquota/queryEvents",
        data
    })
}

import service from "@/assets/js/util";
import store from "@/store";

// 获取领导岗位级别列表
export function fetchLevelList() {
    return service.postAjax({
        code: "url",
        url: "joblv/items",
        isRep: true,
        data: {}
    })
}

// 保存领导岗位级别
export function saveLevel(data) {
    return service.postAjax({
        code: "url",
        url: "joblv/save",
        isRep: true,
        data
    })
}

// 删除领导岗位级别
export function deleteLevel(data) {
    return service.postAjax({
        code: "url",
        url: "joblv/delete",
        data
    })
}

// 获取操作记录
export function fetchLevelRecord(data) {
    return service.postAjax({
        code: "url",
        url: "joblv/queryEvents",
        data
    })
}

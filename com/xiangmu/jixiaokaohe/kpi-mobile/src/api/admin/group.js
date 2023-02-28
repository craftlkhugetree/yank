import service from "@/assets/js/util";
import store from "@/store";

// 获取考核分组列表
export function fetchGroupList() {
    return service.postAjax({
        code: "url",
        url: "group/items",
        isRep: true,
        data: {}
    })
}

// 获取详情
export function fetchGroupDetail(data) {
    return service.postAjax({
        code: "url",
        url: "group/findById",
        data
    })
}

// 删除
export function deleteGroup(data) {
    return service.postAjax({
        code: "url",
        url: "group/delete",
        data
    })
}

// 保存
export function saveGroup(data) {
    return service.postAjax({
        code: "url",
        url: "group/saveGroup",
        isRep: true,
        data
    })
}

// 保存考核组名称
export function saveGroupName(data) {
    return service.postAjax({
        code: "url",
        url: "group/editGroupName",
        isRep: true,
        data
    })
}

// 保存分管领导
export function saveGroupLeader(data) {
    return service.postAjax({
        code: "url",
        url: "group/saveGroupLeader",
        isRep: true,
        data
    })
}
// 保存工作组
export function saveGroupWorker(data) {
    return service.postAjax({
        code: "url",
        url: "group/saveGroupWork",
        isRep: true,
        data
    })
}
// 保存被考核人
export function saveGroupUser(data) {
    return service.postAjax({
        code: "url",
        url: "group/saveGroupUser",
        isRep: true,
        data
    })
}

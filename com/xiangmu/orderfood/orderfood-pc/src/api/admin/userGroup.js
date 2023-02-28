import service from "@/assets/js/util";
import store from "@/store";

// 用户组列表
export function fetchGroupList() {
    return service.postAjax({
        code: "auth",
        url: "rest/UserGroup/getList",
        data: {
            page: 1,
            limit: 1000,
            filter: JSON.stringify({
                APPID: store.state.GROUPID
            }),
        }
    })
}

// 保存用户组
export function saveGroup(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/UserGroup/saveGroup",
        // isRep: true,
        data,
    })
}

// 删除用户组
export function deleteGroup(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/UserGroup/deleteGroup",
        data,
    })
}

// 获取用户组下的用户
export function fetchGroupUserList(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/UserGroup/getGroupUserList",
        data,
    })
}

// 给用户组添加用户
export function addGroupUser(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/UserGroup/saveGroupUsers",
        data,
    })
}

// 给用户组删除用户
export function deleteGroupUser(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/UserGroup/deleteGroupUsers",
        data,
    })
}
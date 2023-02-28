import service from "@/assets/js/util";
import store from "@/store";

// 获取所有用户列表
export function fetchAllUserList(data) {
    return service.postAjax({
        code: "url",
        url: "user/items",
        isRep: true,
        data
    })
}

// 获取用户分页列表
export function fetchUserList(data) {
    return service.postAjax({
        code: "url",
        url: "user/pageQuery",
        isRep: true,
        data
    })
}

// 获取没有考核分组的用户列表
export function fetchNoGroupUserList(data) {
    return service.postAjax({
        code: "url",
        url: "user/noGroupUsers",
        isRep: true,
        data
    })
}

// 同步用户
export function syncUser() {
    return service.postAjax({
        code: "url",
        url: "",
        isRep: true,
        data: {}
    })
}

// 保存用户岗位级别
export function saveUser(data) {
    return service.postAjax({
        code: "url",
        url: "user/save",
        isRep: true,
        data,
    })
}

// 添加用户
export function addUser(data) {
    return service.postAjax({
        code: "url",
        url: "user/addUser",
        isRep: true,
        data,
    })
}


// 删除用户
export function deleteUser(data) {
    return service.postAjax({
        code: "url",
        url: "user/deleteById",
        data,
    })
}

// 查询用户信息
export function findUserById(data) {
    return service.postAjax({
        code: "url",
        url: "user/findById",
        data,
    })
}

// 获取所有人员类型
export function fetchRylxList() {
    return service.postAjax({
        code: "url",
        url: "user/rylxms"
    })
}

// 获取所有部门
export function fetchOrgList() {
    return service.postAjax({
        code: "url",
        url: "user/orgnames"
    })
}
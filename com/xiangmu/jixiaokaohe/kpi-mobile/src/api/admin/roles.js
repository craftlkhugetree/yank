import service from "@/assets/js/util";
import store from "@/store";

// 角色列表
export function fetchRoleList(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/Role/getRoleRes2Users",
        data: {
            appid: store.state.GROUPID
        }
    })
}

// 保存角色
export function saveRole(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/Role/save",
        data,
    })
}

// 删除角色
export function deleteRole(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/Role/delete",
        data,
    })
}

// 用户列表
export function fetchUserList(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/User/simpleList",
        data,
    })
}

// 保存用户
export function saveUser(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/User/simpleSave",
        data,
    })
}

// 修改用户密码
export function saveUserPwd(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/User/saveUserPwd",
        data,
    })
}


// 获取角色权限菜单
export function fetchRoleAuth(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/Role/getRoleByMenupid",
        data,
    })
}

// 保存角色权限菜单
export function saveRoleAuth(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/Role/saveAuth",
        data,
    })
}

// 获取当前角色的用户及其用户组
export function fetchRoleUserAndGroups(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/Role/getRoleUsers2groups",
        data,
    })
}

// 保存当前角色的用户及其用户组
export function saveRoleUserAndGroups(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/Role/saveRoleUser2Group",
        data,
    })
}


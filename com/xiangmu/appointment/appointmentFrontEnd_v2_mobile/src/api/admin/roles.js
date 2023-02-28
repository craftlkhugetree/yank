import service from "@/assets/js/util";

// 角色列表
export function fetchRoleList(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/Role/list",
        data,
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

// 给角色添加用户
export function addRoleUser(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/Role/addUser",
        data,
    })
}

// 给角色删除用户
export function deleteRoleUser(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/Role/delUser",
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


export function savePwd(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/User/modfiyPwd',
    data,
  });
}


import service from "@/assets/js/util";

// 获取用户列表
export function fetchAllUserList(data) {
    return service.postAjax({
        code: "admin",
        url: "sys-user/list",
        isRep: true,
        data
    })
}

// 获取用户列表-分页
export function fetchUserList(data) {
    return service.postAjax({
        code: "admin",
        url: "sys-user/pageQuery",
        isRep: true,
        data
    })
}

// 保存用户
export function saveUser(data) {
    return service.postAjax({
        code: "admin",
        url: "sys-user/save",
        isRep: true,
        data
    })
}

// 删除用户
export function deleteUser(id) {
    return service.postAjax({
        isGet: true,
        code: "admin",
        url: "sys-user/delete/" + id,
    })
}

// 管理员重置密码
export function resetPwd(data) {
    return service.postAjax({
        code: "admin",
        url: "sys-user/resetPassword",
        data
    })
}

// 用户修改密码
export function changePwd(data) {
    return service.postAjax({
        code: "admin",
        url: "sys-user/changePassword",
        data
    })
}

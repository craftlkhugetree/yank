import service from "@/assets/js/util";
import store from "@/store/index";

// 获取用户信息
export function getUserInfo() {
    return service.postAjax({
        code: "auth",
        url: "rest/User/userDetail"
    })
}

// 获取用户所在的用户组
export function getUserGroups(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/User/simpleList",
        data
    })
}

// 获取用户角色
export function getUserRole() {
    return service.postAjax({
        code: "auth",
        url: "rest/AuthOut/getMyRoles",
        isRep: true,
        data: {
            gid: store.state.GROUPID
        }
    })
}

// 获取用户菜单
export function getUserMenu() {
    return service.postAjax({
        code: "appportal",
        url: "rest/Portal/getUserMenu",
        data: {
            menupid: store.state.GROUPID
        }
    })
}

// 修改密码
export function savePwd(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/User/modfiyPwd",
        data
    })
}
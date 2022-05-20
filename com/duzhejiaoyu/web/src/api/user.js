import service from "@/assets/js/util";
import store from "@/store/index";

// 获取用户信息
export function getUserInfo() {
    return service.postAjax({
        code: "auth",
        url: "rest/User/userDetail"
    })
}

// 获取登录人信息
export function getLoginUserInfo() {
    return service.postAjax({
        code: "url",
        url: "user/loginUserInfo"
    })
}

// 是否第一次登录
export function getIsFirstLogin() {
    return service.postAjax({
        code: "url",
        url: "user/isFirstLogin"
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
            menupid: store.state.appId
        }
    })
}

// 获取登录人考试信息
export function getLoginUserAllExamRecords() {
    return service.postAjax({
        code: "url",
        url: "user/loginUserExamRecords",
    })
}

// 获取登录人ip
export function getIpAddress() {
    return service.postAjax({
        code: "url",
        url: "user/getIpAdrress",
    })
}
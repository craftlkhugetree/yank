import service from "@/assets/js/util";
import store from "@/store";

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

// 第三方用户列表
export function fetchThirdUserList(data) {
    return service.postAjax({
        code: "url",
        url: "user/thirdAuthUserInfo",
        data
    })
}

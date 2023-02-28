import service from "@/assets/js/util";

// 登录
export function doLogin(data) {
    return service.postAjax({
        noToken: true,
        code: "auth",
        url: "oauth/account",
        data
    })
}

// 获取验证码
export function getVcode(data) {
    return service.postAjax({
        noToken: true,
        isGet: true,
        code: "auth",
        url: "oauth/captcha",
        data
    })
}
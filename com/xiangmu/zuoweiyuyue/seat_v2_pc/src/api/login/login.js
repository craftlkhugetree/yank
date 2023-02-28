import service from "@/assets/js/util";

// 登录
export function doLogin(data) {
    return service.postAjax({
        code: "idsweb",
        url: "login2/authUser",
        data
    })
}
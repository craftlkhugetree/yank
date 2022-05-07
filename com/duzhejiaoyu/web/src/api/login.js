import service from "@/assets/js/util";

// 登录
export function doLogin(data) {
    return service.postAjax({
        code: "idsweb",
        url: "LresNhLogin/frontLogin",
        data
    })
}

// 绑定校区，完善信息
export function bindCampus(data) {
    return service.postAjax({
        code: "url",
        url: "user/bindCampus",
        data
    })
}
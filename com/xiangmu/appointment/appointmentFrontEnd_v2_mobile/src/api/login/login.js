import service from "@/assets/js/util";

// 登录
export function doLogin(data) {
    return service.postAjax({
        code: "idsweb",
        url: "login2/authUser",
        data
    })
}
// 验证码
export function getYzm2(data) {
  return service.postAjax({
    code: "idsweb",
    url: "captcha/get2",
    data,
    isGet: true
  });
}
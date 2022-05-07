import service from "@/assets/js/util";
import store from "@/store/index";

// 获取校区列表
export function fetchSchoolList(data) {
    return service.postAjax({
        code: "url",
        url: "campus/list",
        isRep: true,
        data
    })
}

// 保存校区
export function saveSchool(data) {
    return service.postAjax({
        code: "url",
        url: "campus/save",
        isRep: true,
        data
    })
}

// 删除校区
export function deleteSchool(id) {
    return service.postAjax({
        code: "url",
        url: `campus/delete/${id}`,
        isGet: true
    })
}

// 同步用户类型
export function asyncUserTypeList() {
    return service.postAjax({
        code: "url",
        url: "usertype/syncUsertype"
    })
}

// 用户类型列表
export function fetchUserTypeList(data) {
    return service.postAjax({
        code: "url",
        url: "usertype/list",
        isRep: true,
        data
    })
}

// 其他参数
export function fetchOtherParams(data) {
  return service.postAjax({
    code: "url",
    url: "config/list",
    isRep: true,
    data,
  });
}

/**
 * 保存参数
 * @param {*} data {code,val,desc}
 * @returns 
 */
export function saveOtherParams(data) {
    return service.postAjax({
        code: "url",
        url: "config/save",
        isRep: true,
        data
    })
}



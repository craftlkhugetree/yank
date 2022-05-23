import service from "@/assets/js/util";
// 开放区间统计
// 通过日期查询
export function queryByDate(data) {
    return service.postAjax({
        code: "url",
        url: "dataSection/queryByDate",
        data,
    })
}
// 通过月份查询
export function queryByMonth(data) {
    return service.postAjax({
        code: "url",
        url: "dataSection/queryByMonth",
        data,
    })
}
// 通过年份查询
export function queryByYear(data) {
    return service.postAjax({
        code: "url",
        url: "dataSection/queryByYear",
        data,
    })
}




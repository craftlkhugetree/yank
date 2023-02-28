import service from "@/assets/js/util";
// 入馆人数统计 ，区间入馆人数统计
// 通过日期查询
export function queryByDate(data) {
    return service.postAjax({
        code: "url",
        url: "dataPerson/queryByDate",
        data,
    })
}
// 通过月份查询
export function queryByMonth(data) {
    return service.postAjax({
        code: "url",
        url: "dataPerson/queryByMonth",
        data,
    })
}
// 通过年份查询
export function queryByYear(data) {
    return service.postAjax({
        code: "url",
        url: "dataPerson/queryByYear",
        data,
    })
}




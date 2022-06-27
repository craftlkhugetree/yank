import service from "@/assets/js/util";
// 楼宇列表
export function fetchAllBuildingList(data) {
    return service.postAjax({
        code: "url",
        url: "area/areas",
        isRep: true,
        data,
    })
}

// 楼宇列表-分页
export function fetchBuildingList(data) {
    return service.postAjax({
        code: "url",
        url: "area/pageQuery",
        isRep: true,
        data,
    })
}
// 保存楼宇
export function saveBuilding(data) {
    return service.postAjax({
        code: "url",
        url: "area/save",
        isRep: true,
        data,
    })
}
// 删除楼宇
export function deleteBuilding(data) {
    return service.postAjax({
        code: "url",
        url: "area/delete",
        data,
    })
}
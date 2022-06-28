import service from "@/assets/js/util";
// 餐厅列表
export function fetchAllCafeList(data) {
    return service.postAjax({
        code: "url",
        url: "shop/items",
        isRep: true,
        data,
    })
}

// 餐厅列表-分页
export function fetchCafeList(data) {
    return service.postAjax({
        code: "url",
        url: "shop/pageQuery",
        isRep: true,
        data,
    })
}
// 餐厅列表-根据分类查询
export function fetchCafeListByType(data) {
    return service.postAjax({
        code: "url",
        url: "shop/pageQueryByType",
        isRep: true,
        data,
    })
}
// 保存餐厅
export function saveCafe(data) {
    return service.postAjax({
        code: "url",
        url: "shop/save",
        isRep: true,
        data,
    })
}
// 删除餐厅
export function deleteCafe(data) {
    return service.postAjax({
        code: "url",
        url: "shop/delete",
        data,
    })
}
// 获取餐厅详情
export function fetchCafeDetail(data) {
    return service.postAjax({
        code: "url",
        url: "shop/findById",
        data
    })
}

// 当前用户的餐厅
export function fetchMyCafe() {
    return service.postAjax({
        code: "url",
        url: "shop/myShop"
    })
}

// 餐厅配置列表
export function fetchCafeConfigList(data) {
    return service.postAjax({
        code: "url",
        url: "shopconfig/items",
        isRep: true,
        data
    })
}

// 获取餐厅配置
export function fetchCafeConfig(data) {
    return service.postAjax({
        code: "url",
        url: "shopconfig/findByShopId",
        data
    })
}

// 保存餐厅配置
export function saveCafeConfig(data) {
    return service.postAjax({
        code: "url",
        url: "shopconfig/save",
        isRep: true,
        data
    })
}

// 排序-up
export function sortCafeUp(data) {
    return service.postAjax({
        code: "url",
        url: "shop/up",
        data,
    })
}

// 排序-down
export function sortCafeDown(data) {
    return service.postAjax({
        code: "url",
        url: "shop/down",
        data,
    })
}

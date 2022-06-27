import service from "@/assets/js/util";

// 分类下的餐厅
export function fetchAllShopList(data) {
    return service.postAjax({
        code: "url",
        url: "shop/pageQueryByType",
        isRep: true,
        data,
    })
}



// 餐厅分类列表
export function fetchAllShopType(data) {
    return service.postAjax({
        code: "url",
        url: "shoptype/items",
        isRep: true,
        data,
    })
}

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

// 一个餐厅配置列表
export function fetchOneCafeConfig(data) {
    return service.postAjax({
        code: "url",
        url: "shopconfig/findByShopId",
        // isRep: true,
        data
    })
}




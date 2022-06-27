import service from "@/assets/js/util";

// 分类列表
export function fetchTypeList(data) {
    return service.postAjax({
        code: "url",
        url: "shopitemtype/items",
        isRep: true,
        data
    })
}
// 分类上下架数量
export function fetchTypeNums(data) {
    return service.postAjax({
        code: "url",
        url: "shopitem/itemShowNums",
        data
    })
}
// 分类详情
export function fetchTypeDetail(data) {
    return service.postAjax({
        code: "url",
        url: "shopitemtype/findById",
        data
    })
}
// 保存分类
export function saveType(data) {
    return service.postAjax({
        code: "url",
        url: "shopitemtype/save",
        isRep: true,
        data,
    })
}
// 删除分类
export function deleteType(data) {
    return service.postAjax({
        code: "url",
        url: "shopitemtype/delete",
        data,
    })
}
// 分类排序-上移
export function sortTypeUp(data) {
    return service.postAjax({
        code: "url",
        url: "shopitemtype/up",
        data,
    })
}
// 分类排序-下移
export function sortTypeDown(data) {
    return service.postAjax({
        code: "url",
        url: "shopitemtype/down",
        data,
    })
}

// 获取菜品列表
export function fetchAllFoodList(data) {
    return service.postAjax({
        code: "url",
        url: "shopitem/items",
        isRep: true,
        data
    })
}

// 获取菜品列表-分页
export function fetchFoodList(data) {
    return service.postAjax({
        code: "url",
        url: "shopitem/pageQuery",
        isRep: true,
        data
    })
}
// 保存菜品
export function saveFood(data) {
    return service.postAjax({
        code: "url",
        url: "shopitem/save",
        isRep: true,
        data
    })
}
// 删除菜品
export function deleteFood(data) {
    return service.postAjax({
        code: "url",
        url: "shopitem/delete",
        data,
    })
}
// 上下架菜品
export function changeFoodStatus(data) {
    return service.postAjax({
        code: "url",
        url: "shopitem/changeStatus",
        data,
    })
}


// 菜品排序-上移
export function sortFoodUp(data) {
    return service.postAjax({
        code: "url",
        url: "shopitem/up",
        data,
    })
}

// 菜品排序-下移
export function sortFoodDown(data) {
    return service.postAjax({
        code: "url",
        url: "shopitem/down",
        data,
    })
}

// 获取当前登录人菜品购买量
export function fetchBuyNum(data) {
    return service.postAjax({
        code: "url",
        url: "shopitem/getItemBuyNum",
        data
    })
}
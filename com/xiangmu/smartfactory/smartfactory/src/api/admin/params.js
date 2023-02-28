import service from "@/assets/js/util";
import store from "@/store";

// 获取物料配置
export function fetchGoodsParams() {
    return service.postAjax({
        code: "url",
        url: "goods/items",
        isRep: true,
        data: {}
    })
}

// 保存物料配置
export function saveGoodsParams(data) {
    return service.postAjax({
        code: "url",
        url: "goods/save",
        isRep: true,
        data
    })
}


// 获取叫号配置
export function fetchParams() {
    return service.postAjax({
        code: "url",
        url: "config/list",
        isRep: true,
        data: {}
    })
}

// 保存叫号配置
export function saveParams(data) {
    return service.postAjax({
        code: "url",
        url: "config/save",
        isRep: true,
        data
    })
}
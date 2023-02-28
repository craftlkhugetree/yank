import service from "@/assets/js/util";

// 列表
export function fetchAddressList(data) {
    return service.postAjax({
        code: "url",
        url: "address/myAddress",
        isRep: true,
        data
    })
}

// 保存
export function saveAddress(data) {
    return service.postAjax({
        code: "url",
        url: "address/save",
        isRep: true,
        data
    })
}

// 删除
export function deleteAddress(data) {
    return service.postAjax({
        code: "url",
        url: "address/delete",
        data
    })
}
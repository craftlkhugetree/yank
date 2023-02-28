import service from "@/assets/js/util";
import store from "@/store/index";

// 获取列表
export function fetchGhhwList(data) {
    return service.postAjax({
        code: "url",
        url: "outport/pageQuery",
        isRep: true,
        data
    })
}

// 删除
export function deleteGhhw(id) {
    return service.postAjax({
        code: "url",
        url: `outport/delete/${id}`,
        isGet: true
    })
}

// 保存
export function saveGhhw(data) {
    return service.postAjax({
        code: "url",
        url: "outport/save",
        isRep: true,
        data
    })
}

// 详情
export function fetchDetail(id) {
    return service.postAjax({
        code: "url",
        url: `outport/find/${id}`,
        isGet: true
    })
}

// 罐号列表
export function fetchLocationList(data) {
    return service.postAjax({
        code: "url",
        url: `outport/locations`,
        isRep: true,
        data
    })
}

// 开启关闭
export function changeStatus(id) {
    return service.postAjax({
        code: "url",
        url: `outport/changeStatus/${id}`,
        isGet: true
    })
}
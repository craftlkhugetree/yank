import service from "@/assets/js/util";

// 提交预约单
export function saveAppoint(data) {
    return service.postAjax({
        code: 'url',
        url: 'apply/save',
        data,
        isRep: true
    })
};

// 取消预约
export function cancelAppoint(data) {
    return service.postAjax({
        code: 'url',
        url: 'apply/cancel',
        data,
    })
};

// 个人中心--预约列表
export function fetchAppointList(data) {
    return service.postAjax({
        code: "url",
        url: "apply/pageQuery",
        isRep: true,
        data
    })
}

// 预约单详情
export function getApplyDetail(data) {
    return service.postAjax({
        code: "url",
        url: "apply/findById",
        data
    })
}






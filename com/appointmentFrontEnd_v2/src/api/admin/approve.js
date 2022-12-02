import service from "@/assets/js/util";

// 审核列表 (待审核 type: 1 / 已审核 type: 2)
export function fetchApproveList(type, data) {
    let url = type == "1" ? "apply/needApprove" : "apply/approveHistory";
    return service.postAjax({
        code: "url",
        url: url,
        isRep: true,
        data
    })
}

// 审核
export function doApprove(data) {
    return service.postAjax({
        code: "url",
        url: "apply/approve",
        isRep: true,
        data
    })
}
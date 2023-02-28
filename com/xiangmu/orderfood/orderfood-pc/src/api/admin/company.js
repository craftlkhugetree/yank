import service from "@/assets/js/util";
// 列表
export function fetchAllCompanyList(data) {
    return service.postAjax({
        code: "url",
        url: "company/items",
        isRep: true,
        data,
    })
}

// 列表-分页
export function fetchCompanyList(data) {
    return service.postAjax({
        code: "url",
        url: "company/pageQuery",
        isRep: true,
        data,
    })
}
// 保存
export function saveCompany(data) {
    return service.postAjax({
        code: "url",
        url: "company/save",
        isRep: true,
        data,
    })
}
// 删除
export function deleteCompany(data) {
    return service.postAjax({
        code: "url",
        url: "company/delete",
        data,
    })
}



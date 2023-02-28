import service from "@/assets/js/util";

// 获取列表
export function fetchAllRoleList(data) {
    return service.postAjax({
        code: "admin",
        url: "sys-role/list",
        isRep: true,
        data
    })
}

// 获取列表-分页
export function fetchRoleList(data) {
    return service.postAjax({
        code: "admin",
        url: "sys-role/pageQuery",
        isRep: true,
        data
    })
}

// 保存
export function saveRole(data) {
    return service.postAjax({
        code: "admin",
        url: "sys-role/save",
        isRep: true,
        data
    })
}

// 删除
export function deleteRole(id) {
    return service.postAjax({
        isGet: true,
        code: "admin",
        url: "sys-role/delete/" + id,
    })
}


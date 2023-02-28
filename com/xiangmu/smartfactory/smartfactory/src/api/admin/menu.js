import service from "@/assets/js/util";

// 获取当前登录人菜单
export function fetchUserMenu() {
    return service.postAjax({
        code: "admin",
        url: "sys-menu/userMenus"
    })
}

// 获取列表
export function fetchAllMenuList(data) {
    return service.postAjax({
        code: "admin",
        url: "sys-menu/list",
        isRep: true,
        data
    })
}


// 保存
export function saveMenu(data) {
    return service.postAjax({
        code: "admin",
        url: "sys-menu/save",
        isRep: true,
        data
    })
}

// 删除
export function deleteMenu(id) {
    return service.postAjax({
        isGet: true,
        code: "admin",
        url: "sys-menu/delete/" + id,
    })
}


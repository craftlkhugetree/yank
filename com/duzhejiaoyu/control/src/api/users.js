import service from "@/assets/js/util";
import store from "@/store/index";

// 获取所有列表
export function fetchAllUserList(data) {
    return service.postAjax({
        code: "url",
        url: "user/items",
        isRep: true,
        data
    })
}

// 获取分页列表
export function fetchUserList(data) {
    return service.postAjax({
        code: "url",
        url: "user/pageQuery",
        isRep: true,
        data
    })
}

// 获取年级列表
export function fetchGradeList() {
    return service.postAjax({
        code: "url",
        url: "user/userGrades",
        isGet: true
    })
}

// 获取所属列表
export function fetchDeptList() {
    return service.postAjax({
        code: "url",
        url: "user/userDepts",
        isGet: true
    })
}

// 批量激活借书证
export function activeUsers(data) {
    return service.postAjax({
        code: "url",
        url: "user/activeUsers",
        isRep: true,
        data
    })
}

// 获取考试记录分页列表
export function fetchUserRecordList(data) {
    return service.postAjax({
        code: "url",
        url: "user/examRecords",
        isRep: true,
        data
    })
}

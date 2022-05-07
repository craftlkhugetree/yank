import service from "@/assets/js/util";
import store from "@/store/index";

// 获取列表
export function fetchExamList(data) {
    return service.postAjax({
        code: "url",
        url: "exam/pageQuery",
        isRep: true,
        data
    })
}

// 删除
export function deleteExam(id) {
    return service.postAjax({
        code: "url",
        url: `exam/delete/${id}`,
        isGet: true
    })
}

// 保存
export function saveExam(data) {
    return service.postAjax({
        code: "url",
        url: "exam/save",
        isRep: true,
        data
    })
}

// 详情
export function fetchDetail(id) {
    return service.postAjax({
        code: "url",
        url: `exam/find/${id}`,
        isGet: true
    })
}

// 开启/关闭试卷
export function changeStatus(id) {
    return service.postAjax({
        code: "url",
        url: `exam/changeStatus/${id}`,
        isGet: true
    })
}

// 获取考试记录
export function fetchExamRecords(data) {
    return service.postAjax({
        code: "url",
        url: "exam/examRecords",
        isRep: true,
        data
    })
}
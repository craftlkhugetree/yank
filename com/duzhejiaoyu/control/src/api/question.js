import service from "@/assets/js/util";
import store from "@/store/index";

// 获取列表
export function fetchQuestionList(data) {
    return service.postAjax({
        code: "url",
        url: "question/pageQuery",
        isRep: true,
        data
    })
}

// 删除
export function deleteQuestion(id) {
    return service.postAjax({
        code: "url",
        url: `question/delete/${id}`,
        isGet: true
    })
}

// 保存
export function saveQuestion(data) {
    return service.postAjax({
        code: "url",
        url: "question/save",
        isRep: true,
        data
    })
}

// 批量设置
export function batchSet(data) {
    return service.postAjax({
        code: "url",
        url: "question/batchSet",
        isRep: true,
        data
    })
}

// 批量删除
export function batchDelete(data) {
    return service.postAjax({
        code: "url",
        url: "question/batchDelete",
        isRep: true,
        data
    })
}

// 题目池数量
export function fetchQuestionPool(data) {
    return service.postAjax({
        code: "url",
        url: `question/questionPool`,
        isRep: true,
        data
    })
}

// 详情
export function fetchDetail(id) {
    return service.postAjax({
        code: "url",
        url: `question/find/${id}`,
        isGet: true
    })
}
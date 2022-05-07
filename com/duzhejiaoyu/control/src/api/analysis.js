import service from "@/assets/js/util";
import store from "@/store/index";

// 题目分析-获取列表
export function fetchQuestionList(data) {
    return service.postAjax({
        code: "url",
        url: "analysisQuestion/pageQuery",
        isRep: true,
        data
    })
}

// 考试分析-概览
export function fetchExamOverride() {
    return service.postAjax({
        code: "url",
        url: "analysisExam/override"
    })
}

// 考试分析-获取列表
export function fetchExamList(data) {
    return service.postAjax({
        code: "url",
        url: "analysisExam/pageQueryExam",
        isRep: true,
        data
    })
}

// 考试分析——年级
export function fetchExamByGrade(data) {
    return service.postAjax({
        code: "url",
        url: "analysisExam/examByGrade",
        data
    })
}

// 考试分析——班级
export function fetchExamByDept(data) {
    return service.postAjax({
        code: "url",
        url: "analysisExam/pageQueryExamByDept",
        isRep: true,
        data
    })
}
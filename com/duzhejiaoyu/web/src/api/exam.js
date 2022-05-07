import service from "@/assets/js/util";

// 获取登录人试卷
export function getLoginUserExams(data) {
    return service.postAjax({
        code: "url",
        url: "exam/getLoginUserExams",
        data
    })
}

// 获取登录人培训资料
export function getLoginUserLearns(data) {
    return service.postAjax({
        code: "url",
        url: "learn/getLoginUserLearns",
        data
    })
}

// 获取登录人学习记录
export function getLoginUserRecords(data) {
    return service.postAjax({
        code: "url",
        url: "learn/getLoginUserRecords",
        data
    })
}

// 开始学习
export function startLearn(data) {
    return service.postAjax({
        code: "url",
        url: "learn/learn",
        data
    })
}

// 获取登录人某个试卷的考试记录
export function getLoginUserExamRecords(examId) {
    return service.postAjax({
        code: "url",
        url: `exam/getLoginUserExamRecords/${examId}`,
    })
}

// 获取登录人试题
export function getLoginUserExamQuestion(data) {
    return service.postAjax({
        code: "url",
        url: "exam/getLoginUserExamQuestion",
        data
    })
}

// 交卷——普通考试
export function submitNormalExam({agent, examId, questions}) {
    return service.postAjax({
        code: "url",
        url:`exam/submitNormalExam/${agent}/${examId}`,
        isRep: true,
        data: questions
    })
}
// 交卷——闯关考试
export function submitPointExam({agent, examId, modelId, questions}) {
    return service.postAjax({
        code: "url",
        url: `exam/submitCheckPointExam/${agent}/${examId}/${modelId}`,
        isRep: true,
        data: questions
    })
}
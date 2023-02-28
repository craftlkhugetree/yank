import service from "@/assets/js/util";
import store from "@/store";

// 外挂工资列表
export function fetchSalaryList(data) {
    return service.postAjax({
        code: "url",
        url: "outsalary/pageQuery",
        isRep: true,
        data
    })
}

// 保存外挂工资
export function saveSalary(data) {
    return service.postAjax({
        code: "url",
        url: "outsalary/save",
        isRep: true,
        data
    })
}

// 获取操作记录
export function fetchSalaryRecord(data) {
    return service.postAjax({
        code: "url",
        url: "outsalary/queryEvents",
        data
    })
}

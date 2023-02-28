import service from "@/assets/js/util";
// 总数据
export function fetchTotalData(data) {
    return service.postAjax({
        code: "url",
        url: "statistic/orderStatistic",
        // isRep: true,
        data,
    })
}

// 菜品数据
export function fetchFoodData(data) {
    return service.postAjax({
        code: "url",
        url: "statistic/orderItemStatistic",
        // isRep: true,
        data,
    })
}


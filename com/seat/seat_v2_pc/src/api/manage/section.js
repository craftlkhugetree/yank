import service from "@/assets/js/util";

// 座位列表
export function fetchSectionList(data) {
    return service.postAjax({
        code: "url",
        url: "section/pageQuery",
        isRep: true,
        data,
    })
}

// 座位列表
export function fetchSections(data) {
    return service.postAjax({
        code: "url",
        url: "section/items",
        isRep: true,
        data,
    })
}

// 保存
export function saveSection(data) {
    return service.postAjax({
        code: "url",
        url: "section/save",
        isRep: true,
        data,
    })
}

// 临时关闭
export function deleteSection(data) {
    return service.postAjax({
        code: "url",
        url: "section/delete",
        data,
    })
}

// 座位详情
export function getSectionDetail(data) {
    return service.postAjax({
        code: "url",
        url: "section/findById",
        data,
    })
}

// 开启疫情模式
export function openInterval(data) {
    return service.postAjax({
        code: "url",
        url: "section/openIntervalSeat",
        data,
    })
}

// 关闭疫情模式
export function closeInterval(data) {
    return service.postAjax({
        code: "url",
        url: "section/closeIntervalSeat",
        data,
    })
}

//临时关闭
export function changeStatus(data) {
    return service.postAjax({
        code: "url",
        url: "section/changeStatus",
        isRep: true,
        data,
    })
}

/**
 * move up/down
 * @param {*} data id 
 * @param {*} direction value from only ['up', 'down']
 * @returns 
 */
export function moveStep(data, direction = '') {
    return service.postAjax({
        code: "url",
        url: `section/${direction}`,
        data,
    })
}

/**
 * 查询可选区间
 * @param {*} data 
 * @returns 
 */
export function queryOrderSections(data) {
  return service.postAjax({
    code: "url",
    url: `section/queryOrderSections`,
    data,
    isRep: true,
  });
}

// 查询某区间座位情况
export function querySectionSeats(data) {
  return service.postAjax({
    code: "url",
    url: `section/querySectionSeats`,
    data,
    isRep: true,
  });
}

// 查询某座位预约情况
export function queryOpenTime(data) {
  return service.postAjax({
    code: "url",
    url: `section/queryOpentime`,
    data,
    isRep: true,
  });
}
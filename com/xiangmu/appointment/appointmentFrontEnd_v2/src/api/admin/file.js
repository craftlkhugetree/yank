import service from "@/assets/js/util";

// 获取文件信息
export function getFileInfo(data) {
    return service.postAjax({
        code: "file",
        url: "rest/FileOut/getFiles",
        isRep: true,
        data
    })
}
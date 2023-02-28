export default {
    // baseURL:'http://172.20.1.251:8010/activityweb/rest/',
    // imgURL:'http://172.20.1.251:8090/fileweb/rest/FileOut/view/',
    // imgsaveURL:'http://172.20.1.251:8090/fileweb/rest/FileOut/saveFile',
    // templateURL:'http://172.20.1.251:8010/templateweb/rest/',
    baseURL:window.g.activityURL,
    baseURL1:window.g.signbasecode,//
    imgURL:window.g.activityimgURL,
    imgsaveURL:window.g.activityimgsaveURL,
    templateURL:window.g.activitytemplateURL,
    code:'activity',
    Activitylist:'activityActivity/list',//活动列表
    Activitydelete:'activityActivity/delete',//
    activityActivitydetail:'activityActivity/detail',
    activityActivitydraftNum:'activityActivity/getDraftNum',
    activityActivitysave:'activityActivity/save',
    activityActivitydetail:'activityActivity/detail',
    activityActivityupdate:'activityActivity/update',

    activityTypelist:'activityType/list',//活动类别
    activityTypesort:'activityType/sort',
    activityTypesave:'activityType/save',
    activityTypeupdate:'activityType/update',
    activityTypedetail:'activityType/detail',
    activityTypedelete:'activityType/delete',
    
    activityFilelistShow:'activityFile/listShow',//活动风采列表 
    activityFilesaveShow:'activityFile/saveShow',
    activityFilesaveShowBatch:'activityFile/saveShowBatch',
    activityFileupdateShow:'activityFile/updateShow',
    activityFiledeleteShow:'activityFile/deleteShow',
    activityTextgetImgText:'activityText/getImgText',//
    activityTextupdateImgText:'activityText/updateImgText',
    activityFilesortImgText:'activityFile/sortImgText',

    activityAppointmentlist:'activityAppointment/list',
    activityAppointmentgetApplySignNum:'activityAppointment/getApplySignNum',
    activityAppointmentexportExcel:'activityAppointment/exportExcel',

    activityAppointmenttoSign:'activityAppointment/toSign',//签到码get

    Templatelist:'Template/list',//模板
    Templatedelete:'Template/delete',//删除模板
    Templatesave:'Template/save',//保存模板
    activityFilelistPost:'activityFile/listPost',//海报库列表

}
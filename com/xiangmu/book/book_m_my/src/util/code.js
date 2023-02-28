export default {
    base : 'book2',
    getList : 'book/checkList',//待审核列表
    getUser:'book/getUser',//个人信息
    deleteRecords:'book/deleteRecords',//删除待审核列表
    fileManageupload:'fileManage/upload',//文件上传
    bookgetGroup:'book/getGroup',//负责人列表
    checkInvoiceNum:'book/checkInvoiceNum',//验证图书发票是否重复
    isbnGetBookInfo:'book/isbnGetBookInfo',//根据isbn号获取书本信息
    booksave:'book/save',//提交审核
    bookgetOne:'book/getOne',//修改
    Periodicallist:'Periodical/list',//报刊列表
    Periodicalsave:'Periodical/save',//报刊的增加和修改
    PeriodicalcheckInvoiceNum:'Periodical/checkInvoiceNum',//验证报刊发票是否重复
    PeriodicaldeleteRecords:'Periodical/deleteRecords',//删除报刊
    Periodicalview:'Periodical/view',//获取单个的详情
    downbook:'book/getPdf',//下载
};
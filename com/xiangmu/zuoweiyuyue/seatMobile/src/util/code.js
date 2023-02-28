export default {
    frontLogin: "Opac/login",
    base: 'seat_v2',
    PickList: 'section/queryPickSections',//选座列表
    PickDetail: 'section/querySectionSeats',//选座进去详情
    queryOpentime: 'section/queryOpentime',//查询时间
    OrderList: 'section/queryOrderSections',//预约列表
    ordersave: 'order/save',//占座保存 "type": "string"//1预约 2 选座
    currentOrders: 'order/currentOrders',//当前预约/占座列表
    ordercancel: 'order/cancel',//取消时间段--退座
    signRemind: 'order/signRemind',//签到提醒
    sign: 'order/sign',//签到接口
    isuseing: 'order/isuseing',//使用者
    configitems: 'config/items',//参数设置  暂离的时间点
    leave: 'order/leave',//暂离    type 1临时暂离2就餐暂离
    commonLists: 'section/items',//常用座位教室列表
    commonSeats: 'section/findById',//常用座位渲染
    savecommon: 'selfuseseat/save',//保存常用座位
    mycommonLists: 'selfuseseat/items',//常用座位列表
    delcommonseat: 'selfuseseat/delete',//删除常用座位
    orderHistory: 'order/orderHistory',//预约历史
    ranking: 'order/ranking',//排行榜
    breakrecord: 'breakrecord/pageQueryByUserId',//违规记录
    ReportSeats: 'section/queryReportSeatsById',//举报的座位详情
    reportsave: 'report/save',//举报
    ruleinfo: 'ruleinfo/findUseing',//规章制度
    noticeLists: 'notice/pageQuery',//通知公告
    noticedetail: 'notice/findById',//
    addReadNum: 'notice/addReadNum',
    isInBlackList: 'blacklist/isInBlackList',//是否在黑名单
    unsignrecord: 'unsignrecord/totalUnsign',//未签到记录
    getTicket: 'wx/getTicket',
    getQyTicket: 'QyWxLogin/getTicket?authType=qy_seat', // 获取企业微信ticket
    idsbase: 'idsweb',
    authbase: 'authweb',
    userDetail: 'User/userDetail',
    mySend:'/report/mySend',
    myReceived:'/report/myReceived',
    sjzkgLogin:'/Oauth2Sjzkg/getUser',
    weixinUnbind:'/User/weixinUnbind'
};

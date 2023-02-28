import store from "../../store/index";
export let qusetionFlow = [{
        question: '需要报修的网络类型？',
        id: '00',
        options: [
            { text: "有线", qid: '01' },
            { text: "无线", qid: '07' },
        ],
        // guideImg: ['15-1', '15-2', '15-3', '15-4', '15-5', '15-6', '15-7'],
        // guideTitle: '检查网络连接状态'
    },
    {
        question: '在电脑端，使用快捷键组合win+R，然后在文本框输入ncpa.cpl，回车，出现网络状态显示界面，查看无线网络状态，连接状态还是未连接状态？',
        id: '07',
        options: [
            { text: "连接状态", qid: '08' },
            { text: "未连接状态", qid: '16' },
        ],
        guideImg: ['07-1', '07-2'],
        guideTitle: '检查网络连接状态'
    },
    {
        question: '关闭无线连接，过一会儿再打开，重连信号NJIT，能否成功连上信号NJIT？',
        id: '16',
        options: [
            { text: "是，可以上网", qid: 'success' },
            { text: "是，不能上网", qid: '08' },
            { text: "否", qid: 'fail' },
        ]
    },
    {
        question: '检查无线网络获取到的IP地址：',
        id: '08',
        guideImg: ['08-1', '08-2', '08-3', '08-4'],
        guideTitle: '检查IP地址',
        options: [
            { text: "192.168.X.X     办公室存在路由器且有问题送至图书馆A104", qid: 'success' },
            { text: "169.254.X.X     无地址，进入报修流程", qid: 'fail' },
            { text: "10.20.X.X / 10.25.X.X  /  10.128.X.X", qid: '09' },
        ]
    },
    {
        question: '打开浏览器，输入认证网址10.0.1.1',
        id: '09',
        options: [
            { text: "认证界面", qid: '10' },
            { text: "注销界面或无界面", qid: '15' },
        ]
    },
    {
        question: '您的身份是教职工还是学生？',
        id: '10',
        options: [
            { text: "教职工身份", qid: '11' },
            { text: "学生身份", qid: '11' },
        ]
    },
    {
        question: '进入认证界面，输入账号密码选择“外网”进行认证。',
        id: '11',
        options: [
            { text: "认证成功", qid: '12' },
            { text: "账号密码问题。", qid: '13' },
            { text: "AC认证失败", qid: '14' },

            { text: "错误代码 04  超时 当月不能继续使用", qid: 'success' },
            { text: "错误代码 05  欠费 在宿舍等地的多媒体圈存机划钱至校园公寓网", qid: 'success' },
            { text: "userid error16或者Authentication Fail ErrCode=16--时间策略设置本时段不允许上网 ", qid: 'success' },
            { text: "其他情况，进入报修流程。", qid: 'fail' },
        ]
    },
    {
        question: '网络是否可以正常使用了？',
        id: '12',
        options: [
            { text: "是，网络正常可用。", qid: 'success' },
            { text: "否", qid: '15' },
        ]
    },
    {
        question: '点击网址<a href="http://nic.njit.edu.cn/info/1009/1681.htm">http://nic.njit.edu.cn/info/1009/1681.htm</a>，进入自助修改信息门户密码链接(无线上网的账号和密码与信息门户的账号密码是同步的)，完成密码修改后，重新认证，是否可以正常上网？',
        id: '13',
        options: [{
            text: "是，结束流程",
            qid: 'success'
        }, {
            text: "否，进入报修流程",
            qid: 'fail'
        }]
    },
    {
        question: '已断网15分钟，重连无线网络，能否正常上网？',
        id: '14',
        options: [
            { text: "可以，结束流程。", qid: 'success' },
            { text: "不能正常上网,进入报修流程。", qid: 'fail' }
        ]
    },
    {
        question: '检查DNS，将DNS设为202.119.160.11/202.119.160.12，是否可以上网？',
        id: '15',
        guideImg: ['15-1', '15-2', '15-3', '15-4', '15-5', '15-6', '15-7'],
        guideTitle: '检查与修改ip地址',
        options: [
            { text: "是。", qid: 'success' },
            { text: "否。", qid: 'fail' },
        ]
    },
    {
        question: '清理电脑及浏览器缓存或更换浏览器。',
        id: '18',

        options: [
            { text: "已解决", qid: 'success' },
            { text: "未解决", qid: 'fail' },
        ]
    },
    {
        question: '检查网络？',
        id: '01',
        options: [
            { text: "红叉未连接", qid: '02' },
            { text: "未识别的网络", qid: '03' },
        ]
    },
    {
        question: '检查网线，重新插拔网口.',
        id: '02',
        options: [
            { text: "仍然红叉未连接", qid: 'fail' },
            { text: "正在识别 已连接", qid: 'success' },
            { text: "仍未识别的网络", qid: '03' },
        ]
    },
    {
        question: '检查IP地址',
        id: '03',
        options: [
            { text: "192.168.X.X   办公室存在路由器且有问题送至图书馆A104。", qid: 'success' },
            { text: "169.254.X.X", qid: 'fail' },
            { text: "10.20.X.X", qid: '04' },
        ]
    },
    {
        question: '地址正常 输入10.0.1.1',
        id: '04',
        options: [
            { text: "认证界面", qid: '05' },
            { text: "注销界面", qid: '06' },
            { text: "无界面", qid: '18' },
        ]
    }, {
        question: '输入工号密码认证',
        id: '05',
        options: [
            { text: "认证成功", qid: 'success' },
            { text: "认证失败", qid: 'fail' },
        ]
    }, {
        question: '检查修改DNS  202.119.160.11/202.119.160.12',
        id: '06',
        options: [
            { text: "是", qid: 'success' },
            { text: "否", qid: 'fail' },
        ]
    },

]
export default {
    /**
     * 表格中字段为空时的默认转换
     * @param {*} row
     * @param {*} column
     * @param {*} value
     */
    defaultFormat(row, column, value) {
        if (value) {
            return value;
        } else {
            return "--";
        }
    },

    // 转换类型格式
    typeFormat(type) {
        switch (type) {
            case "1":
                return "咨询";
                break;
            case "2":
                return "投诉";
                break;
            case "3":
                return "表扬";
                break;
            case "4":
                return "反馈";
                break;
            case "5":
                return "其他";
                break;
        }
    },


    /**
     * 下载文件
     * @param {*} fileid
     */
    downloadFile(fileid) {
        window.location.href = store.state.downUrl + fileid;
    },
}
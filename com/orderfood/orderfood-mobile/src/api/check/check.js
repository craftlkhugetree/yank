import service from "@/assets/js/util";
import wx from "weixin-js-sdk";


// 获取随机数
function getRandomNum() {
    var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789";
    var maxPos = chars.length;
    var pwd = "";
    for (let i = 0; i < 16; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

// 微信扫一扫
export function scanQRCode(callback) {
    // 获取微信票据
    service.postAjax({
        code: "url",
        url: "order/getTicket"
    }).then(res => {
        if (res.success) {
            let str = getRandomNum();
            let timeSign = Date.parse(new Date());
            let url = window.location.href.split("#")[0];

            // 生成签名 sha1加密
            let signature = "jsapi_ticket=" + res.data.ticket + '&noncestr=' + str + '&timestamp=' + timeSign + '&url=' + url;
            let sha1 = require("js-sha1");
            signature = sha1(signature);

            // 注入配置信息
            wx.config({
                debug: false, // 开启调试模式。
                appId: res.data.appid, // 必填，公众号的唯一标识
                timestamp: timeSign, // 必填，生成签名的时间戳
                nonceStr: str, // 必填，生成签名的随机串
                signature: signature, // 必填，签名
                jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表
            });

            wx.ready(() => {
                // 调起微信扫一扫接口
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
                    scanType: ["qrCode", "barCode"],
                    desc: "scanQRCode desc",
                    success: res => {
                        callback(res.resultStr);
                    },
                    error: err => {
                        console.log(err);
                    }
                });
            });
        }
    });
}

//扫码取餐  
export function orderSign(data) {
    return service.postAjax({
        code: 'url',
        url: 'order/sign',
        data,
    })
};



<template>
  <div>
    <!-- <OBJECT id="ocx文件名" codeBase="ocx控件的相对位置#version=1,0,0,0" -->
    <!-- data="data:application/xoleobject;base64,mRHW/Ifh3UqI5ZryOEhtERAHAAD/KgAAYSQAAA=="  -->
    <!-- classid="CLSID:通过MCP找到的classid" VIEWASTEXT> -->
    <!-- </OBJECT> -->
    <object
      classid="clsid:05782014-9FF7-468C-BE96-8EDC73084202"
      id="IcCardReader"
      viewastext
      width="0"
      height="0"
    ></object>
  </div>
</template>

<script for="IcCardReader">
export default {
  methods: {
    readCard() {
      let IcCardReader = document.getElementById('IcCardReader')
      var strls = ''
      var errorno = ''
      //控制字定义,控制字指定,控制字的含义请查看本公司网站提供的动态库说明
      //javascript无法自定义常量, 你可以使用变量代替
      var BLOCK0_EN = 0x01 //读第一块的(16个字节)
      var BLOCK1_EN = 0x02 //读第二块的(16个字节)
      var BLOCK2_EN = 0x04 //读第四块的(16个字节)
      var NEEDSERIAL = 0x08 //仅读指定序列号的卡
      var EXTERNKEY = 0x10 //用明码认证密码,产品开发完成后，建议把密码放到设备的只写区，然后用该区的密码后台认证，这样谁都不知道密码是多少，需要这方面支持请联系
      var NEEDHALT = 0x20 //读/写完卡后立即休眠该卡，相当于这张卡不在感应区。要相重新操作该卡必要拿开卡再放上去

      var myctrlword = 0
      var myareano = 0
      var authmode = 0

      var mypiccserial = ''

      var mypicckey = ''
      //指定控制字
      myctrlword = BLOCK0_EN + BLOCK1_EN + BLOCK2_EN + EXTERNKEY
      //指定区号
      myareano = 8 //指定为第8区
      //批定密码模式
      authmode = 1 //大于0表示用A密码认证，推荐用A密码认证

      //指定序列号，未知卡序列号时可指定为8个0
      mypiccserial = '00000000'

      //指定密码，以下密码为厂家出厂密码
      mypicckey = 'ffffffffffff'

      try {
        strls = IcCardReader.piccreadex(myctrlword, mypiccserial, myareano, authmode, mypicckey)
        errorno = strls.substr(0, 4)

        var value = null
        var success = false

        switch (errorno) {
          case 'ER08':
          case 'ER09':
          case 'ER10':
            value = '寻不到卡'
            break
          case 'ER11':
            value = '密码认证错误\r\n'
            value = value + strls + '\r\n'
            value = value + '其中错误号为：' + errorno + '\r\n'
            value = value + '卡十六进制序列号为：' + strls.substr(5, 8) + '\r\n'
            break
          case 'ER12':
            value = '密码认证错误' + '\r\n'
            value = value + strls + '\r\n'
            value = value + '其中错误号为：' + errorno + '\r\n'
            value = value + '卡十六进制序列号为：' + strls.substr(5, 8) + '\r\n'
            break
          case 'ER13':
            value = '读卡错误' + '\r\n'
            value = value + strls + '\r\n'
            value = value + '其中错误号为：' + errorno + '\r\n'
            value = value + '卡十六进制序列号为：' + strls.substr(5, 8) + '\r\n'
            break

          case 'ER14':
            value = '写卡错误' + '\r\n'
            value = value + strls + '\r\n'
            value = value + '其中错误号为：' + errorno + '\r\n'
            value = value + '卡十六进制序列号为：' + strls.substr(5, 8) + '\r\n'
            break

          case 'ER21':
            value = '没找到动态库'
            break

          case 'ER22':
            value = '动态库或驱动程序异常'
            break

          case 'ER23':
            value = '读卡器未插上或动态库或驱动程序异常'
            break
          case 'ER24':
            value = '操作超时，一般是动态库没有反应'
            break
          case 'ER25':
            value = '发送字数不够'
            break
          case 'ER26':
            value = '发送的CRC错'
            break
          case 'ER27':
            value = '接收的字数不够'
            break
          case 'ER28':
            value = '接收的CRC错'
            break
          case 'ER29':
            value = '函数输入参数格式错误,请仔细查看'
            break
          default:
            success = true
            //读卡成功,其中ER00表示完全成功,ER01表示完全没读到卡数据，ER02表示仅读该卡的第一块成功,，ER02表示仅读该卡的第一二块成功，这是刷卡太快原因
            value = '读卡成功' + '\r\n'
            value = value + strls + '\r\n'
            value = value + '其中错误号为：' + errorno + '\r\n'
            value = value + '卡十六进制序列号为：' + strls.substr(5, 8) + '\r\n'
            value = value + '卡十进制序列号为：' + parseInt(strls.substr(5, 8), 16) + '\r\n'
            value = value + '该区第一块十六进制数据为：' + strls.substr(14, 32) + '\r\n'
            value = value + '该区第二块十六进制数据为：' + strls.substr(46, 32) + '\r\n'
            value = value + '该区第三块十六进制数据为：' + strls.substr(78, 32) + '\r\n'
            break
        }
        if(success) {
          return Promise.resolve(parseInt(strls.substr(5, 8), 16))
        } else {
          return Promise.reject(value)
        }
      } catch (e) {
        let errMsg = ""
        let userAgent = navigator.userAgent
        let isIE11 = userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1
        if(isIE11) {
          errMsg = '请设置IE internet选项:' + '\r\n' + '在"安全" ->> "自定义级别"中启用所有activeX选项！'
        } else {
          errMsg = '请在IE11浏览器中打开!' + '\r\n' +'并设置IE internet选项:' + '\r\n' + '在"安全" ->> "自定义级别"中启用所有activeX选项！'
        }
        return Promise.reject(errMsg)
      }
    }
  }
}
</script>


<style>
</style>
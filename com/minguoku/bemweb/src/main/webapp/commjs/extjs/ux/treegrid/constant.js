/*
 * js常量定义，如公用的按钮名称等
 */
Ext.namespace("extex.constant");

extex.USER_IMG_PATH="/gui/jslib/images/user/";
extex.webContextRoot="/gui/";
// 系统级js常量区域
/**
 * 是否为Window.open打开功能模式，这只用于开发模式，利于Firefox调试
 * (脚本调式中只显示本页面的脚本，若在统一框架中，统一框架的js也在其中，不利于调试)。
 * 
 * @type {Number}
 */
extex.constant.winOpenMode = 0;

/**
 * 发起流程并完成第一步活动
 */
extex.constant.TYPE_STARTANDFINFIR = 2;
	
/**
 * 选择下一步处理人并提交
 */
extex.constant.TYPE_SUBMIT_SELNEXT = 12;

/**
 * 生产系统的Grid是否需要StripeRow，奇偶行颜色不同
 * 
 * @type boolean
 */
extex.constant.gridNeedStripe = true;

/**
 * SmallInt最大值
 * 
 * @type {Number}
 */
extex.constant.maxSmallInt = 32767;
/**
 * 附件属性 add by zhoux
 * 
 * @type Number
 */
extex.constant.Addition_Property = 105333;
/**
 * Int最大值
 * 
 * @type {Number}
 */
extex.constant.maxInt = 2147483647;
/**
 * 默认模式名
 * 
 * @type {String}
 */
extex.constant.DFT_SCHEMA = "USERID";
/**
 * 日期格式:Y-m-d
 * 
 * @type {String}
 */
extex.constant.dataFormateYMD = "Y-m-d";
/**
 * 日期格式:Y-m-d H:i
 * 
 * @type {String}
 */
extex.constant.dataFormateYMDHI = "Y-m-d H:i";
/**
 * 日期格式:Y-m-d H:i:s
 * 
 * @type {String}
 */
extex.constant.dataFormateYMDHIS = "Y-m-d H:i:s";

/**  下面是按钮的文本定义区域，变量模式为：***BtnText  ***/
/**
 * 工具栏上按钮CSS风格
 * 
 * @type {String} x-btn-text : 文字按钮
 */
extex.constant.SC_TXT_BTN = "x-btn-text";
/**
 * 工具栏上按钮CSS风格
 * 
 * @type {String} x-btn-icon : 图标按钮
 */
extex.constant.SC_ICN_BTN = "x-tbar-raw x-btn-icon";
/**
 * 工具栏上按钮CSS风格
 * 
 * @type {String} x-btn-text-icon : 文字图标的按钮
 */
extex.constant.SC_TXTICN_BTN = "x-tbar-raw x-btn-text-icon";

/**
 * 新增按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.addBtnText = "新增";
extex.constant.addBtnTip = "增加一条新纪录";

/**
 * 下一个按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.nextBtnText = "下一个";
extex.constant.nextBtnTip = "跳转至符合此条件的下一个树节点";

/**
 * 上一个按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.previousBtnText = "上一个";
extex.constant.previousBtnTip = "跳转至符合此条件的上一个树节点";

/**
 * 编辑按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.editBtnText = "编辑";
extex.constant.editBtnTip = "修改选中记录的第一条";
/**
 * 删除按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.delBtnText = "删除";
extex.constant.delBtnTip = "删除选中记录";
/**
 * 查看按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.viewBtnText = "查看";
extex.constant.viewBtnTip = "查看选中记录的第一条";

/**
 * 回复按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.backBtnText = "回复";
extex.constant.backBtnTip = "回复选中记录";


/**
 * 保存按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.saveBtnText = "保存";
extex.constant.saveBtnTip = "保存当前信息";

/**
 * 导出按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.exportBtnText = "导出";
extex.constant.exportBtnTip = "导出当前查询结果到MS OFFICE";

/**
 * 添加学生按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.addStudentBtnText = "添加学生";
extex.constant.addStudentBtnTip = "在弹出的学生列表中添加选中学生";

/**
 * 添加按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.addCouBtnText = "添加";
extex.constant.addCouBtnTip = "添加选中课程";

/**
 * 移除学生按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.delStudentBtnText = "移除学生";
extex.constant.delStudentBtnTip = "从当前班级移除选中学生";

/**
 * 选择课程按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.selectCouBtnText = "选择课程";
extex.constant.selectCouBtnTip = "在弹出的课程列表中选择课程";

/**
 * 移除课程按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.delCouBtnText = "移除课程";
extex.constant.delCouBtnTip = "移除所选课程";

/**
 * 保存并继续按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.saveGoOnBtnText = "保存并继续";
extex.constant.saveGoOnBtnTip = "保存当前信息，并继续操作";
/**
 * 选择并继续按钮文本和提示
 */
extex.constant.getGoOnBtnText="选择并继续";
extex.constant.getGoOnBtnTip="保存选中的当前信息，并继续操作";
/**
 * 确定按钮文本和提示
 * 
 * @type {String}
 */
extex.constant.yesBtnText = "确定";
extex.constant.yesBtnTip = "确定当前操作";
/**
 * 关闭按钮文本和提示(主页面不要有此按钮，弹出框才有可能需要)
 * 
 * @type {String}
 */
extex.constant.closeBtnText = "关闭";
extex.constant.closeBtnTip = "关闭当前功能";

/**
 * 置顶文本和提示
 * 
 * @type {String}
 */
extex.constant.topBtnText = "置顶";
extex.constant.topBtnTip = "置顶所选行";
/**
 * 上移文本和提示
 * 
 * @type {String}
 */
extex.constant.upBtnText = "上移";
extex.constant.upBtnTip = "上移所选行";
/**
 * 下移文本和提示
 * 
 * @type {String}
 */
extex.constant.downBtnText = "下移";
extex.constant.downBtnTip = "下移所选行";
/**
 * 沉底文本和提示
 * 
 * @type {String}
 */
extex.constant.bottomBtnText = "沉底";
extex.constant.bottomBtnTip = "沉底所选行";
/**
 * 重新排序后保存文本和提示
 * 
 * @type {String}
 */
extex.constant.orderRefreshBtnText = "刷新";
extex.constant.orderRefreshBtnTip = "保存更改";


/**
 * 查看并反馈
 */
extex.constant.feedBackBtnText = "处理";
extex.constant.feedBackBtnTip = '处理一条记录';

/**
 * 版本发布
 */
extex.constant.releaseBtnText = "发布版本";
extex.constant.releaseBtnTip = '发布一条版本信息';

/**
 * 附件按钮文本
 * 
 * @type {String}
 */
extex.constant.accBtnText = "附件";
/**
 * 刷新按钮文本
 * 
 * @type {String}
 */
extex.constant.refreshBtnText = "刷新";
/**
 * 查询按钮文本
 * 
 * @type {String}
 */
extex.constant.queryBtnText = "查询";


/**
 * 保存并提交按钮文本
 * 
 * @type {String}
 */
extex.constant.saveAndSubmitBtnText = "保存并提交";

/**
 * 拷贝按钮文本
 * 
 * @type {String}
 */
extex.constant.copyBtnText = "拷贝";
/**
 * 剪切按钮文本
 * 
 * @type {String}
 */
extex.constant.cutBtnText = "剪切";
/**
 * 粘贴按钮文本
 * 
 * @type {String}
 */
extex.constant.pasteBtnText = "粘贴";
/**
 * 打印按钮文本
 * 
 * @type {String}
 */
extex.constant.printBtnText = "打印";

/**
 * 导入按钮文本
 * 
 * @type {String}
 */
extex.constant.importBtnText = "导入";
/**
 * 排序按钮文本
 * 
 * @type {String}
 */
extex.constant.sortBtnText = "排序";
/**
 * 清空按钮文本
 * 
 * @type {String}
 */
extex.constant.clearTextBtnText = "清空";
/**
 * 作废按钮文本
 * 
 * @type {String}
 */
extex.constant.cancelBtnText = "作废";
/**
 * 处理按钮文本
 * 
 * @type {String}
 */
extex.constant.handleBtnText = "处理";
/**
 * 接收按钮文本
 * 
 * @type {String}
 */
extex.constant.receiveBtnText = "接收";
/**
 * 提交按钮文本
 * 
 * @type {String}
 */
extex.constant.submitBtnText = "提交";
/**
 * 审批按钮文本
 * 
 * @type {String}
 */
extex.constant.checkBtnText = "审批";
/**
 * 通过按钮文本
 * 
 * @type {String}
 */
extex.constant.passBtnText = "通过";
/**
 * 驳回按钮文本
 * 
 * @type {String}
 */
extex.constant.rejectBtnText = "驳回";
/**
 * 统计按钮文本
 * 
 * @type {String}
 */
extex.constant.statBtnText = "统计";
/**
 * 统计分析按钮文本
 * 
 * @type {String}
 */
extex.constant.statAnalyseBtnText = "统计分析";
/**
 * 综合查询
 * 
 * @type String
 */
extex.constant.colligateQueryBtnText = "综合查询";
/**
 * 汇总按钮文本
 * 
 * @type {String}
 */
extex.constant.gatherBtnText = "汇总";
/**
 * 合并按钮文本
 * 
 * @type {String}
 */
extex.constant.joinBtnText = "合并";
/**
 * 拆分按钮文本
 * 
 * @type {String}
 */
extex.constant.divideBtnText = "拆分";
/**
 * 交换按钮文本
 * 
 * @type {String}
 */
extex.constant.switchBtnText = "交换";
/**
 * 清空
 * 
 * @type{string}
 */
extex.constant.clearBtnText = "清空";

/**
 * 重置文本
 * 
 * @type {String}
 */
extex.constant.resetBtnText = "重置";
/**
 * 高级查询
 * @type {String}
 */
extex.constant.advanceQryBtnText = "高级查询";


/**
 * 对应Ext.data.JsonReader中的totalProperty
 */
extex.PC = "count";
/**
 *  对应Ext.data.JsonReader中的root
 * @type String
 */
extex.PR = "records";

extex.PS=10;


/** 下面是正则表达式定义区域，变量模式为：regex***，和regexDesp *****/
/**
 * 不允许出现特殊字符Reg,一般用于名称 $结束符 +一次或多次 ^开始符 ()定义匹配模式 \w包括下划线的任何单词字符 |或者 [^]负值字符范围。
 * 
 * @type {RegExp}
 */
extex.constant.regexNoSpecChar = /^(\w|[^ -~])+$/;
extex.constant.regexDespNoSpecChar = '不允许出现特殊字符';
/**
 * 只能由字母数字及下划线组成Reg,一般用于编码
 * 
 * @type {RegExp}
 */
extex.constant.regexCode = /^\w+$/;
extex.constant.regexDespCode = '只能由字母数字及下划线组成';
/**
 * 只能由字母数字组成Reg
 * 
 * @type {RegExp}
 */
extex.constant.regexLetterNum = /^[A-Za-z0-9]+$/;
extex.constant.regexDespLetterNum = "只能由字母数字组成";
/**
 * 整数的Reg
 * 
 * @type {RegExp}
 */
extex.constant.regexInt = /^[-\+]?\d+$/;
extex.constant.regexDespInt = "只能是整数";
/**
 * 正整数的Reg
 * 
 * @type {RegExp}
 */
extex.constant.regexPositiveInt = /^([1-9]\d*)$/;
extex.constant.regexDespPositiveInt = "只能是正整数";
/**
 * 非负整数的Reg
 * 
 * @type {RegExp}
 */
extex.constant.regexPositiveIntAndZero = /^([0-9]\d*)$/;
extex.constant.regexDespPositiveIntAndZero = "只能是非负整数";
/**
 * 非负整数的Reg
 * 
 * @type {RegExp}
 */
extex.constant.regexNotMinusInt = /^\d+$/;
extex.constant.regexDespNotMinusInt = "只能是正整数或零";
/**
 * 非负数的Reg
 * 
 * @type RegExp
 */
extex.constant.regexNotMinusFloat = /^\d+(\.\d+)?$/;
extex.constant.regexDespNotMinusFloat = "只能是非负数";
/**
 * 正数的Reg
 * 
 * @type RegExp
 */
extex.constant.regexPositiveFloat = /^[1-9]\d*(\.\d+)?$|^0\.\d*[1-9]\d*$/;
extex.constant.regexDespPositiveFloat = "只能是正数";
/**
 * 浮点数的Reg
 * 
 * @type {RegExp}
 */
extex.constant.regexFloat = /^[-\+]?\d+(\.\d+)?$/;
extex.constant.regexDespFloat = "只能是浮点数";
/**
 * 1位小数浮点数的Reg
 * 
 * @type {RegExp}
 */
extex.constant.regexFloatOne = /^[-\+]?\d+(\.\d)?$/;
extex.constant.regexDespFloatOne = "只能是1位小数浮点数";
/**
 * 2位小数浮点数的Reg
 * 
 * @type {RegExp}
 */
extex.constant.regexFloatTwo = /^[-\+]?\d+(\.\d(\d)?)?$/;
extex.constant.regexDespFloatTwo = "只能是2位小数浮点数";
/**
 * 3位小数浮点数的Reg
 * 
 * @type {RegExp}
 */
extex.constant.regexFloatThree = /^[-\+]?\d+(\.\d(\d)?(\d)?)?$/;
extex.constant.regexDespFloatThree = "只能是3位小数浮点数";
/**
 * 正3位小数浮点数的Reg
 * 
 * @type {RegExp}
 */
extex.constant.regexPlusFloatThree = /^\d+(\.\d(\d)?(\d)?)?$/;
extex.constant.regexDespPlusFloatThree = "只能是正3位小数浮点数";
/**
 * 日期的Reg，格式：YYYY-MM-DD
 * 
 * @type {RegExp}
 */
extex.constant.regexDate = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29))$/;
extex.constant.regexDespDate = "日期格式不合法，格式：YYYY-MM-DD";
/**
 * 时间的Reg，格式：HH:MM:SS
 * 
 * @type {RegExp}
 */
extex.constant.regexTime = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
extex.constant.regexDespTime = "时间格式不合法，格式：HH:MM:SS";
/**
 * 日期时间的Reg，格式：YYYY-MM-DD HH:MM:SS
 * 
 * @type {RegExp}
 */
extex.constant.regexDateTime = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29)) ([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
extex.constant.regexDespDateTime = "日期时间格式不合法，格式：YYYY-MM-DD HH:MM:SS";
/**
 * 日期时间的Reg，格式：YYYY-MM-DD HH:MM
 * 
 * @type {RegExp}
 */
extex.constant.regexDateTimeWithoutSec = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29)) ([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
extex.constant.regexDespDateTimeWithoutSec = "日期时间格式不合法，格式：YYYY-MM-DD HH:MM";
/**
 * E-mail的Reg
 * 
 * @type {RegExp}
 */
extex.constant.regexEmail = /^(.+)@(.+)$/;
extex.constant.regexDespEmail = "E-mail格式不合法";
/**
 * 手机号码Reg
 * 
 * @type {RegExp}
 */
extex.constant.regexMobile = /^\d{11}$/;
extex.constant.regexDespMobile = "手机号码格式不合法";
/**
 * 六位以内浮点数Reg
 * 
 * @type {RegExp}
 */
extex.constant.regexFloatSix = /^\d*(\.\d{1,6})?$/;
extex.constant.regexDespFloatSix = "小数点位数不能超过六位";

/**
 * 班级信息维护按钮提示
 */
extex.constant.addUserBtnText = "新增班级";
extex.constant.addUserBtnTip = "新增班级";
extex.constant.editUserBtnText = "编辑班级信息";
extex.constant.editUserBtnTip = "编辑班级信息";
extex.constant.viewUserBtnText = "查看班级信息";
extex.constant.viewUserBtnTip = "查看班级信息";
extex.constant.delUserBtnText = "删除班级";
extex.constant.delUserBtnTip = "删除班级";


extex.constant.addStuBtnText = "新增学生信息";
extex.constant.addStuBtnTip = "新增学生信息";
extex.constant.viewStuBtnText = "查看学生信息";
extex.constant.viestuBtnTip = "查看学生信息";
extex.constant.editStuBtnText = "编辑学生信息";
extex.constant.editStuBtnTip = "编辑学生信息";
extex.constant.delStuBtnText = "删除学生信息";
extex.constant.delStuBtnTip = "删除学生信息";

extex.constant.addPrntBtnText = "新增家长信息";
extex.constant.addPrntBtnTip = "新增家长信息";
extex.constant.editPrntBtnText = "编辑家长信息";
extex.constant.editPrntBtnTip = "编辑家长信息";
extex.constant.delPrntBtnText = "删除家长信息";
extex.constant.delPrntBtnTip = "删除家长信息";
extex.constant.savePrntBtnText = "保存家长信息";
extex.constant.savePrntBtnTip = "保存家长信息";

/**
 * 课程信息维护按钮提示
 */
extex.constant.addCouTypeBtnText = "新增课程分类";
extex.constant.addCouTypeBtnTip = "增加一个新的课程分类";

extex.constant.editCouTypeBtnText = "编辑课程分类";
extex.constant.editCouTypeBtnTip = "修改课程分类信息";

extex.constant.delCouTypeBtnText = "删除课程分类";
extex.constant.delCouTypeBtnTip = "删除课程分类信息";

extex.constant.viewCouTypeBtnText = "查看课程分类";
extex.constant.viewCouTypeBtnTip = "查看课程分类信息";

extex.constant.addCourseBtnText = "新增课程";
extex.constant.addCourseBtnTip = "增加一个课程信息";

extex.constant.editCourseBtnText = "编辑课程";
extex.constant.editCourseBtnTip = "修改课程信息";

extex.constant.delCourseBtnText = "删除课程";
extex.constant.delCourseBtnTip = "删除课程信息";

extex.constant.viewCourseBtnText = "查看课程";
extex.constant.viewCourseBtnTip = "查看课程信息";

/**
 * 国网绿的颜色值
 * @type {Number}
 */
extex.constant.Color_gwl = -2492185;

/**
 * 获得上级节点
 */
extex.constant.getSuperNodeBtnText = "获得上级节点";
extex.constant.getSuperNodeBtnTip = "根据当前节点获得上级节点的信息";
/**
 * 获得下级节点
 */
extex.constant.getLowNodeBtnText = "获得下级节点数组";
extex.constant.getLowNodeBtnTip = "根据当前节点获得下级节点的数组信息";
/**
 * 节点数
 */
extex.constant.getNodeNumBtnText = "节点数";
extex.constant.getNodeNumBtnTip = "获得选中的节点总数量";
/**
 * 获得父节点
 */
extex.constant.getParentNodeBtnText = "根据属性获得父节点";
extex.constant.getParentNodeBtnTip = "根据属性获得当前节点的父节点的信息";

/**
 * 输出查询结果提示
 */
extex.constant.exportClew = "请执行查询操作之后再执行输出查询结果操作！";

/**
 * 班级信息按钮
 */
extex.constant.addClassBtnText="新增班级信息";
extex.constant.addClassBtnTip="新增班级信息";
extex.constant.editClassBtnText="编辑班级信息";
extex.constant.editClassBtnTip="编辑班级信息";
extex.constant.viewClassBtnText="查看班级信息";
extex.constant.viewClassBtnTip="查看班级信息";
extex.constant.delClassBtnText="删除班级信息";
extex.constant.delClassBtnTip="删除班级信息";

/**
 * 管理用户按钮
 */
extex.constant.addUserBtnText = "新增用户";
extex.constant.addUserBtnTip = "新增用户";
extex.constant.editUserBtnText = "编辑用户信息";
extex.constant.editUserBtnTip = "编辑用户信息";
extex.constant.viewUserBtnText = "查看用户信息";
extex.constant.viewUserBtnTip = "查看用户信息";
extex.constant.delUserBtnText = "删除用户";
extex.constant.delUserBtnTip = "删除用户";
/**
 * 返回至登录页面
 */
extex.constant.backToLoginBtn = "返回登录";
extex.constant.backToLoginBtnTip = "返回至登录页面";
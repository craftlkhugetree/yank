https://720yun.com/t/c9fjr7syOu5


2022/5/6 读者教育
【feat】mixins:confirmDialog 4 exam and timing; result, examResult, examing; replace $message by Notify.


【fix】toExam(normal exam is the 0 index，otherwise no content);modelStep last item's text nowrap; exam component's canClick is only 4 normal exam

【fix】Notify(warning); img(object-fit: cover); Result component's CSS

【feat】circle for examing condition

2022/5/7
【feat】answerPop
【feat】examResult; publicPath

2022/5/9 座位预约
【feat】座位预约，排序上移下移 sectionManage

2022/5/10
【feat】importDialog(require xlsx)
【fix】interval-seat can't in border; import * as XLSX from equals require
【feat】check and transform excel data; export excel template; seatData's seats trigger seatSet component re-render

2022/5/11
【座位预定】增加查询预约记录和取消预约接口；增加预约记录路由:id和props:里的传参；assignRecord、preAssign；seatMap、assignDialog
【feat】timeChoose

2022/5/12
【座位预定】api and seat img；选座、日期、人员；取消预约的msgBox感叹号；el-tag的@close必须有参数。

【座位预定】timeChoose与assignDialog交互
1655 【后台管理_培训资料】分页问题汇总
1657 【后台管理_培训资料】查看资料页面，点击删除，功能不生效
1660 【后台管理_培训资料】删除资料弹窗文字换行显示

2022/5/16
【富文本】1、斜体不生效 2、引用不生效 3、表格没有样式 1656 【后台管理_培训资料】保存资料成功后，点击查看资料，页面跳转undefined。

1663 【后台管理_题库管理】新增单选题保存成功后，弹窗新增下一题页面，输入选项不成功，页面报错。切换题型，表单内容串了；新增时，不是当前列表的题型；编辑时，不应当还能切换题型。删除时，pagesize紊乱。

radio的默认有值时，该值不能点击，所以要设为null。1664 【后台管理_题库管理】题库列表删除任一题目后，列表自动刷新显示题数不正确。

1666 【后台管理_考试管理】考试记录统计不正确；1665 【后台管理_题库管理】导出题库功能不生效

2022/5/17
修复poolMax书写错误，1670 【管理端_考试管理】编辑考试，当组卷信息中的题目模块发现变更时，题目数量直接变更为空，需要重新编辑修改

1671 【管理端_考试管理_闯关考试】新增闯关考试关卡题目均为0保存成功，再次编辑页面报错
1672 【管理端_考试管理_闯关考试】编辑闯关考试，关卡显示新增的分类模块以及模块下面的题目数量可以选择
1677 【后台管理_用户管理】点击勾选功能不生效，点击用户导出页面报错
1667 【PC端_入馆考试】当前没有试卷的时候，仍然显示该学生类型可以学习的资料      // 没有考试时，学习资料为普通考试形式展示，原闯关资料也可以浏览
1669 【PC端_入馆考试】考试合格分为30分，0分通过后图书证首页显示激活
    
2022/5/18
el-dialog v-modal高度，scrollIntoView()；字符串的includes不准确；三个异步接口的顺序问题。
1668 【PC端_入馆考试】学习资料显示不全
1674 【PC端_闯关考试】学习时长不够，应当无法点击立即考试
1676 【PC端_闯关考试】闯关考试第三关部通过后，返回入馆考试页面，多次刷新考试页面，显示重新从第一关开始考试
1675 【PC端_闯关考试】考试不通过，图片不显示
1662 【后台管理_培训资料_在线文章】在线文章，没有下载功能，查看详情不需要下载量和大小统计

2022/5/19
1686 【PC端_入馆考试】限制IP访问后，在限制范围内的IP，不能参加考试

2022/5/23
feat：管理端富文本框从wangEditor改为angkeEditor，且手机端无需预览，管理端预览为富文本框内部的移动端预览。1659 【后台管理_培训资料】新增资料页面，手机端和PC端预览功能不生效

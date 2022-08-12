#!/bin/sh

read -p  "请填写commit提交的信息:" msg
# 空值判断
if [ ! $msg ]; then
  echo -e "\033[31m 终止提交，因为提交说明为空。\033[0m" 
else
  echo -e "\033[32m \n 开始执行add-commit操作...... \033[0m"
  # commit可以换成cz工具
  git add -A && git commit -m "$msg"
  echo -e "\033[32m \n commit完毕，开始拉取以及推送代码 \n \033[0m"
  git svn dcommit
  # 判断上一条命令是否成功
  if [ $? -eq 0 ]; then
    echo -e "\033[32m \n流程结束，完成提交。\033[0m"
   else
    echo -e "\033[31m \n出错了,请解决错误 \033[0m"
   fi
fi

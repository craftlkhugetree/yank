#!/bin/sh
# 打开错误退出开关
set -e
# !-n 用于判断变量是否为空,注意只要有一个符号就不为空,空格也不行
# read -p  "请填写commit提交的信息:" msg
# 空值判断
# if [ ! -n "$msg" ]; then
node  /d/yank/puppeteer/index.js 
  # 判断上一条命令是否成功, $? 代表上一个命令执行后的退出状态
if [ $? -eq 0 ]; then
    echo -e "\033[32m \n流程结束，完成提交。\033[0m"
else
    echo -e "\033[31m \n出错了,请解决错误 \033[0m"
fi

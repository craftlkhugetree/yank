#!/bin/sh
# !-n 用于判断变量是否为空,注意只要有一个符号就不为空,空格也不行
# read -p  "请填写commit提交的信息:" msg
msg='l = 0'
echo $msg
# 空值判断
# if [ -z $msg ]; then
# if [ ! -n "$msg" ]; then

# a = b中等号被当作条件判断符(等号两边有空格)，所以 ! (a = b) 为真
if [ ! $msg ]; then
  echo -e "\033[31m true \033[0m" 
else
  echo -e "\033[32m \n false \033[0m"
fi

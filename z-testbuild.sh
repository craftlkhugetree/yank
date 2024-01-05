#!/bin/sh
# 打开错误退出开关
set -e

if [ "$1" ]; then
  res=$(node /d/yank/puppeteer/testCD.js $1)
  # node /d/yank/puppeteer/index.js $1
  echo $res
fi
echo "Hey, I'm in $PWD"


# "/d/kxiangmu/njauLogistics/fuwujiandu"
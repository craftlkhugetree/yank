#!/bin/bash
date         #打印当前时间
while true   #死循环
do
    #每隔2秒打印一次
    sleep 2
    whatthis    #不存在的命令
    pid=$(ps -au | grep testStderr.sh | awk 'NR==1{print $2}')
    ls /proc/$pid/fd -l
    echo -e "std output"
done

#!/bin/bash
date         #打印当前时间
while true   #死循环
do
    #每隔2秒打印一次
    sleep 2
    whatthis    #不存在的命令
    # nohup ./**.sh & 可以隐藏运行，同时 &1 &2都输入到nohup.out，再用 ls /proc/$pid/fd 查看进程对应文件
    pid=$(ps -au | grep testStderr.sh | awk 'NR==1{print $2}')
    ls /proc/$pid/fd -l
    echo -e "std output"
done

#!/usr/bin/env bash

# shell有一个环境变量RANDOM,范围是0--32767
# 如果我们想要产生0-25范围内的数：$(($RANDOM%26)) 在$(()) 是可以省略取值的$符号的。（All tokens in the expression undergo parameter expansion, string expansion, command substitu-tion, and quote removal.）

 n=$(( RANDOM % 100 ))

 if [[ n -eq 42 ]]; then
     echo "Something went wrong"
     >&2 echo "The error was using magic numbers"
     exit 1
 fi

 echo "Everything went according to plan"
 

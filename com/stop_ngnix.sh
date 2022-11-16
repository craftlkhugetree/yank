list=`tasklist | grep nginx | awk '{print $2}'`
# i=$(ls 123.txt)
for pid in ${list[*]}
do
  echo $pid
  cmd "/C taskkill /PID $pid /F"
done
source /d/yank/com/node_ngnix.sh


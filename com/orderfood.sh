# !/bin/sh
#不能有空格
read -p  "nannong请填写IDSTGC:" msg
filename1='/d/kxiangmu/orderfood/orderfood-mobile/src/assets/js/util.js'
filename2='/d/kxiangmu/orderfood/orderfood-pc/src/assets/js/util.js'

IDSTGC="var IDSTGC"

arr=($filename1 $filename2)

for filename in ${arr[*]}
do
  sed -i "s/\($IDSTGC.*\)[\"'].*[\"']/\1\"$msg\"/g" $filename 
done

#sed正则内的括号必须转义
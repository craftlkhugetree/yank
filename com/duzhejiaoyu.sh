# !/bin/sh
#不能有空格
read -p "读者教育请填写IDSTGC:" msg
path='/d/kl'
filename1=$path'/mobile/src/assets/js/util.js'
filename2=$path'/control/src/assets/js/util.js'
filename3=$path'/web/src/assets/js/util.js'

IDSTGC="var IDSTGC"

arr=($filename1 $filename2 $filename3)

for filename in ${arr[*]}
do
  sed -i "s/\($IDSTGC.*\)[\"'].*[\"']/\1\"$msg\"/g" $filename 
done
#sed正则内的括号必须转义

# code $path'/netRepair-mobile_njit'
# code $path'/netRepair_njit'
cd $path'/control/'
# !/bin/sh
#不能有空格
read -p "座位预约请填写IDSTGC:" msg
path='/d/kxiangmu/zuoweiyuyue'
filename1=$path'/seat_v2_pc/src/assets/js/util.js'
filename2=$path'/seatMobile/src/util/util.js'

IDSTGC="var IDSTGC"

arr=($filename1 $filename2)

for filename in ${arr[*]}
do
  sed -i "s/\($IDSTGC.*\)[\"'].*[\"']/\1\"$msg\"/g" $filename 
done
#sed正则内的括号必须转义

# code $path'/netRepair-mobile_njit'
# code $path'/netRepair_njit'
cd $path'/seat_v2_pc/'
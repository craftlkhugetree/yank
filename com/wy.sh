# !/bin/sh
#不能有空格
read -p "物业请填写IDSTGC:" msg
path='/d/kxiangmu/njauLogistics/fuwujiandu'
filename1=$path'/hq-wyxxgl-pc/src/assets/js/util.js'
filename2=$path'/hq-spgl-njit-pc/src/assets/js/util.js'
filename3=$path'/hq-spgl-njit-mobile/src/assets/js/util.js'

IDSTGC="var IDSTGC"

arr=($filename1 $filename2 $filename3)

for filename in ${arr[*]}
do
  sed -i "s/\($IDSTGC.*\)[\"'].*[\"']/\1\"$msg\"/g" $filename 
done
#sed正则内的括号必须转义

# code $path'/netRepair-mobile_njit'
# code $path'/netRepair_njit'
# cd $path'/hq-spgl-njit-mobile/'
cd $path'/hq-wyxxgl-pc/'
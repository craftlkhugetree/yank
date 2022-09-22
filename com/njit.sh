# !/bin/sh
#不能有空格
read -p  "njit南工程请填写IDSTGC:" msg
path='/d/kxiangmu/njauLogistics'
filename1=$path'/netRepair-mobile_njit/src/assets/js/util.js'
filename2=$path'/netRepair_njit/src/assets/js/util.js'
#file1='/D/kxiangmu/appointment/appointmentFrontEnd_v2/src/components/BaseUpload.vue'
#file2='/D/kxiangmu/appointment/appointmentFrontEnd_v2_mobile/src/components/BaseUpload.vue'
#headers="headers: { IDSTGC: getCookie('IDSTGC') || '$msg'}"
#head="headers: { IDSTGC: this.getCookie('IDSTGC') || '$msg'}"

IDSTGC="var IDSTGC"

arr=($filename1 $filename2)

for filename in ${arr[*]}
do
  sed -i "s/\($IDSTGC.*\)[\"'].*[\"']/\1\"$msg\"/g" $filename 
done
#sed正则内的括号必须转义

# code $path'/netRepair-mobile_njit'
# code $path'/netRepair_njit'
cd $path'/netRepair_njit/'
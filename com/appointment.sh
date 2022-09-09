# !/bin/sh
#不能有空格
read -p  "请填写IDSTGC:" msg
filename1='/D/kxiangmu/appointment/03code/appointmentFrontEnd_v2/src/assets/js/util.js'
filename2='/D/kxiangmu/appointment/03code/appointmentFrontEnd_v2_mobile/src/assets/js/util.js'
filename3='/D/kxiangmu/appointment/03code/appointScreen/js/sign.js'
filename4='/D/kxiangmu/appointment/03code/appointScreen/js/detail.js'
filename5='/D/kxiangmu/appointment/03code/appointScreen/js/appointScreen.js'
#file1='/D/kxiangmu/appointment/appointmentFrontEnd_v2/src/components/BaseUpload.vue'
#file2='/D/kxiangmu/appointment/appointmentFrontEnd_v2_mobile/src/components/BaseUpload.vue'
#headers="headers: { IDSTGC: getCookie('IDSTGC') || '$msg'}"
#head="headers: { IDSTGC: this.getCookie('IDSTGC') || '$msg'}"

IDSTGC="var IDSTGC"

arr=($filename1 $filename2 $filename3 $filename4 $filename5)

for filename in ${arr[*]}
do
  sed -i "s/\($IDSTGC.*\)'.*'/\1'$msg'/g" $filename 
done

#sed正则内的括号必须转义
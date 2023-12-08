#include <stdio.h>
#include <stdlib.h>
#include <string.h>
 
int len;
typedef void ( * p_fun)(void);
 
 
void bad_fun()
{
    printf("\nok, i did it.\n");
}
 
void fun(const char* input, int size)
{
    char buf[8];
// memcpy()函数的功能是:从源头指向的内存块拷贝固定字节数的数据到目标指向的内存块，与strcpy()函数不同的是,该函数不会检查任何终止字符(如'\0'),而总是精确的拷贝参数传入的字节数.
    memcpy(buf, input, abs(size));
    printf("\nAddress of param=%p\n",input);
    printf("Address of size=%p\n",&size);
    // printf("Address of ret0=%p\n",*(input-1));
    printf("Address of buf, ret=%p,%p\n",buf, buf+8);
    printf("Address of retValue=%p\n", *(buf+8));
    // printf("Address of local value=%p\n",buf);
    // *(buf+8) = bad_fun;
    len=(long)input-(long)buf;    //计算从local variable到fun param的长度, 该长度就是ret地址存在的空间
    printf("i am in fun: %s\n", buf);
}
 
 
int main(int argc, char* argv[])
{
    int addr[8] = {0};
    char s[] = "cal len";
    long go = (long)bad_fun;
    char ss[100] = {0};
    
    printf("sizeof(s): %d\n", sizeof(s));
    fun(s, sizeof(s));
  
     //((p_fun)go)();
    printf("len = %d\n", len);
 
//  %p 可以匹配对应类型的指针地址，输出以16进制表示，会自带前缀0x
// %x 可以对应int类型的指针，输出以16进制输出，不会自带前缀0x
// 类似的，%lx，表示long类型整数，用16进制输出；
// 当然，上面也可以用 %ld，表示将long类型的指针地址，强制用10进制输出

    printf("Address of fun=%p\n", fun);
    printf("Address of bad_fun=%p\n", bad_fun);
    printf("Address of go=%lx\n", go);
 
    //把bad_fun()函数的地址分离成字节, 然后储存到ss中
    addr[0]=(go >> 0) & 0xff; addr[1]=(go >> 8) & 0xff; addr[2]=(go >> 16) & 0xff;  addr[3]=(go >> 24) & 0xff;
    addr[4]=(go >> 32) & 0xff; addr[5]=(go >> 40) & 0xff; addr[6]=(go >> 48) & 0xff;  addr[7]=(go >> 56) & 0xff;
    for(int j=0;j<8;j++)
    {
        ss[abs(len)-j-1]=addr[7-j];
        printf("%x--%d\n", addr[7-j],ss[abs(len)-j-1]);
    }
    fun(ss, len); // 返回地址ret被改为bad_fun()了
    printf("test end.\n");    //由于函数返回地址被修改，此代码不被执行
    return 0;
}


/**
  .\a.exe
 Address of param=0xffffcb10
 Address of ret=0x10040120c
 Address of local value=0xffffcaf8
 i am in fun
 Address of fun=0x1004010e0
 Address of bad_fun=0x10040116d
 Address of go=10040116d
 Address of param=0xffffcb10
 Address of ret=0x10040116d
 Address of local value=0xffffcaf8
 i am in fun
 ok, i did it.

分析：
1）要实现本功能主要要实现以下两点：

计算fun函数入参input到fun局部变量buf的长度（字节），由此便可以知道返回地址相对于buf的偏移，因为ret地址就在函数入参input的下方

利用buf数组来修改ret地址

2）测试系统为小端模式

3）测试系统为64位，所以需要注意函数地址为64位（8字节长），而不是32位。另外寄存器也是8字节长。

————————————————
./stack.md
原文链接：https://blog.csdn.net/u012247418/article/details/98989972
*/
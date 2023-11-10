#： 字符串化，使用时需加"" 
##：组合 2 个 C 语言标识符（token）
```c
#include <stdio.h>

#define TOKEN_PASTER(n)  printf("num_"#n"= %d\n",num_##n)

int main(void)
{
    int num_1 = 100;

    TOKEN_PASTER(1); // num_1= 100

    return 0;
}
```


```c
#include<stdio.h>

void main(void)
{
    char buf[4];
    const char a = 0;

    buf[-1] = 88;
    printf("the a is %d\n" ,a); // the a is 88
}
```
说明：const 修饰的变量，其实质是告诉程序员和编译器该变量为只读，而对于像数组溢出，隐式修改等程序不规范书写造成的运行过程中的修改，编译器是无能为力的，也说明 const 修饰的变量仍然是具备变量属性的。

```c
#include<stdio.h>

typedef struct {
    int a;
    int b;
    int c;
} TEST;

TEST arr[]={
    {1,2,3},
    {4,5,6},
    {7,8,9}
};

void main(void)
{
    TEST *tmp;
    tmp = arr;

    printf("tmp: %d, %d, %d,%d, %d, %d,%d, %d, %d\n", tmp[0].a, tmp[0].b, tmp[0].c, tmp[1].a, tmp[1].b, tmp[1].c, tmp[2].a, tmp[2].b, tmp[2].c);
    printf("arr: %d, %d, %d,%d, %d, %d,%d, %d, %d\n", arr[0].a, arr[0].b, arr[0].c, arr[1].a, arr[1].b, arr[1].c, arr[2].a, arr[2].b, arr[2].c);
}
// tmp: 1, 2, 3,4, 5, 6,7, 8, 9
// arr: 1, 2, 3,4, 5, 6,7, 8, 9
```
结果分析：
1）数组名可以直接赋值给相同类型的指针变量
2）指针变量可以采用类似数组的用法，如：tmp[0].a

注：不能将数组名赋值给数组变量，如：
TEST jj[3];
jj = arr;
编译将产生错误： error: incompatible types when assigning to type ‘struct TEST[3]’ from type ‘struct TEST *’
————————————————
原文链接：https://blog.csdn.net/u012247418/article/details/98349995


```c
#include <stdio.h>
 
void main()
{
 
    char a[2][3];
    char *b;
    char c[5];
 
    b=c;
 
    printf("addr of arr:\n%p\n%p\n%p\n%p\n%p\n%p\n%p\n%p\n%p\n%p\n"
            ,a,a+1,&a,&a+1,a[0],a[0]+1,&a[0],&a[0]+1,&a[0][0],&a[0][0]+1);
    printf("addr of ptr:\n%p\n%p\n%p\n%p\n%p\n",c,&c,&c[0],b,&b);
    printf("sizeof:%d\t%d\t%d\t%d", sizeof(c), sizeof(&c), sizeof(b), sizeof(&b)); 
    printf("addr of arr+1:\n%p\n%p\n%p\n%p\n%p\n%p\n%p\n%p\n",c,c+1,&c,&c+1,b,b+1,&b,&b+1);
}
// addr of arr:
// 0x7ffeaecec0ca
// 0x7ffeaecec0cd
// 0x7ffeaecec0ca
// 0x7ffeaecec0d0
// 0x7ffeaecec0ca
// 0x7ffeaecec0cb
// 0x7ffeaecec0ca
// 0x7ffeaecec0cd
// 0x7ffeaecec0ca
// 0x7ffeaecec0cb
// addr of ptr:
// 0x7ffeaecec0bb
// 0x7ffeaecec0bb
// 0x7ffeaecec0bb
// 0x7ffeaecec0bb
// 0x7ffeaecec0c0
// sizeof:5	8	8	8
// addr of arr+1:
// 0x7ffeaecec0bb
// 0x7ffeaecec0bc
// 0x7ffeaecec0bb
// 0x7ffeaecec0c0
// 0x7ffeaecec0bb
// 0x7ffeaecec0bc
// 0x7ffeaecec0c0
// 0x7ffeaecec0c8
```
分析：
1）a、&a、a[0]、&a[0]、&a[0][0]都代表2维数组a[2][3]的首地址，但是地址加1的步长有区别。
a+1; 第二行第一个元素的地址
&a+1; 二维数组之后的首个地址
a[0]+1; 二维数组第一行第二个元素地址
&a[0]+1; 二维数组第二行第一个元素地址
&a[0][0]+1; 二维数组第一行第二个元素地址

2）b是指针变量，&b是指存放指针的地址！！b是指向数组c的首地址，两者不同。
&c[0] 表示 c 数组的第一个元素的地址。
&c+1表示整个数组之后的地址，c+1表示首元素之后的第二个元素的地址。所以sizeof(&c)是8字节指针，sizeof(c)是5字节数组大小。
&arr代表的是整个一维数组的地址，arr代表的是数组第一个元素的地址，它们在计算时会有很大的差异，比如+1的结果就不一样。
arr 本身是左值，&arr 是右值表达式，为指针类型，指向 arr 本身。
简单来说就是 arr 本身不是地址而是指代整个数组，只不过会隐式转成指针罢了。
arr （转换后）和 &arr 类型不同，数值相等是因为 arr 和 arr[0] 地址相同，这里地址指首地址。

# A[B]是*(A+B)的语法糖，或者简单理解为缩写。因为*(a+3)和*(3+a)效果是一样的，所以a[3]还是3[a]都行。丧心病狂的话还能写 ((5>4)<<2)[-1+a]
7=7（不合法，是赋值运算不是关系运算）
5>4>3（合法5>4--->1; 1>3--->0,所以该运算结果为0）
1<2<3（合法1<2---->1; 1<3--->1,所以该运算结果为1）
1<<2为4； 4[-1+a]为a[3]

```c

```
# 指针的大小是固定的4/8个字节（32位平台/64位平台）
我们都知道cpu是无法直接在硬盘上读取数据的，而是通过内存读取。cpu通过地址总线、数据总线、控制总线三条线对内存中的数据进行传输和操作。

具体流程：

　　1、cpu通过地址总线，找到该条数据；

　　2、通过控制总线得知该操作是读操作还是写操作；

　　3、通过数据总线将该数据读取到cpu或者从cpu写到内存中。

　　所以，

　　地址总线的宽度决定了CPU的寻址能力；
　　数据总线的宽度决定了CPU单次数据传输的传送量，也就是数据传输速度；
　　控制总线决定了CPU对其他控件的控制能力以及控制方式

我们平时所说的计算机是64位、32位、16位，指的是计算机CPU中通用寄存器一次性处理、传输、暂时存储的信息的最大长度。即CPU在单位时间内(同一时间)能一次处理的二进制数的位数。
假如，某计算机的地址总线是64位，那么其一次可以在2^64种可能中寻找一个地址，也就是其描述的地址空间为0x0000 0000 0000 0000 0000 0000 0000 0000 ~ 2^64-1。
我们一般需要64个0或1的组合就可以找到内存中所有的地址，而64个0或1的组合，就是64个位，也就是8个字节的大小，因此，我们只需要8个字节就可以找到所有的数据。所以，在64位的计算机中，指针占8个字节。同理，在32位的计算机中，指针占4个字节。

同时也可以看出，由于地址总线为64，那么每次寻址的空间为0x0000 0000 0000 0000 0000 0000 0000 0000 ~ 2^64-1，那么CPU的最大内存为2^64Byte

其他知识点：

数据存储是以“字节”（Byte）为单位，数据传输大多是以“位”（bit，又名“比特”）为单位，一个位就代表一个0或1（即二进制），每8个位（bit，简写为b）组成一个字节（Byte，简写为B），是最小一级的信息单位。
1bit就是二进制的0和1
1字节(Byte) = 8位(bit)=8比特
1个英文字母（不分大小写）占一个字节的空间
计算机能够处理的最小单元是 字节 而不是位

————————————————
原文链接：https://blog.csdn.net/qq_38325803/article/details/103093623



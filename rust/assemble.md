```c
int square(int num) {
    return num * num;
}

int main() {
    int i = 4;
    int j = square(i);
}
```


```Assembly Language
square(int):
        push    rbp
        mov     rbp, rsp
        mov     DWORD PTR [rbp-4], edi
        mov     eax, DWORD PTR [rbp-4]
        imul    eax, eax
        pop     rbp
        ret
main:
        push    rbp
        mov     rbp, rsp
        sub     rsp, 16
        mov     DWORD PTR [rbp-4], 4
        mov     eax, DWORD PTR [rbp-4]
        mov     edi, eax
        call    square(int)
        mov     DWORD PTR [rbp-8], eax
        mov     eax, 0
        leave
        ret
```
在main里面，4先存到栈上（mov DWORD PTR [rbp-4]，4），然后存在edi里面（mov eax，DWORD PTR [rbp-4]; mov edi，eax;），而square函数直接就从edi里面读取4的值了！


```c
#include <stdio.h>
int main(void)
{
    int a;

    a = 972;
    printf("a = %d\n", a);
    return (0);
}
```
```Assembly Language
000000000040052d <main>:
  40052d:       55                      push   rbp
  40052e:       48 89 e5                mov    rbp,rsp
  400531:       48 83 ec 10             sub    rsp,0x10
  400535:       c7 45 fc cc 03 00 00    mov    DWORD PTR [rbp-0x4],0x3cc
  40053c:       8b 45 fc                mov    eax,DWORD PTR [rbp-0x4]
  40053f:       89 c6                   mov    esi,eax
  400541:       bf e4 05 40 00          mov    edi,0x4005e4
  400546:       b8 00 00 00 00          mov    eax,0x0
  40054b:       e8 c0 fe ff ff          call   400410 <printf@plt>
  400550:       b8 00 00 00 00          mov    eax,0x0
  400555:       c9                      leave  
  400556:       c3                      ret    
  400557:       66 0f 1f 84 00 00 00    nop    WORD PTR [rax+rax*1+0x0]
  40055e:       00 00 
```
函数的第一行main指的是rbp和 rsp; 这些是特殊用途的寄存器。rbp是基指针，指向当前栈帧的基点，rsp是栈指针，指向当前栈帧的顶部
rbp: Register Base Pointer。其作用是标定一个基址，其值在运行过程变化很少
rsp: Register Stack Pointer。其作用是标定栈顶，其值会不断变化。因为虚拟内存中栈的地址是向下生长的，因此入栈操作会使它存储的值看起来不断变小

push rbp 指令将寄存器的值rbp压入堆栈。因为它“推”到堆栈上，所以现在的值rsp是新堆栈顶部的内存地址。
mov rbp, rsp 将堆栈指针的值rsp复制到基指针rbp。现在rsp都指向堆栈的顶部
sub rsp, 0x10创建一个空间来存储局部变量的值。rbp和之间的空间rsp就是这个空间。请注意，这个空间足够大，可以存储我们的类型变量integer
    sub: subtract。 sub rsp, 0x10 相当于C++\Java中的 rsp = rsp - 16;
    还是因为虚拟内存中的stack是向低地址位生长的，因此将栈顶向低地址位滑动
word为16bit，DWORD也就是double word，32bit。这正是现代c++中signed int的长度。而PTR就是pointer，代表地址。
    前面说到mov相当于C++\Java中的赋值，因此这里是一个赋值操作。
末尾处该指令leave分为两步：设置rsp为rbp，然后将栈顶弹出到rbp.
因为我们rbp在进入函数时将之前的值压入堆栈，rbp所以现在设置为之前的值rbp
局部变量被“解除分配”，并且在我们离开当前函数之前恢复前一个函数的堆栈帧。
堆栈和寄存器rbp的rsp状态恢复到与我们进入main函数时相同的状态。


```c
#include <stdio.h>

void func1(void)
{
     int a;
     int b;
     int c;

     a = 98;
     b = 972;
     c = a + b;
     printf("a = %d, b = %d, c = %d\n", a, b, c);
}

void func2(void)
{
     int a;
     int b;
     int c;

     printf("a = %d, b = %d, c = %d\n", a, b, c);
}

int main(void)
{
    func1();
    func2();
    return (0);
}
// a = 98, b = 972, c = 1070
// a = 98, b = 972, c = 1070
```

```Assembly Language
000000000040052d <func1>:
  40052d:       55                      push   rbp
  40052e:       48 89 e5                mov    rbp,rsp
  400531:       48 83 ec 10             sub    rsp,0x10
  400535:       c7 45 f4 62 00 00 00    mov    DWORD PTR [rbp-0xc],0x62
  40053c:       c7 45 f8 cc 03 00 00    mov    DWORD PTR [rbp-0x8],0x3cc
  400543:       8b 45 f8                mov    eax,DWORD PTR [rbp-0x8]
  400546:       8b 55 f4                mov    edx,DWORD PTR [rbp-0xc]
  400549:       01 d0                   add    eax,edx
  40054b:       89 45 fc                mov    DWORD PTR [rbp-0x4],eax
  40054e:       8b 4d fc                mov    ecx,DWORD PTR [rbp-0x4]
  400551:       8b 55 f8                mov    edx,DWORD PTR [rbp-0x8]
  400554:       8b 45 f4                mov    eax,DWORD PTR [rbp-0xc]
  400557:       89 c6                   mov    esi,eax
  400559:       bf 34 06 40 00          mov    edi,0x400634
  40055e:       b8 00 00 00 00          mov    eax,0x0
  400563:       e8 a8 fe ff ff          call   400410 <printf@plt>
  400568:       c9                      leave  
  400569:       c3                      ret    

000000000040056a <func2>:
  40056a:       55                      push   rbp
  40056b:       48 89 e5                mov    rbp,rsp
  40056e:       48 83 ec 10             sub    rsp,0x10
  400572:       8b 4d fc                mov    ecx,DWORD PTR [rbp-0x4]
  400575:       8b 55 f8                mov    edx,DWORD PTR [rbp-0x8]
  400578:       8b 45 f4                mov    eax,DWORD PTR [rbp-0xc]
  40057b:       89 c6                   mov    esi,eax
  40057d:       bf 34 06 40 00          mov    edi,0x400634
  400582:       b8 00 00 00 00          mov    eax,0x0
  400587:       e8 84 fe ff ff          call   400410 <printf@plt>
  40058c:       c9                      leave  
  40058d:       c3                      ret  

000000000040058e <main>:
  40058e:       55                      push   rbp
  40058f:       48 89 e5                mov    rbp,rsp
  400592:       e8 96 ff ff ff          call   40052d <func1>
  400597:       e8 ce ff ff ff          call   40056a <func2>
  40059c:       b8 00 00 00 00          mov    eax,0x0
  4005a1:       5d                      pop    rbp
  4005a2:       c3                      ret    
  4005a3:       66 2e 0f 1f 84 00 00    nop    WORD PTR cs:[rax+rax*1+0x0]
  4005aa:       00 00 00 
  4005ad:       0f 1f 00                nop    DWORD PTR [rax]
```
# 当变量自动从堆栈中释放时，它们并没有完全“销毁”。它们的值仍在内存中，这个空间可能会被其他函数使用
当两个函数以相同的顺序声明了相同数量、相同类型的变量。它们的堆栈帧完全相同。func1结束时，其局部变量值所在的内存不会被清除 - 只会rsp增加。 就会导致func2也能用func1的局部变量。因此，当我们调用func2的堆栈帧时，它与前一个堆栈帧的位置完全相同func1，并且局部变量的func2值与func1我们离开时的局部变量的值相同。
# 注: 一个函数对应一个栈帧
call语句标明了要跳转的指令地址，例如 call 40052d<func1>，但是func1执行结束之后怎么退出调用回到原处？
原来，在调用call语句时，它会把返回地址(或者说当前地址)推入栈顶。
而ret语句调用时，会从堆栈中弹出栈顶的内容，也就是返回地址，从而正确返回到main中


————————————————
原文链接：https://blog.csdn.net/qq_42138454/article/details/123993780
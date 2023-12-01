1 栈的结构
“栈"想必大家都很熟悉了，我们再重复一遍他的几个重要性质和概念。

先进后出。
在内存中表现为从高地址往低地址增长。
栈顶：栈的最上方（低地址区）。
栈底：栈的最下方（高地址区）。

高地址    栈底
  ⬇        ⬇
低地址    栈顶

```c
void fun(int a) {
	int b;
	char s;
	gets(&s);
	if(a == 0x1234){
		puts(&s);
	}
}
```
EIP存储着下一条指令的地址，每执行一条指令，该寄存器变化一次。

EBP存储着当前函数栈底的地址，栈底通常作为基址，我们可以通过栈底地址和偏移相加减来获取变量地址（很重要）。

ESP就是前面说的，始终指向栈顶，只要ESP指向变了，那么当前栈顶就变了。后进先出

从栈的结构中我们可以看到，这个栈中多个临时变量，数字的代表其入栈顺序。其中ESP指向了var3，在栈的顶部，EBP指向了栈的底部。在EBP的后面还有一个EIP,这里其实可以理解为我们的函数返回地址。当return语句执行后，下一条指令的执行地址。那么var1是什么呢？其实这个是函数的参数，
当函数执行之前，函数的参数（a）会首先被push进栈里面，当进入函数之前，当前EIP的值也会被push进栈，进入函数后再将EBP压栈，所以形成了上面的结构，下面是该程序的main函数和fun函数（去掉了变量b）的汇编代码。

```Assembly Language
Dump of assembler code for function fun:
   0x800011b9 <+0>:     push   ebp ;ebp压栈 //在栈顶esp所在位置开辟ebp寄存器对应的空间
=> 0x800011ba <+1>:     mov    ebp,esp ;将当前栈顶当作函数的栈底
   0x800011bc <+3>:     push   ebx
   0x800011bd <+4>:     sub    esp,0x14
   0x800011c0 <+7>:     call   0x800010c0 <__x86.get_pc_thunk.bx>
   0x800011c5 <+12>:    add    ebx,0x2e3b
   0x800011cb <+18>:    sub    esp,0xc
   0x800011ce <+21>:    lea    eax,[ebp-0x9]
   0x800011d1 <+24>:    push   eax
   0x800011d2 <+25>:    call   0x80001040 <gets@plt>
   0x800011d7 <+30>:    add    esp,0x10
   0x800011da <+33>:    cmp    DWORD PTR [ebp+0x8],0x1234
   0x800011e1 <+40>:    jne    0x800011f2 <fun+57>
   0x800011e3 <+42>:    sub    esp,0xc
   0x800011e6 <+45>:    lea    eax,[ebp-0x9]
   0x800011e9 <+48>:    push   eax
   0x800011ea <+49>:    call   0x80001050 <puts@plt>
   0x800011ef <+54>:    add    esp,0x10
   0x800011f2 <+57>:    nop
   0x800011f3 <+58>:    mov    ebx,DWORD PTR [ebp-0x4]
   0x800011f6 <+61>:    leave
   0x800011f7 <+62>:    ret ;跳转到EIP地址
End of assembler dump.
```

```Assembly Language
Dump of assembler code for function main:
   0x800011f8 <+0>:     lea    ecx,[esp+0x4]
   0x800011fc <+4>:     and    esp,0xfffffff0
   0x800011ff <+7>:     push   DWORD PTR [ecx-0x4]
   0x80001202 <+10>:    push   ebp          //在栈顶开辟ebp寄存器对应的空间
   0x80001203 <+11>:    mov    ebp,esp      //将esp的值传入ebp中（即将ebp指针移动到原本esp指向的位置）
   0x80001205 <+13>:    push   ecx
   0x80001206 <+14>:    sub    esp,0x4
   0x80001209 <+17>:    call   0x80001230 <__x86.get_pc_thunk.ax>
   0x8000120e <+22>:    add    eax,0x2df2
   0x80001213 <+27>:    sub    esp,0xc
   0x80001216 <+30>:    push   0x1234 ;参数压栈
   0x8000121b <+35>:    call   0x800011b9 <fun> ;将EIP压栈，并跳转到fun函数
   0x80001220 <+40>:    add    esp,0x10
   0x80001223 <+43>:    mov    eax,0x0
   0x80001228 <+48>:    mov    ecx,DWORD PTR [ebp-0x4]
   0x8000122b <+51>:    leave
   0x8000122c <+52>:    lea    esp,[ecx-0x4]
   0x8000122f <+55>:    ret
```

在main函数没有调用完之前其部分变量仍然是存在栈中的。函数调用前后基本EIP、EBP、ESP基本变化流程如下：

1、调用函数中push ebp,将main函数的ebp压栈，然后mov ebp, esp将当前函数的esp赋给ebp，得到当前函数的栈底地址。

2、调用函数结束之前，执行leave指令，其实该指令等于下面两条指令：
mov esp, ebp
pop ebp

此时fun相关数据全部被出栈，ebp将得重新到main函数的栈底地址，注意在执行ret指令时，将获取栈内EIP数据，然后栈内的EIP也将出栈。程序跳转到函数下方。esp回到函数栈顶部，函数调用结束。


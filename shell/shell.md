root@root k@123

碰到 shell 命令里诸如  if [[ "$STR1" =~ "$STR2" ]]; then
这样的代码在 ubuntu 里执行显示 “[[ : not found” 时，往往是从 linux 移植过来的。

往往 linux 使用的是 sh ，而 ubuntu 使用的是 bash 。
而"[[]]"是bash脚本中的命令，因此在执行时，使用sh命令会报错，将sh替换为bash命令即可。

解决方法：
如果是 shell 文件的话，开头的 “ #!/bin/sh ”  改为 “ #!/bin/bash ” 。
或者改用 bash 来执行特定的 .sh 文件，比如 “ bash test.sh ”
————————————————

标准输入(stdin)	0	< 或 <<
标准输出(stdout)	1	>，>>，1> 或 1>>
标准错误输出(stderr)	2	2> 或 2>>
编写一个测试脚本 test.sh
#!/bin/bash
date         #打印当前时间
while true   #死循环
do
    #每隔2秒打印一次
    sleep 2
    whatthis    #不存在的命令
    echo -e "std output"
done
输出结果如下，可以看到标准输出stdout 和标准错误输出 stderr 同时输出在了控制台上：
[root@zzz]# ./test.sh 
Thu Jun 11 17:45:36 CST 2020
test.sh: line 7: whatthis: command not found
std output

输出重定向，./test.sh > log.txt，其中 > 就等同于 1>。即将标准输出 stdout 重定向到文件 log.txt，标准错误输出 stderr 仍然为屏幕终端。
接下来将标准输出 stdout 和标准错误输出 stderr 都重定向到文件 log.txt：   ./test.sh > log.txt 2>&1
# 每个程序在运行后，都会至少打开三个文件描述符，分别是0：标准输入；1：标准输出；2：标准错误。
# 2>&1表明将文件描述符2（标准错误输出 stderr）的内容重定向到文件描述符1（标准输出 stdout），为什么1前面需要&？当没有&时，1会被认为是一个普通的文件，有&表示重定向的目标不是一个文件，而是一个文件描述符。
用 ps -au | grep test.sh 查到进程号pid，
ls /proc/pid/fd -l 可以看到1，2都指向 log.txt,  /dev/tty1为屏幕

# ./testStderr.sh 2>log.txt 1>&2 和 ./test.sh 1>log.txt 2>&1 还有两种等价写法：
./test.sh  >& log.txt
./test.sh  &> log.txt

# echo 123 1>/dev/null 2>&1  
————————————————

九个字符，每三个字符构成一组。 （rwx）. 它们分别代表了文件所有者（missing），用户组（users） 以及其他所有人具有的权限。其中 - 表示该用户不具备相应的权限。从上面的信息来看，只有文件所有者可以修改（w）missing 文件夹 （例如，添加或删除文件夹中的文件）。为了进入某个文件夹，用户需要具备该文件夹以及其父文件夹的“搜索”权限（以“可执行”：x）权限表示。为了列出它的包含的内容，用户必须对该文件夹具备读权限（r）。对于文件来说，权限的意义也是类似的。

su（super user 或 root 的简写）

tee 覆写文件
which tee

在bash中为变量赋值的语法是foo=bar，访问变量中存储的数值，其语法为 $foo。 需要注意的是，foo = bar （使用空格隔开）是不能正确工作的，因为解释器会调用程序foo 并将 = 和 bar作为参数。 总的来说，在shell脚本中使用空格会起到分割参数的作用，有时候可能会造成混淆，请务必多加检查。

Bash中的字符串通过' 和 "分隔符来定义，但是它们的含义并不相同。以'定义的字符串为原义字符串，其中的变量不会被转义，而 "定义的字符串会将变量值进行替换。


mcd () {
    mkdir -p "$1"
    cd "$1"
}
这里 $1 是脚本的第一个参数。与其他脚本语言不同的是，bash使用了很多特殊的变量来表示参数、错误代码和相关变量。下面是列举来其中一些变量:
$0 - 脚本名
$1 到 $9 - 脚本的参数。 $1 是第一个参数，依此类推。
$@ - 所有参数
$# - 参数个数
$? - 前一个命令的返回值
$$ - 当前脚本的进程识别码
!! - 完整的上一条命令，包括参数。常见应用：当你因为权限不足执行命令失败时，可以使用 sudo !!再尝试一次。
$_ - 上一条命令的最后一个参数。如果你正在使用的是交互式 shell，你可以通过按下 Esc 之后键入 . 来获取这个值。

命令通常使用 STDOUT来返回输出值，使用STDERR 来返回错误及错误码，便于脚本以更加友好的方式报告错误。 返回码或退出状态是脚本/命令之间交流执行状态的方式。返回值0表示正常执行，其他所有非0的返回值都表示有错误发生。

同一行的多个命令可以用 ; 分隔

如果执行 for file in $(ls) ，shell首先将调用ls ，然后遍历得到的这些返回值。还有一个冷门的类似特性是 进程替换（process substitution）， <( CMD ) 会执行 CMD 并将结果输出到一个临时文件中，并将 <( CMD ) 替换成临时文件名。这在我们希望返回值通过文件而不是STDIN传递时很有用。例如， diff <(ls foo) <(ls bar) 会显示文件夹 foo 和 bar 中文件的区别。

# 使用grep 搜索字符串 foobar，如果没有找到，则将其作为注释追加到文件中。
# 感叹号‘!’ must be quoted to prevent history expansion.
#!/bin/bash
echo "Starting program at $(date)" # date会被替换成日期和时间
echo "Running program $0 with $# arguments with pid $$"
for file in "$@"; do
    grep foobar "$file" > /dev/null 2> /dev/null
    # 如果模式没有找到，则grep退出状态为 1
    # 我们将标准输出流和标准错误流重定向到Null，因为我们并不关心这些信息
    if [[ $? -ne 0 ]]; then
        echo "File $file does not have any foobar, adding one"
        echo "# foobar" >> "$file"
    fi
done

convert image.{png,jpg}
# 会展开为
convert image.png image.jpg

cp /path/to/project/{foo,bar,baz}.sh /newpath
# 会展开为
cp /path/to/project/foo.sh /path/to/project/bar.sh /path/to/project/baz.sh /newpath

# 也可以结合通配使用
mv *{.py,.sh} folder
# 会移动所有 *.py 和 *.sh 文件

mkdir foo bar

# 下面命令会创建foo/a, foo/b, ... foo/h, bar/a, bar/b, ... bar/h这些文件
touch {foo,bar}/{a..h}


# 查找所有名称为src的文件夹，不区分大小写，可以使用-iname选项
find . -name src -type d
# 查找所有文件夹路径中包含test的python文件
find . -path '*/test/*.py' -type f
# 查找前一天修改的所有文件
find . -mtime -1
# 查找所有大小在500k至10M的tar.gz文件
find . -size +500k -size -10M -name '*.tar.gz'

# 删除全部扩展名为.tmp 的文件
find . -name '*.tmp' -exec rm {} \;
# 有些命令，例如tar 则需要从参数接受输入。这里我们可以使用xargs 命令，它可以使用标准输入中的内容作为参数。 例如 ls | xargs rm 会删除当前目录中的所有文件。

# 查找全部的 PNG 文件并将其转换为 JPG
find . -name '*.png' -exec convert {} {}.jpg \;

# 递归地查找文件夹中所有的HTML文件，并将它们压缩成zip文件。
find . -type f -name "*.html" | xargs -d '\n'  tar -cvzf html.zip

# 递归的查找文件夹中最近使用的文件, print0变成一行, ls -t按修改时间对文件进行排序
$ find . -type f -mmin -60 -print0 | xargs -0 ls -lt | head -10


一、为什么要用xargs：

linux的命令中很多的命令的设计是先从命令行参数中获取参数，然后从标准输入中读取，xargs命令可以通过管道接受字符串，并将接收到的字符串通过空格分割成许多参数(默认情况下是通过空格分割) 然后将参数传递给其后面的命令，作为后面命令的命令行参数；

二、xargs的一些有用的选项：

1. -d 选项

默认情况下xargs将其标准输入中的内容以空白(包括空格、Tab、回车换行等)分割成多个之后当作命令行参数传递给其后面的命令，并运行之，我们可以使用 -d 命令指定分隔符，例如：
echo '11@22@33' | xargs echo
输出：
11@22@33
默认情况下以空白分割，那么11@22@33这个字符串中没有空白，所以实际上等价于 echo 11@22@33 其中字符串 '11@22@33' 被当作echo命令的一个命令行参数

echo '11@22@33' | xargs -d '@' echo
输出：
11 22 33
指定以@符号分割参数，所以等价于 echo 11 22 33 相当于给echo传递了3个参数，分别是11、22、33

2. -p 选项
使用该选项之后xargs并不会马上执行其后面的命令，而是输出即将要执行的完整的命令(包括命令以及传递给命令的命令行参数)，询问是否执行，输入 y 才继续执行，否则不执行。这种方式可以清楚的看到执行的命令是什么样子，也就是xargs传递给命令的参数是什么，例如：
echo '11@22@33' | xargs -p -d '@'  echo
输出：
echo 11 22 33
 ?...y      ==>这里询问是否执行命令 echo 11 22 33 输入y并回车，则显示执行结果，否则不执行
 11 22 33   ==>执行结果

3. -n 选项
该选项表示将xargs生成的命令行参数，每次传递几个参数给其后面的命令执行，例如如果xargs从标准输入中读入内容，然后以分隔符分割之后生成的命令行参数有10个，使用 -n 3 之后表示一次传递给xargs后面的命令是3个参数，因为一共有10个参数，所以要执行4次，才能将参数用完。例如：

echo '11@22@33@44@55@66@77@88@99@00' | xargs -d '@' -n 3 echo
输出结果：
11 22 33
44 55 66
77 88 99
00
等价于：
echo 11 22 33
echo 44 55 66
echo 77 88 99
echo 00
实际上运行了4次，每次传递3个参数，最后还剩一个，就直接传递一个参数。

4. -E 选项，有的系统的xargs版本可能是-e  eof-str
该选项指定一个字符串，当xargs解析出多个命令行参数的时候，如果搜索到-e指定的命令行参数，则只会将-e指定的命令行参数之前的参数(不包括-e指定的这个参数)传递给xargs后面的命令
echo '11 22 33' | xargs -E '33' echo
输出：
11 22

可以看到正常情况下有3个命令行参数 11、22、33 由于使用了-E '33' 表示在将命令行参数 33 之前的参数传递给执行的命令，33本身不传递。等价于 echo 11 22 这里-E实际上有搜索的作用，表示只取xargs读到的命令行参数前面的某些部分给命令执行。

注意：-E只有在xargs不指定-d的时候有效，如果指定了-d则不起作用，而不管-d指定的是什么字符，空格也不行。

echo '11 22 33' | xargs -d ' ' -E '33' echo  => 输出 11 22 33
echo '11@22@33@44@55@66@77@88@99@00 aa 33 bb' | xargs -E '33' -d '@' -p  echo  => 输出 11 22 33 44 55 66 77 88 99 00 aa 33 bb

## -0 选项表示以 '\0' 为分隔符，一般与find结合使用

find . -name "*.txt"
输出：
./2.txt
./3.txt
./1.txt     => 默认情况下find的输出结果是每条记录后面加上换行，也就是每条记录是一个新行

find . -name "*.txt" -print0
输出：
./2.txt./3.txt./1.txt     => 加上 -print0 参数表示find输出的每条结果后面加上 '\0' 而不是换行

find . -name "*.txt" -print0 | xargs -0 echo
输出：
./2.txt ./3.txt ./1.txt

find . -name "*.txt" -print0 | xargs -d '\0' echo
输出：
./2.txt ./3.txt ./1.txt

xargs的 -0 和 -d '\0' 表示其从标准输入中读取的内容使用 '\0' 来分割，由于 find 的结果是使用 '\0' 分隔的，所以xargs使用 '\0' 将 find的结果分隔之后得到3个参数： ./2.txt ./3.txt ./1.txt  注意中间是有空格的。上面的结果就等价于 echo ./2.txt ./3.txt ./1.txt

实际上使用xargs默认的空白分隔符也是可以的  find . -name "*.txt"  | xargs  echo   因为换行符也是xargs的默认空白符的一种。find命令如果不加-print0其搜索结果的每一条字符串后面实际上是加了换行

5.-I选项（或者-i）: 用于将参数用{}替代：

例如：echo 'test.txt' | xargs -i  cp  {} /root/

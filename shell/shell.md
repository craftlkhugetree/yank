root@root k@123
sudo apt-get update
sudo apt-get install build-essential
sudo apt-get install make
有makefile文件才能用make指令，执行makefile中的cc或者gcc编译。

碰到 shell 命令里诸如 if [["$STR1" =~ "$STR2"]]; then
这样的代码在 ubuntu 里执行显示 “[[ : not found” 时，往往是从 linux 移植过来的。

往往 linux 使用的是 sh ，而 ubuntu 使用的是 bash 。
而"[[]]"是 bash 脚本中的命令，因此在执行时，使用 sh 命令会报错，将 sh 替换为 bash 命令即可。

解决方法：
如果是 shell 文件的话，开头的 “ #!/bin/sh ” 改为 “ #!/bin/bash ” 。
或者改用 bash 来执行特定的 .sh 文件，比如 “ bash test.sh ”
————————————————

标准输入(stdin) 0 < 或 <<
标准输出(stdout) 1 >，>>，1> 或 1>>
标准错误输出(stderr) 2 2> 或 2>>
编写一个测试脚本 test.sh
#!/bin/bash
date #打印当前时间
while true #死循环
do #每隔 2 秒打印一次
sleep 2
whatthis #不存在的命令
echo -e "std output"
done
输出结果如下，可以看到标准输出 stdout 和标准错误输出 stderr 同时输出在了控制台上：
[root@zzz]# ./test.sh
Thu Jun 11 17:45:36 CST 2020
test.sh: line 7: whatthis: command not found
std output

输出重定向，./test.sh > log.txt，其中 > 就等同于 1>。即将标准输出 stdout 重定向到文件 log.txt，标准错误输出 stderr 仍然为屏幕终端。
接下来将标准输出 stdout 和标准错误输出 stderr 都重定向到文件 log.txt： ./test.sh > log.txt 2>&1

# 每个程序在运行后，都会至少打开三个文件描述符，分别是 0：标准输入；1：标准输出；2：标准错误。

# 2>&1 表明将文件描述符 2（标准错误输出 stderr）的内容重定向到文件描述符 1（标准输出 stdout），为什么 1 前面需要&？当没有&时，1 会被认为是一个普通的文件，有&表示重定向的目标不是一个文件，而是一个文件描述符。

用 ps -au | grep test.sh 查到进程号 pid，
ls /proc/pid/fd -l 可以看到 1，2 都指向 log.txt, /dev/tty1 为屏幕

# ./testStderr.sh 2>log.txt 1>&2 和 ./test.sh 1>log.txt 2>&1 还有两种等价写法：

./test.sh >& log.txt
./test.sh &> log.txt

# echo 123 1>/dev/null 2>&1

————————————————

九个字符，每三个字符构成一组。 （rwx）. 它们分别代表了文件所有者（missing），用户组（users） 以及其他所有人具有的权限。其中 - 表示该用户不具备相应的权限。从上面的信息来看，只有文件所有者可以修改（w）missing 文件夹 （例如，添加或删除文件夹中的文件）。为了进入某个文件夹，用户需要具备该文件夹以及其父文件夹的“搜索”权限（以“可执行”：x）权限表示。为了列出它的包含的内容，用户必须对该文件夹具备读权限（r）。对于文件来说，权限的意义也是类似的。

su（super user 或 root 的简写）

tee 覆写文件
which tee

在 bash 中为变量赋值的语法是 foo=bar，访问变量中存储的数值，其语法为 $foo。 需要注意的是，foo = bar （使用空格隔开）是不能正确工作的，因为解释器会调用程序 foo 并将 = 和 bar 作为参数。 总的来说，在 shell 脚本中使用空格会起到分割参数的作用，有时候可能会造成混淆，请务必多加检查。

Bash 中的字符串通过' 和 "分隔符来定义，但是它们的含义并不相同。以'定义的字符串为原义字符串，其中的变量不会被转义，而 "定义的字符串会将变量值进行替换。

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

$$
- 当前脚本的进程识别码
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

ls /etc/[mnrp]*.conf     # 所有.conf结尾，且以m,n,r或p开头的文件或目录：
[!characters]	匹配任意一个不是字符集中的字符

[[:class:]]	匹配任意一个属于指定字符类中的字符
普遍使用的字符类：
[:alnum:]	匹配任意一个字母或数字
[:alpha:]	匹配任意一个字母
[:digit:]	匹配任意一个数字
[:lower:]	匹配任意一个小写字母
[:upper:]	匹配任意一个大写字母

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

1、递归查找（find 命令 是递归遍历文件夹的）
命令：find . -name “*.txt”
2、不递归查找
find . -name “*.txt” -maxdepth 1

find . -type d  -name ".git" | xargs rm -rf &&
find . -type d  -name ".vscode" | xargs rm -rf &&
find . -type d  -name ".idea" | xargs rm -rf &&
find . -type d  -name "node_modules" | xargs rm -rf &&
find . -type d  -name "dist" | xargs rm -rf

sleep 10     // 秒数，  sleep 1h 2m 0.5s
ctrl + Z    // [1]+  Stopped                 sleep 10
jobs
bg          // [1]+ sleep 10 &     // fg 没有&，所以没有转入后台
jobs        // [1]+  Running                 sleep 10 &
pgrep sleep; ps -ef
pkill -f sleep


❯ sleep 10 &
[3] 62850
# wait 只能够等待当前 shell 的子进程
❯ wait 62850; ls
[3]  + 62850 done       sleep 10


# 但是，如果我们在不同的 bash 会话中进行操作，则上述方法就不起作用了。因为 `wait` 只能对子进程起作用。之前我们没有提过的一个特性是，`kill` 命令成功退出时其状态码为 `0` ，其他状态则是非 `0`。`kill -0` 则不会发送信号，但是会在进程不存在时返回一个不为 `0` 的状态码。请编写一个 `bash` 函数 `pidwait` ，它接受一个 `pid` 作为输入参数，然后一直等待直到该进程结束。您需要使用 `sleep` 来避免浪费 `CPU` 性能。

`wait` 程序实现：
```bash
myWait() {
    pid=$1
    while true; do
        kill -0 $pid
        if [[ $? -eq 0 ]]; then
            echo "process exists, wait for 1 seconds..."
            sleep 1
        else
            break
        fi
    done
    echo "process finished!"
    ls
}
```
将程序保存为 `wait.sh` ，程序执行与结果：
```bash
❯ source wait.sh
❯ sleep 10
^Z
[1]  + 63612 suspended  sleep 10
❯ bg
[1]  + 63612 continued  sleep 10
❯ myWait 63612
process exists, wait for 1 seconds...
process exists, wait for 1 seconds...
process exists, wait for 1 seconds...
process exists, wait for 1 seconds...
process exists, wait for 1 seconds...
[1]  + 63612 done       sleep 10
myWait:kill:3: kill 63612 failed: no such process
process finished!
wait.sh
```
# 最常用十个命令，uniq -c 在每行开头添加重复次数
history | awk '{$1="";print substr($0,2)}' | sort | uniq -c | sort -n | tail -n 10
// awk{}内部=是赋值，外部==才是条件，substr字符截取，$0是所有列
history | awk '{$1="";print substr($0,2)}'
history | awk '$1=="200"{print substr($0,2)}'



# source script.sh 和 ./script.sh 有什么区别?
这两种情况 script.sh 都会在bash会话中被读取和执行，不同点在于哪个会话执行这个命令。 对于 source 命令来说，命令是在当前的bash会话中执行的，因此当 source 执行完毕，对当前环境的任何更改（例如更改目录或是定义函数）都会留存在当前会话中。 单独运行 ./script.sh 时，当前的bash会话将启动新的bash会话（实例），并在新实例中运行命令 script.sh。 因此，如果 script.sh 更改目录，新的bash会话（实例）会更改目录，但是一旦退出并将控制权返回给父bash会话，父会话仍然留在先前的位置（不会有目录的更改）。 同样，如果 script.sh 定义了要在终端中访问的函数，需要用 source 命令在当前bash会话中定义这个函数。否则，如果你运行 ./script.sh，只有新的bash会话（进程）才能执行定义的函数，而当前的shell不能。
$$

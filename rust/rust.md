rustup; rustc; cargo new name --bin; cargo build; cargo run # 编译和运行合在一起; cargo check 快速检查不编译
cargo build --release # 这个属于优化编译
cargo run --release # 同上

Rust 的最佳实践包括以下几点：
避免使用unwrap()，而是使用expect()。unwrap()在遇到错误时直接panic，而expect()会打印出错误信息并exit。
利用From、TryFrom等标准特征。这些特征可以帮助我们更方便的进行类型转换和处理错误。
经常运行“cargo check”，它可以检查代码中可能存在的问题。
在编写可工作的代码后进行测试，然后重构。
如果有两个互相包含的选项/结果，先使用flatten()，再使用match或if let。

# config文件内容：
[source.crates-io]
registry = "https://github.com/rust-lang/crates.io-index"
# 替换成你偏好的镜像源
replace-with = 'tuna'
# 清华大学
[source.tuna]
registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"

# error: the 'rustc.exe' binary, normally provided by the 'rustc' component, is not applicable to the 'stable-x86_64-pc-windows-gnu' toolchain
```shell
rustup uninstall stable-x86_64-pc-windows-gnu and then
rustup install stable-x86_64-pc-windows-gnu --force 
```

在 Rust 中，两个冒号（::）被称为“路径运算符”，用于指定命名空间中的项。它通常用于引用模块、结构体、枚举、函数、常量等。

例如，假设有一个名为 std 的标准库模块，其中包含一个名为 fmt 的子模块，可以使用 std::fmt 来引用该子模块。如果要使用该模块中的函数或宏，可以使用 std::fmt::函数名或 std::fmt!()来调用。

以下是一些使用路径运算符的示例：

```rust
#[derive(Debug)] // 不然报错结构体doesn't implement `std::fmt::Debug`
use std::fmt; // 引用std模块中的fmt子模块

fn main() {
    let x = 42;
    // println! 调用了一个 Rust 宏（macro）。如果是调用函数，则应输入 println（没有!）。
    fmt::println!("The answer is {}", x); // 使用fmt子模块中的println!宏打印输出
}
```

在上面的示例中，use std::fmt 语句将 std 模块中的 fmt 子模块引入到当前作用域中。然后，可以使用 fmt::println!()宏打印输出。

请注意，路径运算符也可以用于引用结构体、枚举和常量的成员。例如，假设有一个名为 Point 的结构体，其中包含一个名为 x 的成员，可以使用 Point::x 来引用该成员。

在 Rust 中，#[derive(Debug)]是一个属性（attribute），用于在结构体或枚举上自动生成 Debug trait 的实现。
Debug trait 允许你以格式化的方式打印结构体的值，通常用于调试目的。当你使用{:?}占位符打印一个实现了 Debug trait 的值时，它会自动调用该值的 Debug trait 实现。
通过在结构体或枚举上添加#[derive(Debug)]属性，Rust 编译器会自动生成 Debug trait 的实现，这样你就可以使用{:?}占位符来打印该结构体的值。

```rust
 /////////////////////////////////
    // 5. Memory safety & pointers //
    /////////////////////////////////

    // Owned pointer – only one thing can ‘own’ this pointer at a time
    // This means that when the `Box` leaves its scope, it can be automatically deallocated safely.
    let mut mine: Box<i32> = Box::new(3);
    *mine = 5; // dereference
    // Here, `now_its_mine` takes ownership of `mine`. In other words, `mine` is moved.
    let mut now_its_mine = mine;
    *now_its_mine += 2;

    println!("{}", now_its_mine); // 7
    // println!("{}", mine); // this would not compile because `now_its_mine` now owns the pointer

    // Reference – an immutable pointer that refers to other data
    // When a reference is taken to a value, we say that the value has been ‘borrowed’.
    // While a value is borrowed immutably, it cannot be mutated or moved.
    // A borrow is active until the last use of the borrowing variable.
    let mut var = 4;
    var = 3;
    let ref_var: &i32 = &var;

    println!("{}", var); // Unlike `mine`, `var` can still be used
    println!("{}", *ref_var);
    // var = 5; // this would not compile because `var` is borrowed
    // *ref_var = 6; // this would not either, because `ref_var` is an immutable reference
    ref_var; // no-op, but counts as a use and keeps the borrow active
    var = 2; // ref_var is no longer used after the line above, so the borrow has ended

    // Mutable reference
    // While a value is mutably borrowed, it cannot be accessed at all.
    let mut var2 = 4;
    let ref_var2: &mut i32 = &mut var2;
    *ref_var2 += 2;         // '*' is used to point to the mutably borrowed var2

    println!("{}", *ref_var2); // 6 , // var2 would not compile.
    // ref_var2 is of type &mut i32, so stores a reference to an i32, not the value.
    // var2 = 2; // this would not compile because `var2` is borrowed.
    ref_var2; // no-op, but counts as a use and keeps the borrow active until here
```



在 Rust 中，使用 ..= 运算符可以创建一个范围，该范围包括起始值，并结束于指定值。因此，1..=5 表示从 1 到 5 的范围，包括 1 和 5。 没有等号就没有5。
```rust
fn main() {  
    let num = 10;  
  
    match num {  
        1..=5 if num % 2 == 0 => println!("Even number between 1 and 5"),  
        1..=5 => println!("Odd number between 1 and 5"),  
        _ => println!("Number is greater than 5"),  
    }  

    // 或者用于for循环
    for i in 1..=5 {  
        println!("{}", i);  
    }
}
```

```rust
// 下面这个例子里，第一个 x 在 第二个 x 之后的代码就不存在了
// 每次使用 let，都会对 let 后面的标识符进行一次重新绑定，学名 shadow
    let x = 13;
    let x = x + 3;

 // 下面这个例子，rust 会隐式推断 pair 的类型为  (char, i32)
    let pair = ('a', 17);
    pair.0; // 这个是 'a'
    pair.1; // 这个是 17

    // 显示声明为
    let pair: (char, i32) = ('a', 17);

    // 就好像 TypeScript 里一样，tuple 可以解构
    // 现在, `some_char` 是 'a',  `some_int` 是 17
    let (some_char, some_int) = ('a', 17);

    // 当一个函数返回的值为 tuple 时，特别好用
    let slice = "Per Martin-Löf";
    let middle = 3;
    // left   "Per"
    // right  " Martin-Löf"
    let (left, right) = slice.split_at(middle);

    // 当使用解构时，_ 表示可以去掉不想要的部分
    let (_, right) = slice.split_at(middle);

// 花括号指明一段作用域，名为 blocks
    // blocks 也是表达式，可以赋值给一个变量
    let x = 42;
    // 和这个等价:
    let x = { 42 };
 let x = {
        let y = 1; // 第一个语句
        let z = 2; // 第二个语句
        y + z // 这个是最后，没有加 ; 相当于 return y+z;
    };


 // :: 这个运算符和 . 类似，但是作用域名字空间
    // 例如下面这个例子，std 是标准库的 crate（相当于 库），cmp 是一个 module(相当于源代码文件)
    // min 是一个函数
    let least = std::cmp::min(3, 8); // this is 3

    // use 命令可以把外部的模块或者函数带入到当前的名字空间
    use std::cmp::min;
    let least = min(7, 1); // this is 1

    //当使用 use 时，可以用花括号进行多个名字的导入
    // 下面三种写法是等价的
    // // this works:
    // use std::cmp::min;
    // use std::cmp::max;
    //
    // // this also works:
    // use std::cmp::{min, max};
    //
    // // this also works!
    // use std::{cmp::min, cmp::max};

    // 使用通配符 * 可以把一个模块里所有的符号都导入
    // this brings `min` and `max` in scope, and many other things
    // use std::cmp::*;

    // 类型也是名字空间，type 的方法也可以当成通常函数来调用
    let x = "amos".len(); // 这个是 4
    let x = str::len("amos"); // 这个也是 4
    // str 是一个基础类型，但是很多非基础类型也在全局可以使用
    // `Vec` 是一个普通的 struct,不是一个基础类型
    let v: Vec<i32> = Vec::new();

    // 等价于上面的代码，但是有全部的路径信息 `Vec`
    let v: Vec<i32> = std::vec::Vec::new();

    // 实际上 rust 在启动时，插入了下面的语句
    // use std::prelude::v1::*;
#    // 这句包含了 Vec，String，Option，Result

 // 继承 Debug trait，用来下面进行打印内容
    #[derive(Debug)]
    struct Vec2 {
        x: f64, // 64-位 floating point, aka "double precision"
        y: f64,
    }

    // 实例化这个结构体
    let v1 = Vec2 { x: 1.0, y: 3.0 };
    let v2 = Vec2 { y: 2.0, x: 4.0 };
    // 字段的顺序无所谓，最重要是名字

    // 也可以用另一个结构体的字段，使用展开操作符来初始化结构体，这个和 JavaScript 的 Object 展开类似
    // 这个语法也叫 struct 更新语法，只能在最后一个位置使用，后面不能再加都好
    let v3 = Vec2 { x: 14.0, ..v2 };
    // 注意规则和 JavaScript 的不一样，在 JavaScript 里上面这个例子，v2 的 x 值会 覆盖 x，但是在这个例子里，并不是！
    // 两种打印一个结构体 Debug 类型的
    dbg!(&v3);
    println!("{:?}", &v3);

    let v4 = Vec2 { ..v3 };
    // struct 也可以解构
    let v = Vec2 { x: 3.0, y: 6.0 };
    // `x` 是 3.0, `y` 是 `6.0`
    let Vec2 { x, y } = v;

    // 丢弃了 `v.y`
    let Vec2 { x, .. } = v;


// trait 是一些类型的合集
    trait Signed {
        fn is_strictly_negative(self) -> bool;
    }

    // 你可以实现 （孤儿规则）
    // 可以对外部类型实现自定义的 trait
    // 可以对自定义类型实现外部的 trait
    // 不能对外部的类型实现外部的 trait
    // （如果要实现外部定义的 trait 需要先将其导入作用域。）
    // （外部是指不是由自己，而是由外部定义的，包括标准库。）

    // 下面是一个对自定义的类型实现自定义的 trait 的例子
    impl Signed for Number {
        fn is_strictly_negative(self) -> bool {
            self.value < 0
        }
    }
    let n = Number {
        odd: false,
        value: -44,
    };
    println!("{}", n.is_strictly_negative()); // prints "true"

    // 下面是对外部的类型实现自定义的 trait
    // 如上所说，标准库也是外部的类型
    // 这一点有点像 JavaScript 里往内置对象上面绑方法
    impl Signed for i32 {
        fn is_strictly_negative(self) -> bool {
            self < 0
        }
    }

    let n: i32 = -44;
    // prints "true"
    println!("{}", n.is_strictly_negative());

    // 对自定义的类型实现外部的 trait
    // `Neg` trait 用来重载 `-`, 一元减号操作符
    // impl block 总是针对一个类型，所以在那个 block 里，self 意味着那个类型
    impl std::ops::Neg for Number {
        type Output = Number;

        fn neg(self) -> Number {
            Number {
                value: -self.value,
                odd: self.odd,
            }
        }
    }

    let n = Number {
        odd: true,
        value: 987,
    };
    let m = -n; // 因为我们实现了 `Neg` trait，所以可以对这个结构体使用 - 号操作符
    println!("{}", m.value); // prints "-987"
    

 // 一些 traits 是标记，他们并没有记录要实现的方法
    // 而是要一些事情需要的类型
    // 例如，i32 实现了 Copy triat（简单说，i32 是 Copy）

    // 但是 Number 没有 Copy ，所以下面的代码会报错
    let n = Number {
        odd: true,
        value: 51,
    };
    // let m = n; // `n` is moved into `m`
    // let o = n; // error: use of moved value: `n`
     // 下面的代码也不行
    fn print_number8(n: Number) {
        println!("{} number {}", if n.odd { "odd" } else { "even" }, n.value);
    }
    let n = Number {
        odd: true,
        value: 51,
    };
    // 解开注释看效果
    // print_number8(n); // `n` is moved
    // print_number8(n); // error: use of moved value: `n`

    // 但是如果把入参改为不可变引用，则 ok 了
    fn print_number_i(n: &Number) {
        println!("{} number {}", if n.odd { "odd" } else { "even" }, n.value);
    }
    let n = Number {
        odd: true,
        value: 51,
    };
    print_number_i(&n); // `n` is borrowed for the time of the call
    print_number_i(&n); // `n` is borrowed again

     // 当函数入参签名是可变引用时，入参本身也是可变引用时，也是ok 的
    fn invert(n: &mut Number) {
        n.value = -n.value;
    }
    // this time, `n` is mutable
    let mut n = Number {
        odd: true,
        value: 51,
    };
    print_number_i(&n);
    invert(&mut n); // `n is borrowed mutably - 所有事情都要显式标注
    print_number_i(&n);

       // Trait 方法也可以用 self 作为引用，或者可变引用
    // 下面是一个非常常用的 Clone 的接口实现
    impl std::clone::Clone for Number {
        fn clone(&self) -> Self {
            Self { ..*self }
        }
    }
    
    // Trait 方法也可以用 self 作为引用，或者可变引用
    // 下面是一个非常常用的 Clone 的接口实现
    impl std::clone::Clone for Number {
        fn clone(&self) -> Self {
            Self { ..*self }
        }
    }

    //当调用 trait 方法时，接收者会进行隐式引用
    let n = Number {
        odd: true,
        value: 51,
    };
    // m 是 n 的一个拷贝
    let mut m = n.clone();
    m.value += 100;

    print_number_i(&n);
    print_number_i(&m);

    // 下面两种写法是等价的
    let m = n.clone();

    let m = std::clone::Clone::clone(&n);

    // 标记 Trait 没有方法要实现
    // 但是 Copy 需要实现 Clone trait
    // 这里的 Clone 在上面实现了
    impl std::marker::Copy for Number {}
    let n = Number {
        odd: true,
        value: 51,
    };
    let m = n.clone();
    let o = n.clone();

    let n = Number {
        odd: true,
        value: 51,
    };
    let m = n; // `m`  是 `n` 的 copy
    let o = n; // same. `n` 没有被 move 或者 borrow

```


```rust
// preclude
use std::io;

fn main() {
    println!("Guess the number!");

    println!("Please input your guess.");
/** new 那一行的 :: 语法表明 new 是 String 类型的一个 关联函数（associated function）。关联函数是针对类型实现的，在这个例子中是 String，而不是 String 的某个特定实例。一些语言中把它称为 静态方法（static method）。
 */
    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess) // 追加,需要字符串作为参数,且这个字符串参数应该是可变的
        .expect("Failed to read line");

    println!("You guessed: {guess}");
}
```

在 Rust 中，每一个值都属于某一个 数据类型（data type），这告诉 Rust 它被指定为何种数据，以便明确数据处理方式。我们将看到两类数据类型子集：标量（scalar）和复合（compound）。

记住，Rust 是 静态类型（statically typed）语言，也就是说在编译时就必须知道所有变量的类型。根据值及其使用方式，编译器通常可以推断出我们想要用的类型。当多种类型均有可能时，比如使用 parse 将 String 转换为数字时，必须增加类型注解，像这样：
let guess: u32 = "42".parse().expect("Not a number!");


Rust 有四种基本的标量类型：整型、浮点型、布尔类型和字符类型。
另外，isize 和 usize 类型依赖运行程序的计算机架构：64 位架构上它们是 64 位的，32 位架构上它们是 32 位的。

数字字面值	例子
Decimal (十进制)	98_222
Hex (十六进制)	0x ff
Octal (八进制)	0o 77
Binary (二进制)	0b 1111_0000
Byte (单字节字符)(仅限于u8)	b 'A'


 let y = {
        let x = 3;
        x + 1
    };
# 这是一个代码块，它的值是 4。这个值作为 let 语句的一部分被绑定到 y 上。注意 x+1 这一行在结尾没有分号，表达式的结尾没有分号。如果在表达式的结尾加上分号，它就变成了语句，而语句不会返回值。
Rust 是一门基于表达式（expression-based）的语言，这是一个需要理解的（不同于其他语言）重要区别。其他语言并没有这样的区别，所以让我们看看语句与表达式有什么区别以及这些区别是如何影响函数体的。

语句（Statements）是执行一些操作但不返回值的指令。 表达式（Expressions）计算并产生一个值。

函数可以向调用它的代码返回值。我们并不对返回值命名，但要在箭头（->）后声明它的类型。在 Rust 中，函数的返回值等同于函数体最后一个表达式的值。使用 return 关键字和指定值，可从函数中提前返回；但大部分函数隐式的返回最后的表达式。
fn five() -> i32 {
    5
}
使用 break 关键字返回值 counter * 2; 类似return
 let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

# 所有权（系统）是 Rust 最为与众不同的特性，对语言的其他部分有着深刻含义。它让 Rust 无需垃圾回收（garbage collector）即可保障内存安全，因此理解 Rust 中所有权如何工作是十分重要的。所有权以及相关功能：借用（borrowing）、slice，Rust 如何在内存中布局数据。

栈中的所有数据都必须占用已知且固定的大小。在编译时大小未知或大小可能变化的数据，要改为存储在堆上。 堆是缺乏组织的：当向堆放入数据时，你要请求一定大小的空间。内存分配器（memory allocator）在堆的某处找到一块足够大的空位，把它标记为已使用，并返回一个表示该位置地址的 指针（pointer）。这个过程称作 在堆上分配内存（allocating on the heap），有时简称为 “分配”（allocating）。（将数据推入栈中并不被认为是分配）。因为指向放入堆中数据的指针是已知的并且大小是固定的，你可以将该指针存储在栈上，不过当需要实际数据时，必须访问指针。想象一下去餐馆就座吃饭。当进入时，你说明有几个人，餐馆员工会找到一个够大的空桌子并领你们过去。如果有人来迟了，他们也可以通过询问来找到你们坐在哪。


所有权的规则：
1. Rust 中的每一个值都有一个 所有者（owner）。
2. 值在任一时刻有且只有一个所有者。
3. 当所有者（变量）离开作用域，这个值将被丢弃。

Rust 有一个叫做 Copy trait 的特殊注解，可以用在类似整型这样的存储在栈上的类型上。如果一个类型实现了 Copy trait，那么一个旧的变量在将其赋值给其他变量后仍然可用。
Rust 不允许自身或其任何部分实现了 Drop trait 的类型使用 Copy trait。如果我们对其值离开作用域时需要特殊处理的类型使用 Copy 注解，将会出现一个编译时错误。

作为一个通用的规则，任何一组简单标量值的组合都可以实现 Copy，任何不需要分配内存或某种形式资源的类型都可以实现 Copy 。如下是一些 Copy 的类型：
1. 所有整数类型，比如 u32。
2. 布尔类型，bool，它的值是 true 和 false。
3. 所有浮点数类型，比如 f64。
4. 字符类型，char。
5. 元组，当且仅当其包含的类型也都实现 Copy 的时候。比如，(i32, i32) 实现了 Copy，但 (i32, String) 就没有。

我们将创建一个引用的行为称为 借用（borrowing）。

# 在任意给定时间，要么 只能有一个可变引用，要么 只能有多个不可变引用。引用必须总是有效的。
不能在同一时间多次将 str 作为可变变量借用; 不能在拥有不可变引用的同时拥有可变引用; 多个不可变引用是可以的。

# 悬垂引用（Dangling References）:
在具有指针的语言中，很容易通过释放内存时保留指向它的指针而错误地生成一个 悬垂指针（dangling pointer），所谓悬垂指针是其指向的内存可能已经被分配给其它持有者。
```rust
fn main() {
    let reference_to_nothing = dangle();
}

fn dangle() -> &String {
    let s = String::from("hello");
    &s// 返回字符串 s 的引用
}// 这里 s 离开作用域并被丢弃。其内存被释放。

fn main() {
    let string = no_dangle();
}

fn no_dangle() -> String {
    let s = String::from("hello");
    s // 直接返回 String, 所有权被移动出去，所以没有值被释放
}
```

slice range
```rust
fn main() {
let s = String::from("hello");

let slice = &s[0..2];
let slice = &s[..2];


let len = s.len();
let slice = &s[3..len];
let slice = &s[3..];

let slice = &s[0..len];
let slice = &s[..];
}

```

# 字符串字面值：
let s = "Hello, world!";
这里 s 的类型是 &str：它是一个指向二进制程序特定位置的 slice。这也就是为什么字符串字面值是不可变的；&str 是一个不可变引用。


```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    // 整个实例必须是可变的；Rust 并不允许只将某个字段标记为可变。
    let mut user1 = User {
        active: true,
        username: String::from("someusername123"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };

    user1.email = String::from("anotheremail@example.com");

    let user2 = User {
        email: String::from("another@example.com"),
        ..user1 //  结构体更新语法（struct update syntax）
    };
}

// 字段初始化简写语法（field init shorthand）
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username,
        email,
        sign_in_count: 1,
    }
}
```
请注意，结构更新语法就像带有 = 的赋值，因为它移动了数据，就像我们在“变量与数据交互的方式（一）：移动”部分讲到的一样。在这个例子中，总体上说我们在创建 user2 后不能就再使用 user1 了，因为 user1 的 username 字段中的 String 被移到 user2 中。如果我们给 user2 的 email 和 username 都赋予新的 String 值，从而只使用 user1 的 active 和 sign_in_count 值，那么 user1 在创建 user2 后仍然有效。active 和 sign_in_count 的类型是实现 Copy trait 的类型，所以我们在“变量与数据交互的方式（二）：克隆” 部分讨论的行为同样适用。

println! 宏能处理很多类型的格式，不过，{} 默认告诉 println! 使用被称为 Display 的格式：意在提供给直接终端用户查看的输出。目前为止见过的基本类型都默认实现了 Display，因为它就是向用户展示 1 或其他任何基本类型的唯一方式。不过对于结构体，println! 应该用来输出的格式是不明确的，因为这有更多显示的可能性：是否需要逗号？需要打印出大括号吗？所有字段都应该显示吗？由于这种不确定性，Rust 不会尝试猜测我们的意图，所以结构体并没有提供一个 Display 实现来使用 println! 与 {} 占位符。
所以打印struct，要加上   #[derive(Debug)]
println!("{:?}", user2); // {:#?}带格式

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let scale = 2;
    let rect1 = Rectangle {
        width: dbg!(30 * scale),
        height: 50,
    };

    dbg!(&rect1);
    println!(
        "The area of the rectangle is {} square pixels.",
        area(&rect1)
    );
}

fn area(rectangle: &Rectangle) -> u32 {
    rectangle.width * rectangle.height
}
```
另一种使用 Debug 格式打印数值的方法是使用 dbg! 宏。dbg! 宏接收一个表达式的所有权（与 println! 宏相反，后者接收的是引用），打印出代码中调用 dbg! 宏时所在的文件和行号，以及该表达式的结果值，并返回该值的所有权。
# 注意：调用 dbg! 宏会打印到标准错误控制台流（stderr），与 println! 不同，后者会打印到标准输出控制台流（stdout）。
我们可以把 dbg! 放在表达式 30 * scale 周围，因为 dbg! 返回表达式的值的所有权，所以 width 字段将获得相同的值，就像我们在那里没有 dbg! 调用一样。我们不希望 dbg! 拥有 rect1 的所有权，所以我们在下一次调用 dbg! 时传递一个引用。下面是这个例子的输出结果：
<!-- $ cargo run
   Compiling rectangles v0.1.0 (file:///projects/rectangles)
    Finished dev [unoptimized + debuginfo] target(s) in 0.61s
     Running `target/debug/rectangles`
[src/main.rs:10] 30 * scale = 60
[src/main.rs:14] &rect1 = Rectangle {
    width: 60,
    height: 50,
} -->

与元组类似的结构体，称为 元组结构体（tuple structs）。元组结构体有着结构体名称提供的含义，但没有具体的字段名，只有字段的类型。
```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
```
我们也可以定义一个没有任何字段的结构体！它们被称为 类单元结构体（unit-like structs）因为它们类似于 ()，即“元组类型”一节中提到的 unit 类型。类单元结构体常常在你想要在某个类型上实现 trait 但不需要在类型中存储数据的时候发挥作用。
```rust
struct AlwaysEqual;
fn main() {
    let subject = AlwaysEqual;
}
```
在之前的 User 结构体的定义中，我们使用了自身拥有所有权的 String 类型而不是 &str 字符串 slice 类型。这是一个有意而为之的选择，因为我们想要这个结构体拥有它所有的数据，为此只要整个结构体是有效的话其数据也是有效的。
可以使结构体存储被其他对象拥有的数据的引用，不过这么做的话需要用上 生命周期（lifetimes），这是一个第十章会讨论的 Rust 功能。生命周期确保结构体引用的数据有效性跟结构体本身保持一致。如果你尝试在结构体中存储一个引用而不指定生命周期将是无效的。


```rust
fn main() {
    let rect1 = (30, 50);
    println!(
        "The area of the rectangle is {} square pixels.",
        area(rect1)
    );
    println!("{:?}", rect1);
}

// 元组变量dimensions作为参数，类型为(u32, u32)
fn area(dimensions: (u32, u32)) -> u32 {
    dimensions.0 * dimensions.1
}
```

当使用 object.something() 调用方法时，Rust 会自动为 object 添加 &、&mut 或 * 以便使 object 与方法签名匹配。也就是说，这些代码是等价的：

p1.distance(&p2);
(&p1).distance(&p2);
第一行看起来简洁的多。这种自动引用的行为之所以有效，是因为方法有一个明确的接收者———— self 的类型。在给出接收者和方法名的前提下，Rust 可以明确地计算出方法是仅仅读取（&self），做出修改（&mut self）或者是获取所有权（self）。



所有在 impl 块中定义的函数被称为 关联函数（associated functions），因为它们与 impl 后面命名的类型相关。我们可以定义不以 self 为第一参数的关联函数（因此不是方法），因为它们并不作用于一个结构体的实例。我们已经使用了一个这样的函数：在 String 类型上定义的 String::from 函数。

不是方法的关联函数经常被用作返回一个结构体新实例的构造函数。这些函数的名称通常为 new ，但 new 并不是一个关键字。例如我们可以提供一个叫做 square 关联函数，它接受一个维度参数并且同时作为宽和高，这样可以更轻松的创建一个正方形 Rectangle 而不必指定两次同样的值：
impl Rectangle {
    fn square(size: u32) -> Self {
        Self {
            width: size,
            height: size,
        }
    }
}
关键字 Self 在函数的返回类型中代指在 impl 关键字后出现的类型，在这里是 Rectangle
# 使用结构体名和 :: 语法来调用这个关联函数：比如 let sq = Rectangle::square(3);。这个函数位于结构体的命名空间中：:: 语法用于关联函数和模块创建的命名空间。

```rust
// 结构体定义和调用方法：
impl Rectangle {
    fn width(&self) -> bool {
        self.width > 0
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
    if rect1.width() {
        println!("The rectangle has a nonzero width; it is {}", rect1.width);
    }
}
```


```rust
enum Message {
    // 定义了空结构体，并且是空的普通结构体
    // 如果将 {} 换成 ()，那么就是空的元组结构体
    Quit {},
    // 普通结构体
    Move { x: i32, y: i32 },
    // 元组结构体
    Write(String),
    // 元组结构体
    ChangeColor(i32, i32, i32),
}  // 枚举里面嵌入结构体的时候需要省略 struct

fn main() {
    // x、y、z、w 都是 Message 类型
    let x = Message::Quit {};
    let y = Message::Move {x: 8, y:4};
    let z = Message::Write(String::from("hello"));
    let w = Message::ChangeColor(255, 11, 184);
}
```
和单独定义结构体不同，如果我们使用了不同的结构体，那么每个结构体都会拥有自己的类型，我们无法轻易定义一个能够统一处理这些类型数据的函数。而我们上面定义的 Message 枚举则不同，因为它是单独的一个类型，也就是说变量 x, y, z, w 都是 Message 类型。

Rust 中虽然没有空值，但却提供了一个拥有类似概念的枚举，我们可以用它来标识一个值无效或缺失。这个枚举就是 Option<T>，它在标准库中被定义为如下所示的样子：
enum Option<T> {
    Some(T),
    None,
}

# 总结：当我们有了一个 Some 值时，我们就可以确定值是存在的；而当我们有了一个 None 值时，我们就知道当前并不存在一个有效的值，但它们都是 Option<T> 类型。那么问题来了，这看上去与空值没有什么差别，那为什么 Option<T> 的设计就比空值好呢？

简单来讲，因为 Option<T> 和 T（这里的 T 可以是任意类型）是不同的类型，所以编译器不会允许我们像使用普通值一样去使用 Option<T>。例如下面的代码在尝试将 i8 与 Option<i8> 相加时无法通过编译：
```rust
fn main() {
    let x: i8 = 5;
    let y: Option<i8> = Some(5);
    let sum = x + y;
}
```
运行这段代码会编译错误，提示信息：no implementation for i8 + Option<i8>。这段错误提示信息指出了 Rust 无法理解 i8 和 Option<T> 相加的行为，因为它们拥有不同的类型。

如果我们在 Rust 中拥有一个 i8 类型的值，编译器是能够确保我们所持有的值是有效的，可以充满信心地去使用它而无须在使用前进行空值检查。而只有当我们持有的类型是 Option<i8> 时，我们才必须要考虑值不存在的情况，同时编译器会迫使我们在使用值之前正确地做出处理操作。

也就是说 Some(5) 虽然是有值的，但它的类型是 Option<T>，而该类型还包含了 None，如果为 None 则是无法相加的，所以 Rust 会迫使我们进行处理。换句话说，为了使用 Option<T> 中可能存在的 T，我们必须要将它转换为 T。一般而言，这能帮助我们避免使用空值时最常见的一个问题：假设某个值存在，实际上却为空。

其实说白了，Rust 就是将空值和数据类型结合起来了。比如类型 T，如果该类型的值允许为空，那么就变成 Option。那么当值不为空时就用 Some(值)、为空时就用 None，并且都是 Option 类型。

不过当我们持有了一个 Option<T> 类型的 Some 值时，应该怎样将其中的 T 值取出来使用呢？

match 表达式就是这么一个可以用来处理枚举的控制流结构：它允许我们基于枚举拥有的成员来决定运行的代码分支，并允许代码通过匹配值来获取成员内的数据。
```rust
enum Operator {
    LT,
    LE,
    EQ,
    NE,
    GT,
    GE,
}

fn value_in_operator(op: Operator) -> u32 {
    match op {
        Operator::LT => 0,
        Operator::LE => 1,
        Operator::EQ => 2,
        Operator::NE => 3,
        Operator::GT => 4,
        Operator::GE => 5,
    }
}

fn main() {
    println!("{}", value_in_operator(Operator::EQ));  // 2 
    println!("{}", value_in_operator(Operator::GT));  // 4
}
```
巨大的区别：在 if 语句中，表达式需要返回一个布尔值，而match的表达式则可以返回任何类型，例子中 op 的类型正是我们在首行定义的 Operator 枚举。。
match 的分支：一个分支由模式和它所关联的代码组成。第一个分支采用了值 Operator::LT 作为模式，并紧跟着一个 => 运算符用于将模式和代码区分开来，不同分支之间使用了逗号分隔。
然后我们就可以处理之前的 Option<T> 了，做法也很简单：

```rust
fn get_number(x: Option<i32>) -> Option<i32> {
    match x {
        // 如果是 Some(值)，那么就会走这个分支，并且值也会传递给这里的 i
        // 可能有人好奇，Some(i) + Some(30) 是否可以
        // 答案是不行，因为两个 Option<i32> 之间不可以相加
        Some(i) => {
            if i > 100 {
                Some(i + 30)
            } else if i > 0 {
                Some(i * 2)
            } else {
                Some(0)
            }
        }
        // None 的话则还是返回 None
        None => None,
    } // 此处不可以加分号，因为 match 整体要作为表达式返回
}

fn main() {
    let x = Some(150);
    let y = Some(80);
    let z: Option<i32> = None;
    println!("{:?}", get_number(x)); // Some(180)
    println!("{:?}", get_number(y)); // Some(160)
    println!("{:?}", get_number(z)); // None
}
```
if let x = 666 和 if x == 666 作用是相似的，并且都可以搭配 else 语句。如果你在编写程序的过程中，觉得在某些情形下使用 match 会过分烦琐，要记得在 Rust 工具箱中还有 if let 的存在。
```rust
    let config_max = Some(3u8);
    match config_max {
        Some(max) => println!("The maximum is configured to be {}", max),
        _ => (),
    }

    if let Some(max) = config_max {
        println!("The maximum is configured to be {}", max);
    }
```

```rust
#[derive(Debug)] // 这样可以立刻看到州的名称
enum UsState {
    Alabama,
    Alaska,
    // --snip--
}
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}
fn main() {
    let mut count = 0;
    let coin = Coin::Quarter(UsState::Alaska);
    match coin {
        Coin::Quarter(state) => println!("State quarter from {:?}!", state),
        _ => count += 1,
    }
}
```

crate 是 Rust 在编译时最小的代码单位。如果你用 rustc 而不是 cargo 来编译一个文件，编译器还是会将那个文件认作一个 crate。crate 可以包含模块，模块可以定义在其他文件，然后和 crate 一起编译。
crate 有两种形式：二进制项和库。
1. 二进制项 可以被编译为可执行程序，比如一个命令行程序或者一个服务器。它们必须有一个 main 函数来定义当程序被执行的时候所需要做的事情。
2. 库 并没有 main 函数，它们也不会编译为可执行程序，它们提供一些诸如函数之类的东西，使其他项目也能使用这些东西。比如 rand crate 就提供了生成随机数的东西。大多数时间 Rustaceans 说的 crate 指的都是库，这与其他编程语言中 library 概念一致。

1. crate root 是一个源文件，Rust 编译器以它为起始点，并构成你的 crate 的根模块。
2. 包（package）是提供一系列功能的一个或者多个 crate。一个包会包含一个 Cargo.toml 文件，阐述如何去构建这些 crate。
3. 包中必须至少包含一个 crate（无论是库的还是二进制的），可以包含至多一个库 crate(library crate)；可以包含任意多个二进制 crate(binary crate)。
4. Cargo 遵循的一个约定：src/main.rs 就是一个与包同名的二进制 crate 的 crate 根。同样的，Cargo 知道如果包目录中包含 src/lib.rs，则包带有与其同名的库 crate，且 src/lib.rs 是 crate 根。crate 根文件将由 Cargo 传递给 rustc 来实际构建库或者二进制项目。

cargo new my-project
在此，我们有了一个只包含 src/main.rs 的包，意味着它只含有一个名为 my-project 的二进制 crate。如果一个包同时含有 src/main.rs 和 src/lib.rs，则它有两个 crate：一个二进制的和一个库的，且名字都与包相同。通过将文件放在 src/bin 目录下，一个包可以拥有多个二进制 crate：每个 src/bin 下的文件都会被编译成一个独立的二进制 crate。


从 crate 根节点开始: 当编译一个 crate, 编译器首先在 crate 根文件（通常，对于一个库 crate 而言是src/lib.rs，对于一个二进制 crate 而言是src/main.rs）中寻找需要被编译的代码。
1. 声明模块: 在 crate 根文件中，你可以声明一个新模块；比如，你用mod garden声明了一个叫做garden的模块。编译器会在下列路径中寻找模块代码：
内联，在大括号中，当mod garden后方不是一个分号而是一个大括号
在文件 src/garden.rs
在文件 src/garden/mod.rs
2. 声明子模块: 在除了 crate 根节点以外的其他文件中，你可以定义子模块。比如，你可能在src/garden.rs中定义了mod vegetables;。编译器会在以父模块命名的目录中寻找子模块代码：
内联，在大括号中，当mod vegetables后方不是一个分号而是一个大括号
在文件 src/garden/vegetables.rs
在文件 src/garden/vegetables/mod.rs
3. 模块中的代码路径: 一旦一个模块是你 crate 的一部分，你可以在隐私规则允许的前提下，从同一个 crate 内的任意地方，通过代码路径引用该模块的代码。举例而言，一个 garden vegetables 模块下的Asparagus类型可以在crate::garden::vegetables::Asparagus被找到。
4. 私有 vs 公用: 一个模块里的代码默认对其父模块私有。为了使一个模块公用，应当在声明时使用pub mod替代mod。为了使一个公用模块内部的成员公用，应当在声明前使用pub。
5. use 关键字: 在一个作用域内，use关键字创建了一个成员的快捷方式，用来减少长路径的重复。在任何可以引用crate::garden::vegetables::Asparagus的作用域，你可以通过 use crate::garden::vegetables::Asparagus;创建一个快捷方式，然后你就可以在作用域中只写Asparagus来使用该类型。
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

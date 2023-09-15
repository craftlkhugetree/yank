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

```shell
rustup toolchain install stable-x86_64-pc-windows-gnu
rustup default stable-x86_64-pc-windows-gnu
```

在 Rust 中，两个冒号（::）被称为“路径运算符”，用于指定命名空间中的项。它通常用于引用模块、结构体、枚举、函数、常量等。

例如，假设有一个名为 std 的标准库模块，其中包含一个名为 fmt 的子模块，可以使用 std::fmt 来引用该子模块。如果要使用该模块中的函数或宏，可以使用 std::fmt::函数名或 std::fmt!()来调用。

以下是一些使用路径运算符的示例：

```rust
#[derive(Debug)] // 不然报错结构体doesn't implement `std::fmt::Debug`
use std::fmt; // 引用std模块中的fmt子模块

fn main() {
    let x = 42;
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

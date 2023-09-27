```rust
let foo = &String::new();
foo; // 可以编译：
let bar = String::new().as_bytes();
bar; // 无法编译：
// 明明都是创建了一个值，返回它的引用，为什么一个可以一个不行？ 

// static promotion【静态提升】
fn foo() -> &'static [u8] {
    &[1, 2, 3]
}
/* 明明我在函数内部创建了一个数组，出函数即释放，怎么可能返回它的引用？不仅如此：'static生命周期比 Rust 程序中的所有其他生命周期都要长，甚至会长过 main 函数。然后就会出现“main 函数已经结束，但值依然被借用”的编译错误。*/

/* 
能编译通过的例子中有两个value，一个是String，一个是&String，后者是个ordinary pointer，后者被赋值给了一个变量，前者没有赋值给任何变量，因为前者一直被后者指向，所以在后者的生存期内前者一直存活，所以前者在当前语句结束后、在当前语句块结束前一直存活。

再看不能编译通过的例子，也有两个value，一个是String，一个是&[u8]。后者是个two-word pointer，指向前者管理的堆内存地址而不是指向前者本身。所以前者既没有被赋给一个变量（绑定一个alias）也没有被其他指针指向，所以rust认为它的生存期该结束了，决定销毁这个value，同时决定free掉这个value所管理的堆数组，这样一来第二个value 就变成 dangling pointer了。所以编译无法通过。

返回&'static [u8]这个就更好理解了，因为那数组字面量的内容和长度已经在编译时刻就确定了，指定了’static，编译完成的时候这个数组是放在静态数据区的，而不是运行时刻在栈上构造的。返回一个指向静态数据区的指针当然没问题。
*/
```

```rust
enum OptionalInt {
    Value(i32),
    Missing,
}

let x = OptionalInt::Value(5);

match x {
    // 这里是 match 的 if guard 表达式，我们将在以后的章节进行详细介绍
    OptionalInt::Value(i) if i > 5 => println!("Got an int bigger than five!"),
    OptionalInt::Value(..) => println!("Got an int!"),
    OptionalInt::Missing => println!("No such luck."),
}
```
<!-- error: expected item, found keyword `let`;  在函数外面声明let变量，会报错。改成在函数里即可 -->
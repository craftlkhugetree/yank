// preclude
use std::io;
// Rng 是一个 trait，它定义了随机数生成器应实现的方法，想使用这些方法的话，此 trait 必须在作用域中。
use rand::Rng;
use std::cmp::Ordering;

// 运行 cargo doc --open 命令来构建所有本地依赖提供的文档，并在浏览器中打开。
fn main() {
    println!("Guess the number!");
    let secret_number = rand::thread_rng().gen_range(1..=100);
    println!("The secret number is: {secret_number}");
    loop {
        println!("Please input your guess.");
        /* new 那一行的 :: 语法表明 new 是 String 类型的一个 关联函数（associated function）。
           关联函数是针对类型实现的，在这个例子中是 String，而不是 String 的某个特定实例。一些语言中把它称为 静态方法（static method）。
        */
        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess) // 追加,需要字符串作为参数,且这个字符串参数应该是可变的
            .expect("Failed to read line");

        // Shadowing the previous guess
        // let guess: u32 = guess.trim().parse().expect("Please type a number!");
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            // _ 是特殊的变量，表示“忽略这个变量绑定，后面不会再用到了”
            Err(_) => {
                // println!("Err: {}", _x);
                continue;
            }
        };

        println!("You guessed: {guess}");

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}

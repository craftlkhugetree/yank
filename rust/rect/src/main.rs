// #[derive(Debug)]
// struct Rectangle {
//     width: u32,
//     height: u32,
// }

// fn main() {
//     let rect1 = Rectangle {
//         width: 30,
//         height: 50,
//     };

//     println!("rect1 is {:?}", rect1);
// }
fn main() {
    let rect1 = (30, 50);
    println!(
        "The area of the rectangle is {} square pixels.",
        area(rect1)
    );
    let r2 = rect1;
    let a = 1;
    let b = 1;
    println!("{:?}, {}", rect1,b);
    println!("{:?}, {}", rect1,a);
}

// 元组变量dimensions
fn area(dimensions: (u32, u32)) -> u32 {
    dimensions.0 * dimensions.1
}
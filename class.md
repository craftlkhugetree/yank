在 ES6 之前，javascript 都不支持类的概念，开发者都是通过原型实现类似类的结构。

ES5 中，我们通过在继承的函数中调用 call()或者 apply()方法实现继承。其中分别为构造函数来继承属性，原型对象来继承方法，这种继承模式被称为 组合继承

例子 1:

```javascript
function SuperType(name) {
  this.name = name;
  this.color = ['red', 'blue'];
}
SuperType.prototype.sayName = function () {
  console.log('sayName:',this.name);
};
function SubType(name, age) {
  //声明子构造函数，但是想继承父类的name属性的赋值操作
  SuperType.call(this, name);
  this.age = age;
}
// 错误的继承就是直接将父亲的原型对象赋值给子的原型对象，这样确实也可行，但是如果给子原型对象添加子类特有的方法，那父原型对象也会加上这个方法
// Son.prototype=Father.prototype;
// 正确的做法是让其子原型对象对象等于父实例化对象  Son.prototype=new Father(); 有种高内聚低耦合的韵味，减少了直接联系从而解决问题
// Son.prototype = new Father();  Son.prototype.__proto__ === Father.prototype 所以从Son.prototype能找到Father.prototype上的方法，但是Father的实例对象var f = new Father()无法逆过来找子类Son.prototype上增加的方法。   var son = new Son(); son.__proto__ === Son.prototype
SubType.prototype = new SuperType();
console.log(SubType.prototype.constructor, SubType.prototype.constructor === SubType) // false
// 无论如何赋值，原型对象都会被覆盖，里面的构造函数 constructor 会被SuperType覆盖掉，需要我们手动返回，所以千万要记得手动返回 constructor
SubType.prototype.constructor = SubType;
var s1 = new SubType('ren');
s1.sayName();
console.log(s1, s1.color);
```

ES6 中我们可以通过类，我们使用 extends 实现基类(SuperType)与派生类(SubType)之间的继承。在派生类的 constructor 中调用 super()即可访问基类的构造函数。super()负责初始化 this，相当于 ES5 中的 call 和 apply 方法。

```javascript
class SuperType {
  constructor(name) {
    this.name = name;
    this.color = ['red', 'blue'];
  }
  sayName() {
    alert(this.name);
  }
}
class SubType extends SuperType {
  constructor(name, age) {
    // 相当于SuperType.call(this, name);
    super(name);
    this.age = age;
  }
}
var s1 = new SubType('ren', 19);
s1.sayName();
console.log(s1.color); //  ["red", "blue"]
```

- 只可在派生类的构造函数中使用 super()
- 在构造函数中访问 this 之前一定要调用 super(),它负责初始化 this。

# this.super(): Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor

```javascript
// bad: 出现多个条件分支。如果要加一个腾讯地图，就又要改动renderMap函数。
function renderMap(type) {
  const size = getSize();
  if (type === 'google') {
    googleMap.show(size);
  } else if (type === 'baidu') {
    baiduMap.render(size);
  }
}
renderMap('google');
// good：实现多态处理。如果要加一个腾讯地图，不需要改动renderMap函数。
// 细节：函数作为一等对象的语言中，作为参数传递也会返回不同的执行结果，也是“多态性”的体现。
function renderMap(renderMapFromApi) {
  const size = getSize();
  renderMapFromApi(size);
}
renderMap(size => googleMap.show(size));

// 类 solid

// 单一职责原则 (SRP) - 保证“每次改动只有一个修改理由”。因为如果一个类中有太多功能并且您修改了其中的一部分，则很难预期改动对其他功能的影响。拆！
// 开闭原则 (OCP) - 对扩展放开，但是对修改关闭。在不更改现有代码的情况下添加新功能。比如一个方法因为有switch的语句，每次出现新增条件时就要修改原来的方法。这时候不如换成多态的特性。

//  里氏替换原则 (LSP)
// 两个定义
// 如果S是T的子类，则T的对象可以替换为S的对象，而不会破坏程序。
// 所有引用其父类对象方法的地方，都可以透明的替换为其子类对象。
// 也就是，保证任何父类对象出现的地方，用其子类的对象来替换，不会出错。下面的例子是经典的正方形、长方形例子。
// bad: 用正方形继承了长方形
class Rectangle {
  constructor() {
    this.width = 0;
    this.height = 0;
  }

  setColor(color) {
    // ...
  }

  render(area) {
    // ...
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(width) {
    this.width = width;
    this.height = width;
  }

  setHeight(height) {
    this.width = height;
    this.height = height;
  }
}

function renderLargeRectangles(rectangles) {
  rectangles.forEach(rectangle => {
    rectangle.setWidth(4);
    rectangle.setHeight(5);
    const area = rectangle.getArea(); // BAD: 返回了25，其实应该是20
    rectangle.render(area);
  });
}

// 无法统一setWidth,setHight,即便constructor中传入参数也不行，正方形必须有自己的设置方法，那么显然正方形无法继承长方形
// 正方形的行为：设置正方形的长度的时候，宽度随之改变；设置宽度的时候，长度随之改变。所以，如果我们把这种行为加到基类长方形的时候，就导致了正方形无法继承这种行为。我们“强行”把正方形从长方形继承过来，就造成无法达到预期的结果。鸵鸟非鸟，能飞是鸟的特性，但鸵鸟是不能飞的，我们强行将其归为鸟类，最终导致代码出错。

// 所有子类的行为功能必须和其父类持一致，如果子类达不到这一点，那么必然违反里氏替换原则。

const rectangles = [new Rectangle(), new Rectangle(), new Square()]; // 这里替换了
renderLargeRectangles(rectangles);

// good: 取消正方形和长方形继承关系，都继承Shape
class Shape {
  setColor(color) {
    // ...
  }

  render(area) {
    // ...
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Shape {
  constructor(length) {
    super();
    this.length = length;
  }

  getArea() {
    return this.length * this.length;
  }
}

function renderLargeShapes(shapes) {
  shapes.forEach(shape => {
    const area = shape.getArea();
    shape.render(area);
  });
}

const shapes = [new Rectangle(4, 5), new Rectangle(4, 5), new Square(5)];
renderLargeShapes(shapes);
```

<!-- 接口隔离原则 (ISP) - 定义是"客户不应被迫使用对其而言无用的方法或功能"。常见的就是让一些参数变成可选的。 -->

```javascript
// bad
class Dog {
  constructor(options) {
    this.options = options;
  }

  run() {
    this.options.run(); // 必须传入 run 方法，不然报错
  }
}

const dog = new Dog({}); // Uncaught TypeError: this.options.run is not a function

dog.run();

// good
class Dog {
  constructor(options) {
    this.options = options;
  }

  run() {
    if (this.options.run) {
      this.options.run();
      return;
    }
    console.log('跑步');
  }
}
```

<!-- 依赖倒置原则（DIP） - 程序要依赖于抽象接口(可以理解为入参)，不要依赖于具体实现。这样可以减少耦合度。 -->

```javascript
// bad
class OldReporter {
  report(info) {
    // ...
  }
}

class Message {
  constructor(options) {
    // ...
    // BAD: 这里依赖了一个实例，那你以后要换一个，就麻烦了
    this.reporter = new OldReporter();
  }

  share() {
    this.reporter.report('start share');
    // ...
  }
}

// good
class Message {
  constructor(options) {
    // reporter 作为选项，可以随意换了
    this.reporter = this.options.reporter;
  }

  share() {
    this.reporter.report('start share');
    // ...
  }
}
class NewReporter {
  report(info) {
    // ...
  }
}
new Message({ reporter: new NewReporter() });
```

“接口组合优先于类继承”。那继承到底会暴露什么问题呢？为什么更推荐优先使用组合呢？

继承带来的问题
老实讲，项目中为什么大量使用继承，估计初版设计的人是想实现代码的复用，但是的确带来不少的问题。

继承是面向对象重要特性之一，语义上是表达 is-a 的关系，但是它会破坏封装性。我们举个例子：

假设我们要设计一个关于鸟的类。我们将“鸟类”这样一个抽象的事物概念，定义为一个抽象类 AbstractBird，默认有 eat 吃东西的行为。所有更细分的鸟，比如麻雀、鸽子、鸵鸟等，都继承这个抽象类。

```java
public class AbstractBird {
 	//... 省略其他属性和方法...
 	public void eat() { //... }
}

// 鸵鸟
public class Ostrich extends AbstractBird {

}
```

但是，这时候搞不清楚情况的人根据需求给 AbstractBird 添加一个 fly()的行为。但是对于鸵鸟这个子类来说，并不会飞，你如果不做任何处理，相当于让鸵鸟有了飞翔的功能，不符合设计。聪明的你想到了，那就重写以下吧，抛出一个异常，如下所示：

```java
public class AbstractBird {
 	//... 省略其他属性和方法...
 	public void eat() { //... }

    public void fly() { //... }
}

// 鸵鸟
public class Ostrich extends AbstractBird {
 //... 省略其他属性和方法...
 public void fly() {
     throw new UnSupportedMethodException("I can't fly.'");
 }
}
```

这种设计思路虽然可以解决问题，但不够优美。因为除了鸵鸟之外，不会飞的鸟还有很多，比如企鹅。对于这些不会飞的鸟来说，我们都需要重写 fly() 方法，抛出异常。而且真正好的设计，对于鸵鸟和企鹅来说，就不应该暴露给他们 fly()这种不该暴露的接口，增加外部调用的负担。

这里只提到了 fly(),如果还有下蛋 egg()、唱歌 sing()这么多行为，总不能都冗杂在父类里吧。关键像我们的项目同事，基本上把所有的类都写到了父类中，真的特别难以维护。

小结一下继承带来的问题：

子类继承了父类所有的行为，会让子类无意的暴露的不必要的接口，破坏封装性。
如果继承层级比较多，那么代码的复杂度、可阅读型就可想而知的难了。
另外一个点，就是非常不好做单元测试。
针对于这种问题，组合能怎么解决呢？

组合的好处
组合，顾名思意，就是把另外一个对象做成当前这个对象的一部分，是组成我的一部分，它也能很好的实现代码的复用，语义上表达的是 has-a 的意思，我有 xxx 的能力，我有 xxx 的功能。

那我们看看针对上面的例子，用组合的方式该如何实现呢？

定义接口

```java
public interface Eatable {
    void eat()；
}
public interface Flyable {
    void fly()；
}
public class EatAbility implements Eatable {
    @Override
    public void eat() {
        System.out.println("I can eat");
    }
}  // 省

public class FlyAbility implements Flyable {
    @Override
    public void fly() {
        System.out.println("I can fly");
    }
}  // 省
```

组合鸵鸟类

```java
public class Ostrich implements Eatable {// 鸵鸟
 	private Eatable eatable = new EatAbility(); // 组合
 	//... 省略其他属性和方法...
	@Override
    public void eat() {
        eatable.eat(); // 委托
	}
}
```

你看对于鸵鸟这个子类来说，只暴露了它有的能力，那就是 eat，没有暴露 fly 的接口。

从理论上讲，通过组合、接口、委托三个技术手段，我们完全可以替换掉继承，在项目中不用或者少用继承关系，特别是一些复杂的继承关系。
————————————————
原文链接：https://blog.csdn.net/m0_73311735/article/details/128434034

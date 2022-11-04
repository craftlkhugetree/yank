在Node中引入模块，需要经历如下3个步骤。
(1) 路径分析
(2) 文件定位
(3) 编译执行

在Node中，模块分为两类：一类是Node提供的模块，称为核心模块；另一类是用户编写的模块，称为文件模块。
以.、..和/开始的标识符，这里都被当做文件模块来处理。
自定义模块指的是非核心模块，也不是路径形式的标识符。它是一种特殊的文件模块，可能是一个文件或者包的形式。这类模块的查找是最费时的，也是所有方式中最慢的一种。
# module.paths沿路径向上逐级递归找node_modules目录，直到根目录下的node_modules目录。当前文件的路径越深，模块查找耗时会越多，这是自定义模块的加载速度是最慢的原因。

核心模块的优先级仅次于缓存加载，它在Node的源代码编译过程中已经编译为二进制代码，其加载过程最快。

不论是核心模块还是文件模块，require()方法对相同模块的二次加载都一律采用缓存优先的方式，这是第一优先级的。不同之处在于核心模块的缓存检查先于文件模块的缓存检查。


 文件扩展名分析
require ()在分析标识符的过程中，会出现标识符中不包含文件扩展名的情况。CommonJS模块规范也允许在标识符中不包含文件扩展名，这种情况下，Node会按.js、.json、.node的次序补足扩展名，依次尝试。
在尝试的过程中，需要调用fs模块同步阻塞式地判断文件是否存在。因为Node是单线程的，所以这里是一个会引起性能问题的地方。小诀窍是：如果是.node和.json文件，在传递给require()的标识符中带上扩展名，会加快一点速度。另一个诀窍是：同步配合缓存，可以大幅度缓解Node单线程中阻塞式调用的缺陷。

事实上，在编译的过程中，Node对获取的JavaScript文件内容进行了头尾包装。在头部添加了
(function (exports, require, module, __filename, __dirname) {\n，在尾部添加了\n});。
一个正常的JavaScript文件会被包装成如下的样子：
(function (exports, require, module, __filename, __dirname) {
  var math = require('math');
  exports.area = function (radius) {
    return Math.PI * radius * radius;
  };
});
这样每个模块文件之间都进行了作用域隔离。

那些由纯C/C++编写的部分统一称为内建模块，因为它们通常不被用户直接调用。Node的buffer、crypto、evals、fs、os等模块都是部分通过C/C++编写的。
内建模块的优势在于：首先，它们本身由C/C++编写，性能上优于脚本语言；其次，在进行文件编译时，它们被编译进二进制文件。一旦Node开始执行，它们被直接加载进内存中，无须再次做标识符定位、文件定位、编译等过程，直接就可执行。

单线程同步编程模型会因阻塞I/O导致硬件资源得不到更优的使用。多线程编程模型也因为编程中的死锁、状态同步等问题让开发人员头疼。
Node在两者之间给出了它的方案：利用单线程，远离多线程死锁、状态同步等问题；利用异步I/O，让单线程远离阻塞，以更好地使用CPU。

异步I/O的提出是期望I/O的调用不再阻塞后续运算，将原有等待I/O完成的这段时间分配给其余需要的业务去执行。

请求对象是异步I/O过程中的重要中间产物，所有的状态都保存在这个对象中，包括送入线程池等待执行以及I/O操作完毕后的回调处理。

事件循环、观察者、请求对象、I/O线程池这四者共同构成了Node异步I/O模型的基本要素。Windows下主要通过IOCP来向系统内核发送I/O调用和从内核获取已完成的I/O操作，配以事件循环，以此完成异步I/O的过程。在Linux下通过epoll实现这个过程，FreeBSD下通过kqueue实现，Solaris下通过Event ports实现。不同的是线程池在Windows下由内核（IOCP）直接提供，*nix系列下由libuv自行实现。

异步I/O的几个关键词：单线程、事件循环、观察者和I/O线程池。
# 这里单线程与I/O线程池之间看起来有些悖论的样子。由于我们知道JavaScript是单线程的，所以按常识很容易理解为它不能充分利用多核CPU。事实上，在Node中，除了JavaScript是单线程外，Node自身其实是多线程的，只是I/O线程使用的CPU较少。另一个需要重视的观点则是，除了用户代码无法并行执行外，所有的I/O（磁盘I/O和网络I/O等）则是可以并行起来的。

process.nextTick()中的回调函数执行的优先级要高于setImmediate()。这里的原因在于事件循环对观察者的检查是有先后顺序的，process.nextTick()属于idle观察者，setImmediate ()属于check观察者。在每一个轮循环检查中，idle观察者先于I/O观察者，I/O观察者先于check观察者。

在具体实现上，process.nextTick()的回调函数保存在一个数组中，setImmediate()的结果则是保存在链表中。在行为上，process.nextTick()在每轮循环中会将数组中的回调函数全部执行完，而setImmediate()在每轮循环中执行链表中的一个回调函数。

# 难点1-异常处理
调用async()方法后，callback被存放起来，直到下一个事件循环（Tick）才会取出来执行。尝试对异步方法进行try/catch操作只能捕获当次事件循环内的异常，对callback执行时抛出的异常将无能为力，示例代码如下：
try {
   async(callback);
} catch (e) {
    // TODO
}
Node在处理异常上形成了一种约定，将异常作为回调函数的第一个实参传回，如果为空值，则表明异步调用没有异常抛出：
async(function (err, results) {
    // TODO
});
在我们自行编写的异步方法上，也需要去遵循这样一些原则：
原则一：必须执行调用者传入的回调函数；
原则二：正确传递回异常供调用者判断。
示例代码如下：
var async = function (callback) {
    process.nextTick(function() {
    var results = something;
    if (error) {
        return callback(error);
    }
    callback(null, results);
  });
};

在异步方法的编写中，另一个容易犯的错误是对用户传递的回调函数进行异常捕获，示例代码如下：
try {
    req.body = JSON.parse(buf, options.reviver);
    callback();
} catch (err){
    err.body = buf;
    err.status = 400;
    callback(err);
}
上述代码的意图是捕获JSON.parse()中可能出现的异常，但是却不小心包含了用户传递的回调函数。这意味着如果回调函数中有异常抛出，将会进入catch()代码块中执行，于是回调函数将会被执行两次。这显然不是预期的情况，可能导致业务混乱。正确的捕获应当为：
try {
    req.body = JSON.parse(buf, options.reviver);
} catch (err){
    err.body = buf;
    err.status = 400;
    return callback(err);
}
callback();


在计算机中，缓存由于存放在内存中，访问速度十分快，常常用于加速数据访问，让绝大多数的请求不必重复去做一些低效的数据读取。所谓雪崩问题，就是在高访问量、大并发量的情况下缓存失效的情景，此时大量的请求同时涌入【数据库】中，数据库无法同时承受如此大的查询请求，进而往前影响到网站整体的响应速度。
以下是一条数据库查询语句的调用：
var select = function (callback) {
    db.select("SQL", function (results) {
        callback(results);
    });
};
如果站点刚好启动，这时缓存中是不存在数据的，而如果访问量巨大，同一句SQL会被发送到数据库中反复查询，会影响服务的整体性能。一种改进方案是添加一个状态锁，相关代码如下：
var status = "ready";
var select = function (callback) {
if (status === "ready") {
    status = "pending";
    db.select("SQL", function (results) {
        status = "ready";
        callback(results);
    });
  }
}
但是在这种情景下，连续地多次调用select()时，只有第一次调用是生效的，后续的其他select()是没有数据服务的，这个时候可以引入事件队列，相关代码如下：
var proxy = new events.EventEmitter();
var status = "ready";
var select = function (callback) {
    proxy.once("selected", callback);
    if (status === "ready") {
        status = "pending";
        db.select("SQL", function (results) {
            proxy.emit("selected", results);
            status = "ready";
        });
    }
};
这里我们利用了once()方法，将所有请求的回调都压入事件队列中，利用其执行一次就会将监视器移除的特点，保证每一个回调只会被执行一次。对于相同的SQL语句，保证在同一个查询开始到结束的过程中永远只有一次。SQL在进行查询时，新到来的相同调用只需在队列中等待数据就绪即可，一旦查询结束，得到的结果可以被这些调用共同使用，同名（'selected'）的事件一起结束，它们的回调都被执行了，结果都是第一个返回的数据。
这种方式能节省重复的数据库调用产生的开销。由于Node单线程执行的原因，此处无须担心状态同步问题。这种方式其实也可以应用到其他远程调用的场景中，即使外部没有缓存策略，也能有效节省重复开销。此处可能因为存在侦听器过多引发的警告，需要调用setMaxListeners(0)移除掉警告，或者设更大的警告阈值。

# 难点2-函数嵌套过深
由于多个异步场景中回调函数的执行并不能保证顺序，且回调函数之间互相没有任何交集，所以需要借助一个第三方函数和第三方变量来处理异步协作的结果。通常，我们把这个用于检测次数的变量叫做【哨兵变量】。同时利用偏函数来处理哨兵变量和第三方函数的关系，相关代码如下：
var after = function (times, callback) {
    var count = 0, results = {};
    return function (key, value) {
        results[key] = value;
        count++;
        if (count === times) {
            callback(results);
        }
    };
};
var done = after(times, render);
上述方案实现了多对一的目的。如果业务继续增长，我们依然可以继续利用发布/订阅方式来完成多对多的方案，相关代码如下：
var emitter = new events.Emitter();
var done = after(times, render);
emitter.on("done", done);
emitter.on("done", other);
fs.readFile(template_path, "utf8", function (err, template) {
    emitter.emit("done", "template", template);
});
db.query(sql, function (err, data) {
    emitter.emit("done", "data", data);
});
l10n.get(function (err, resources) {
    emitter.emit("done", "resources", resources);
});

偏函数 (Partial application)    在计算机科学中，局部应用是指固定一个函数的一些参数，然后产生另一个更小元的函数。（什么是元？元是指函数参数的个数，比如一个带有两个参数的函数被称为二元函数。）    局部应用则是固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n - x 元函数。

柯里化 (Currying)    在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。    柯里化是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数。
-----------------------------------
除了async、Step、EventProxy、wind等方案外，还有一类通过源代码编译的方案来实现流程控制的简化，streamline是典型的例子。

# 难点3-阻塞代码

# 难点4-多线程编程

process.memoryUsage()可以看到Node进程的内存占用情况，rss是resident set size的缩写，即进程的常驻内存部分。进程的内存总共有几部分，一部分是
rss，其余部分在交换区（swap）或者文件系统（filesystem）中。
os模块中的totalmem()和freemem()这两个方法用于查看操作系统的内存使用情况，它们分别返回系统的总内存和闲置内存，都以字节为单位。

通过process.momoryUsage()的结果可以看到，堆中的内存用量总是小于进程的常驻内存用量，这意味着Node中的内存使用并非都是通过V8进行分配的。我们将那些不是通过V8分配的内存称为堆外内存。
Buffer对象不同于其他对象，它不经过V8的内存分配机制，所以也不会有堆内存的大小限制。
这意味着利用堆外内存可以突破内存限制的问题。为何Buffer对象并非通过V8分配？这在于Node并不同于浏览器的应用场景。在浏览器中，
JavaScript直接处理字符串即可满足绝大多数的业务需求，而Node则需要处理网络流和文件I/O流，操作字符串远远不能满足传输的性能需求。

Node的内存构成主要由通过V8进行分配的部分和Node自行分配的部分。受V8的垃圾回收限制的主要是V8的堆内存。


Buffer对象类似于数组，它的元素为16进制的两位数，即0到255的数值。
var str = "深入浅出node.js";
var buf = new Buffer(str, 'utf-8');
console.log(buf);
// => <Buffer e6 b7 b1 e5 85 a5 e6 b5 85 e5 87 ba 6e 6f 64 65 2e 6a 73>
不同编码的字符串占用的元素个数各不相同，上面代码中的中文字在UTF-8编码下占用3个元素，字母和半角标点符号占用1个元素。

正确的Buffer拼接方法应该如下面展示的形式：
var chunks = [];
var size = 0;
res.on('data', function (chunk) {
    chunks.push(chunk);
    size += chunk.length;
});
res.on('end', function () {
    var buf = Buffer.concat(chunks, size);
    var str = iconv.decode(buf, 'utf8');
    console.log(str);
});
正确的拼接方式是用一个数组来存储接收到的所有Buffer片段并记录下所有片段的总长度，然后调用Buffer.concat()方法生成一个合并的Buffer对象。Buffer.concat()方法封装了从小Buffer对象向大Buffer对象的复制过程，实现十分细腻，值得围观学习：
Buffer.concat = function(list, length) {
    if (!Array.isArray(list)) {
        throw new Error('Usage: Buffer.concat(list, [length])');
    }
    if (list.length === 0) {
        return new Buffer(0);
    } else if (list.length === 1) {
        return list[0];
    }
    if (typeof length !== 'number') {
        length = 0;
        for (var i = 0; i < list.length; i++) {
            var buf = list[i];
            length += buf.length;
        }
    }
    var buffer = new Buffer(length);
    var pos = 0;
    for (var i = 0; i < list.length; i++) {
        var buf = list[i];
        buf.copy(buffer, pos);
        pos += buf.length;
    }
    return buffer;
};

mysql 中 localhost 和 127.0.0.1 连接的区别，其实质分别对应的就是 Unix domain socket 和 TCP/IP socket。 下面再来看看这两者之间的区别。
UNIX Domain Socket用于IPC更有效率：不需要经过网络协议栈，不需要打包拆包、计算校验和、维护序号和应答等，只是将应用层数据从一个进程拷贝到另一个进程。
UNIX域套接字与TCP套接字相比较，在同一台主机的传输速度前者是后者的两倍。
这是因为，IPC机制本质上是可靠的通讯，而网络协议是为不可靠的通讯设计的。

尽管在网络的一端调用write()会触发另一端的data事件，但是并不意味着每次write()都会触发一次data事件，在关闭掉Nagle算法后，另一端可能会将接收到的多
个小数据包合并，然后只触发一次data事件。

UDP套接字相对TCP套接字使用起来更简单，它只是一个EventEmitter的实例，而非Stream的实例。

QPS（Query Per Second）：每秒请求数，就是说服务器在一秒的时间内处理了多少个请求。

cat xx.log |grep 'GET /mvc2'|cut -d ' ' -f4|uniq -c|sort -n -r 
cut -d ' ' -f4 过滤出来的内容按照空格分割，取第四列
uniq -c 每列旁边显示该行重复出现的次数
sort -n -r 依照数值大小排序 

异步I/O不仅仅应用在文件操作中。对于网络套接字的处理，Node也应用到了异步I/O，网络套接字上侦听到的请求都会形成事件交给I/O观察者。事件循环会不停地处理这些网络I/O事件。如果JavaScript有传入回调函数，这些事件将会最终传递到业务逻辑层进行处理。利用Node构建Web服务器，正是在这样一个基础上实现的。

Node通过事件驱动的方式处理请求，无须为每一个请求创建额外的对应线程，可以省掉创建线程和销毁线程的开销，同时操作系统在调度任务时因为线程较少，上下文切换的代价很低。这使得服务器能够有条不紊地处理请求，即使在大量连接的情况下，也不受线程上下文切换开销的影响，这是Node高性能的一个原因。

// TCP
var net = require('net');
var server = net.createServer(function (socket) { })

// UDP
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
    server.on("message", function (msg, rinfo) {
    console.log("server got: " + msg + " from " +
        rinfo.address + ":" + rinfo.port);
});
server.on("listening", function () {
var address = server.address();

// http
var http = require('http');
http
  .createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
  })
  .listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

curl -v http://127.0.0.1:1337    看到TCP的3次握手，只看response的话用-i

# Node的http模块包含对HTTP处理的封装。在Node中，HTTP服务继承自TCP服务器（net模块），它能够与多个客户端保持连接，由于其采用事件驱动的形式，并不为每一个连接创建额外的线程或进程，保持很低的内存占用，所以能实现高并发。HTTP服务与TCP服务模型有区别的地方在于，在开启keepalive后，一个TCP会话可以用于多次请求和响应。TCP服务以connection为单位进行服务，HTTP服务以request为单位进行服务。http模块即是将connection到request的过程进行了封装。

var cp = require('child_process');

var worker;

function spawn(server, config) {
  // 这是另一个teminal启动node了，所以看不到另一个进程server文件里的console.log，得用stdout.on来监听
  worker = cp.spawn('node', [server, config]);
  // process.stdin.pipe(worker.stdin)
  worker.stdout.on('data', d => {
    console.log('spawn-stdout', d.toString('utf-8'));
  });
  worker.on('exit', function (code) {
    if (code !== 0) {
      spawn(server, config);
    }
  });
}

function main(argv) {
  spawn('seven_days_example.js', argv[0]);
  process.on('SIGTERM', function () {
    // 父进程通过.kill方法向子进程发送SIGTERM信号，子进程监听process对象的SIGTERM事件响应信号。不要被.kill方法的名称迷惑了，该方法本质上是用来给进程发送信号的，进程收到信号后具体要做啥，完全取决于信号的种类和进程自身的代码。
    console.log('parent:', worker);
    worker.kill();
    process.exit(0);
  });
}

main(process.argv.slice(2));

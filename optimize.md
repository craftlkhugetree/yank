假如有一堆的任务，但是只想在用户交互的时候才让步，该怎么办？正好有这种api--isInputPending
isInputPending这个函数可以在任何时候调用，它能判断用户是否要与页面元素进行交互。调用isInputPending会返回布尔值，true代表要与页面元素交互，false则不交互。
比如说，任务队列中有很多任务，但是不想阻挡用户输入，使用isInputPending和自定义方法yieldToMain方法，就能够保证用户交互时的input不会延迟。

while (tasks.length > 0) {
    // Optional chaining operator used here helps to avoid
    // errors in browsers that don't support `isInputPending`:
    if (navigator.scheduling?.isInputPending() || performance.now() >= deadline) {
      // There's a pending user input, or the
      // deadline has been reached. Yield here:
      await yieldToMain();

      // Extend the deadline:
      deadline += 50;

      // Stop the execution of the current loop and
      // move onto the next iteration:
      continue;
    }

或者    scheduler.postTask(validateForm, {priority: 'user-blocking'});
链接：https://juejin.cn/post/7159807927908302884
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
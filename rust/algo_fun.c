// 链接：https://www.zhihu.com/question/513922930/answer/3024469846
#include <stdio.h>
#define N 10

// 这个函数用C语言实现了快速排序算法，可以对任意长度的数组进行排序
// 快速排序的核心操作是“哨兵划分”，其目标是：选择数组中的某个元素作为“基准数”，将所有小于基准数的元素移到其左侧，而大于基准数的元素移到其右侧。
// 哨兵划分的实质是将一个较长数组的排序问题简化为两个较短数组的排序问题。
void quick_sort(int arr[], int left, int right) {
  if (left < right) {
    int i = left, j = right, pivot = arr[left];
    while (i < j) {
      while (i < j && arr[j] >= pivot) j--;
      if (i < j) arr[i++] = arr[j]; // pivot备份了i，然后i备份了j
      while (i < j && arr[i] <= pivot) i++;
      if (i < j) arr[j--] = arr[i]; // j备份了新的i
    }
    arr[i] = pivot; // 新i这个位置成为支点arr[0]，也是2个子数组的分界线
    quick_sort(arr, left, i - 1);
    quick_sort(arr, i + 1, right);
  }
}

// 这个函数用C语言实现了二分查找算法，可以在已排序的数组中查找指定的元素
int binary_search(int arr[], int len, int target) {
  int low = 0, high = len - 1;
  while (low <= high) {
    int mid = (low + high) / 2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

// 这个函数用C语言实现了斐波那契数列的递归算法，可以计算任意项的值
int fibonacci(int n) {
  if (n == 0 || n == 1) return n;
  else return fibonacci(n - 1) + fibonacci(n - 2);
}

// 这个函数用C语言实现了阶乘的递归算法，可以计算任意正整数的阶乘
int factorial(int n) {
  if (n == 0 || n == 1) return 1;
  else return n * factorial(n - 1);
}

// 这个函数用C语言实现了判断一个数是否为素数的算法，可以检测任意正整数是否为素数
int is_prime(int n) {
  if (n <= 1) return 0;
  for (int i = 2; i * i <= n; i++) {
    if (n % i == 0) return 0;
  }
  return 1;
}

// 这个函数用C语言实现了打印一个矩形的算法，可以根据给定的长和宽打印出一个由*组成的矩形
void print_rectangle(int length, int width) {
  for (int i = 0; i < width; i++) {
    for (int j = 0; j < length; j++) {
      printf("*");
    }
    printf("\n");
  }
}

// 这个函数用C语言实现了打印一个三角形的算法，可以根据给定的高度打印出一个由*组成的等腰三角形
void print_triangle(int height) {
  for (int i = 0; i < height; i++) {
    for (int j = 0; j < height - i - 1; j++) {
      printf(" ");
    }
    for (int k = 0; k < i * 2 + 1; k++) {
      printf("*");
    }
    printf("\n");
  }
}

// 这个函数用C语言实现了打印一个菱形的算法，可以根据给定的高度打印出一个由*组成的菱形
void print_diamond(int height) {
  for (int i = -height / 2; i <= height / 2; i++) {
    for (int j = -height / 2; j <= height / 2; j++) {
      if (abs(i) + abs(j) <= height /2 ) printf("*");
      else printf(" ");
    }
    printf("\n");
  }
}

// 这个函数用C语言实现了打印一个心形的算法，可以根据给定的大小打印出一个由*组成的心形
void print_heart(int size) {
  for (int i = 0; i < size; i++) {
    for (int j = 0; j < size * 2; j++) {
      if ((i == 0 && j % size == size / 2) || (i == 1 && (j % size == size / 4 || j % size == size * 3 / 4)) || (i > 1 && i < size / 2 && j % size >= i - 1 && j % size <= size - i) || (i >= size / 2 && (j + i) % size == size / 2)) printf("*");
      else printf(" ");
    }
    printf("\n");
  }
}

// 这个函数用C语言实现了打印一个笑脸的算法，可以根据给定的大小打印出一个由*组成的笑脸
void print_smile(int size) {
  for (int i = 0; i < size; i++) {
    for (int j = 0; j < size; j++) {
      if ((i == 0 || i == size - 1) && (j > 0 && j < size - 1)) printf("*");
      else if ((j == 0 || j == size - 1) && (i > 0 && i < size - 1)) printf("*");
      else if ((i == size / 4 || i == size / 4 + 1) && (j == size / 4 || j == size / 4 + 1)) printf("*");
      else if ((i == size / 4 || i == size / 4 + 1) && (j == size * 3 / 4 || j == size * 3 / 4 - 1)) printf("*");
      else if ((i == size * 3 / 4 || i == size * 3 / 4 + 1) && (j >= size / 4 + i - size *3/4 && j <=size *3/4 - i +size *3/4)) printf("*");
      else printf(" ");
    }
    printf("\n");
  }
}

// 这个函数用C语言实现了打印一个树形的算法，可以根据给定的高度打印出一个由*组成的树形
void print_tree(int height) {
  for (int i = 0; i < height; i++) {
    for (int j = 0; j < height - i - 1; j++) {
      printf(" ");
    }
    for (int k = 0; k < i * 2 + 1; k++) {
      printf("*");
    }
    printf("\n");
  }
  for (int i = 0; i < height / 4; i++) {
    for (int j = 0; j < height - height / 8 - 1; j++) {
      printf(" ");
    }
    for (int k = 0; k < height / 4 + 1; k++) {
      printf("*");
    }
    printf("\n");
  }
}

// 这个函数用C语言实现了打印一个雪花的算法，可以根据给定的大小打印出一个由*组成的雪花
void print_snowflake(int size) {
  for (int i = -size / 2; i <= size / 2; i++) {
    for (int j = -size / 2; j <= size / 2; j++) {
      if (i == j || i == -j || i == 0 || j == 0) printf("*");
      else printf(" ");
    }
    printf("\n");
  }
}

// 这个函数用C语言实现了打印一个月亮的算法，可以根据给定的大小打印出一个由*组成的月亮
void print_moon(int size) {
  for (int i = -size / 2; i <= size / 2; i++) {
    for (int j = -size / 2; j <= size / 2; j++) {
      if ((i * i + j * j <= size * size / 4) && (j >= -i * size / (size * 2))) printf("*");
      else printf(" ");
    }
    printf("\n");
  }
}
vue -V
vue create app1

// 由于 Tailwind 不会自动添加浏览器引擎前缀到生成的 CSS 中，我们建议您安装 autoprefixer 去处理这个问题，就像上面的代码片段所展示的那样。
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

// 生成两个配置文件 -p
npx tailwindcss init -p

group 组触发
group-hover:text-blue-600


extends里是扩展原来的设置，不用覆盖默认属性

@layer components {
    .组件类: {
        @apply
    }
}

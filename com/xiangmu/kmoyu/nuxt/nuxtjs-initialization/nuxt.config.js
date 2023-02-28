export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '小艾',
    htmlAttrs: {
      lang: 'cn'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  axios: {
    proxy: true, // 需要的，不设置请求无法转发
  },
    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
      '@nuxtjs/proxy',
    ],
  proxy: {
    '/api/': {
      target: 'https://test.aaa.com/proxy', // 请求转发地址
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    },
  },
  css: [
    // 全部页面的css文件
    '@/assets/css/main.scss'
  ],
  buildModules: [
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    // 全局的scss文件
    scss: [
      '@/assets/css/mixin.scss'
    ]
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // ssr: true表示这个插件只在服务端起作用
    { src: '~/plugins/element', ssr: true }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],



  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: ['axios']
  }
}

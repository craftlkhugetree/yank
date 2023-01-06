npm install vue-class-component vue-property-decorator --save
npm install ts-loader typescript tslint tslint-loader tslint-config-standard --save-dev --legacy-peer-deps

vue-class-component：扩展vue支持typescript，将原有的vue语法通过声明的方式来支持ts

vue-property-decorator：基于vue-class-component扩展更多装饰器

ts-loader：让webpack能够识别ts文件

tslint-loader：tslint用来约束文件编码

tslint-config-standard： tslint 配置 standard风格的约束

npm i -D typescript@~4.2.3
npm i -D ts-loader@~8.2.0

Cannot find module 'xlsx'. Did you mean to set the ‘moduleResolution’ option to ‘node’, or to add aliases to the ‘paths’ option?
ts配置文件中加入 "moduleResolution": "node"
————————————————
TS7006: Parameter 'obj' implicitly has an 'any' type.        "strict": true,改为false
TS2531: Object is possibly 'null'.       "strictNullChecks": true,改为false
TS2349: This expression is not callable.     (obj.value as any)(params)
TS2307: Cannot find module './detailTable' or its corresponding type declarations.  去掉appendTsSuffixTo: [/\.vue$/],

    "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
    "baseUrl": "./",  // 这里需要配置，配合解决@/找不到文件的问题
    "paths": {
      "@/*": ["./src/*"]  // 这里需要配置
    }
    // 如果baseUrl设置为'src',那paths就应该配置为{"@/*": "./*"},如下：
    // "baseUrl": "src",
    // "paths": {
    //  "@/*": ["./*"]
    // }
————————————————

tsconfig.json
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "commonjs",
    "target": "es5",
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "node",
    "strict": false,
    "strictNullChecks": false,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "baseUrl": "./", // 这里需要配置
    "paths": {
      "@/*": ["./src/*"] // 这里需要配置
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "exclude": ["node_modules"]
}

 configureWebpack: {
    resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: 'tslint-loader',
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
      ],
    },
  },

在ts能找到的范围，比如src内添加ts文件来解决globalThis问题：
declare interface Window {
  g: any;
}

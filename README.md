**install**

```javascript
npm install vite-plugin-upload-server
or
yarn add vite-plugin-upload-server
```

**Use**

````javascript
// vite.config.ts

/**
 * @host 服务器地址
 * @username 用户名
 * @password 密码
 * @filePath 服务器上项目的目录
 */

/**
 * @command
 * @mode
 * @server
 * @build
 * @cleanFiles 是否需要清理目录
 */

const server = {
  development: {
    host: '',
    username: '',
    password: '',
    filePath: '',
  },
  test: {
    host: '',
    username: '',
    password: '',
    filePath: '',
  },
  production: {
    host: '',
    username: '',
    password: '',
    filePath: '',
  },
}

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      uploadServerPlugin({
        command,
        mode,
        build: './dist',
        server,
      }),
    ],
  }
})

// package.json
```json
"scripts": {
"start": "vite",
"preview": "vite preview",
"build:dev": "tsc && vite build --mode development",
"build:test": "tsc && vite build --mode test",
"build:prod": "tsc && vite build --mode production"
},

````

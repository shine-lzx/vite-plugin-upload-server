import { NodeSSH } from 'node-ssh'
import type { ConfigEnv } from 'vite'
import pc from 'picocolors'
import Spin from './spin'

const loading = new Spin()

export type Server = {
  development: Content
  test: Content
  production: Content
}

export type Content = {
  host: string
  username: string
  password: string
  filePath: string
}

export interface Options extends ConfigEnv {
  build: string
  server: Server
  cleanFiles?: boolean
}

export type Env = 'development' | 'test' | 'production'

class FileHandler {
  ssh: NodeSSH
  server: Content
  distPath: string
  cleanFiles: boolean | undefined
  constructor({ mode, server, build, cleanFiles }: Options) {
    this.ssh = new NodeSSH()
    this.server = server[mode as Env]
    this.distPath = build
    this.cleanFiles = cleanFiles
    this.apply()
  }

  async apply() {
    await this.connectServer()
    const serverDir = this.server.filePath
    if (this.cleanFiles) {
      console.log(pc.yellow('执行清理原目录文件……'))
      await this.ssh.execCommand(`rm -rf ${serverDir}/*`)
      console.log(pc.green('执行完成'))
    }
    loading.start(pc.blue('开始上传文件'))
    await this.uploadFiles(this.distPath, serverDir)
    this.ssh.dispose()
  }

  async connectServer() {
    try {
      await this.ssh.connect({
        host: this.server.host,
        username: this.server.username,
        password: this.server.password,
      })
      console.log(pc.green('服务器连接成功'))
    } catch (error) {
      console.log(pc.red('服务器连接失败' || error))
    }
  }

  async uploadFiles(localPath: string, remotePath: string) {
    const status = await this.ssh.putDirectory(localPath, remotePath, {
      recursive: true,
      concurrency: 10,
    })

    loading.stop(status ? pc.green('文件上传成功') : pc.red('文件上传失败'))
  }
}

const uploadServerPlugin = ({
  command,
  mode,
  server,
  build = './dist',
  cleanFiles = false,
}: Options) => {
  return {
    name: 'vite-plugin-upload-server',
    closeBundle() {
      if (command === 'build') {
        if (!build) throw 'please input build'
        new FileHandler({ command, mode, server, build, cleanFiles })
        return Promise.resolve()
      }
    },
  }
}

export default uploadServerPlugin

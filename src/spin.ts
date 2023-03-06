export default class Spin {
  timer: NodeJS.Timeout | null
  symbol: string
  constructor() {
    this.timer = null
    this.symbol = '|/-'
  }

  start(description: string = '正在执行操作') {
    let index = 0
    if (this.timer) {
      clearInterval(Number(this.timer))
    }
    this.timer = setInterval(() => {
      index = ++index % this.symbol.length
      process.stdout.write(`\r ${this.symbol[index]} ${description}`)
    }, 500)
  }

  stop(description: string = '操作完成') {
    process.stdout.clearLine(0)
    process.stdout.write('\r')
    clearInterval(Number(this.timer))
    console.log(description)
  }
}

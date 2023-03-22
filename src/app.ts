// External
import 'dotenv/config' // 载入.env环境配置文件
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

// Local
import appRouter from './routes/index.js' // 路由
import { consoleInit, consoleStart, briefLog } from './utils.js'

// 输出程序初始化信息
// console.log('process.env: ', process.env)
consoleInit()

const isDev = process.env.NODE_ENV !== 'production'

// 创建Koa.js实例
const app = new Koa()

// 简易日志
app.use(briefLog)

// 兜底错误处理
app.on('error', (error, ctx) => {
  // console.error('server error: ', error)

  ctx.body = {
    message: (error.message ?? '服务端无法处理该请求')
  }
})

// 核验请求方式
app.use(async (ctx, next) => {
  if (ctx.method !== 'POST') {
    ctx.throw(405, `Request method ${ctx.method} is not allowed.`)
  } else {
    await next()
  }
})

// 解析请求的body部分
app.use(bodyParser())

/**
 * RESTful
 */
app.use(appRouter.routes()).use(appRouter.allowedMethods())

// 兜底路由
app.use(async ctx => {
  ctx.status = 200
  ctx.body = { message: 'Hello, World!', figureURL: 'https://http.cat/200' }
})

// 启动服务
const serverPort = process.env.PORT ?? 3000
app.listen(serverPort)

// 输出业务启动信息
consoleStart()

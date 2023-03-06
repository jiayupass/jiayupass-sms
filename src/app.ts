// External
import 'dotenv/config' // 载入.env环境配置文件
import Koa from 'koa'
import bodyParser from 'koa-bodyparser' // 处理json和x-www-form-urlencoded

// Local
import appRouter from './routes' // 路由
import { consoleInit, consoleStart, briefLog } from './utils'


// 输出程序初始化信息
// console.log('process.env: ', process.env)
consoleInit()

const isDev = process.env.NODE_ENV !== 'production'

// 创建Koa.js实例
const app = new Koa()

// 简易日志
app.use(briefLog)

// 兜底错误处理
app.on('error', (error, ctx): void => {
  console.error('server error: ', error)

  ctx.status = error.code ?? 501
  ctx.body = { content: error.message }
})

// 解析入栈请求的body部分
app.use(bodyParser({ jsonLimit: '4mb' }))
// if (isDev) {
//   app.use(async (ctx, next) => {
//     // console.log(ctx.request.body)
//     ctx.body = ctx.request.body

//     await next()
//   })
// }

/**
 * RESTful
 */
app.use(appRouter.routes()).use(appRouter.allowedMethods())

// 兜底路由
app.use(async (ctx, next) => {
  ctx.status = 200
  ctx.body = { data: 'Hello, World!', figureURL: 'https://http.cat/200' }
})

// 启动服务
const serverPort = process.env.PORT ?? 3000
app.listen(serverPort)

// 输出业务启动信息
consoleStart()

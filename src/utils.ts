/**
 * 工具方法
 */
// External
import type Koa from 'koa'
import os from 'node:os'

/**
 * 获取本地IP地址
 *
 * @param internal
 * @param family
 *
 * @returns { array }
 */
const getLocalIP = (
  internal: boolean | undefined = undefined,
  family: string[] = ['IPv4', 'IPv6']
): any[] => {
  // console.log('getLocalIP: ', internal, family)

  const result: any[] = []

  const interfaces = os.networkInterfaces()

  if (Object.keys(interfaces).length === 0) {
    return result
  }

  // 分别处理各网络接口分组
  for (const groupName in interfaces) {
    // console.log(interfaces[groupName])

    const group: os.NetworkInterfaceInfo[] = Array.isArray(interfaces[groupName]) ? (interfaces[groupName] ?? []) : []

    // 对各分组中的网络接口项进行处理
    for (let i = 0; i < group.length; i++) {
      const item = group[i]

      // 仅处理特定类型的接口
      if (
        family.includes(item.family) &&
        (typeof internal === 'boolean' ? internal === item.internal : true)
      ) {
        result.push({
          address: item.address,
          family: item.family,
          internal: item.internal
        })
      }
    }
  }
  // console.log('result: ', result)

  return result
}

/**
 * 获取请求IP地址
 *
 * 在koa.js中间件中，通过 ctx.ip 可直接获取
 *
 * @param req
 * @returns {string} IP地址
 */
const getClientIP = (req: any): string => {
  // console.log('getClientIP: ', req)

  // 判断是否有反向代理 IP
  const result = req.headers['x-forwarded-for'] ?? // 判断是否有反向代理 IP
    req.headers['x-real-ip'] ??
    req.connection.remoteAddress ?? // 判断 connection 的远程 IP
    req.socket.remoteAddress ?? // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress ?? ''

  // console.log('result: ', result)
  return result
}

/**
 * 输出程序初始化信息
 */
const consoleInit = (): void => {
  console.log(
    '\x1b[32m%s\x1b[0m',
    '\n\n🟡 ============================',
    `\n\n🚀 Launching ${process.env.npm_package_name as string} v${process.env.npm_package_version as string}`,
    `\n\n✨ Node.js ${process.version} is started under ${process.env.NODE_ENV as string}\n`
  )
}

/**
 * 输出业务启动信息
 *
 * @param graphqlPath {undefined|string} GraphQL服务路径
 */
const consoleStart = (graphqlPath: undefined | string = undefined): void => {
  const serverPort = process.env.PORT ?? 3000

  console.log(
    '\x1b[32m%s\x1b[0m', `\n👂 Koa.js now listening on ${serverPort} at:\n`
  )
  console.log(
    '\x1b[32m%s\x1b[33m',
    'Root    ', `http://localhost:${serverPort}`
  )
  typeof graphqlPath === 'string' && console.log(
    '\x1b[32m%s\x1b[33m%s\x1b[0m',
    'GraphQL  ', `http://localhost:${serverPort}${graphqlPath}\n`
  )

  // 输出本地IP
  const localIPs = getLocalIP(undefined, ['IPv4'])
  localIPs.forEach(item => {
    console.log(
      '\x1b[32m%s\x1b[33m',
      'Root    ', `http://${item.address as string}:${serverPort as string} (${item.internal === true ? 'local' : 'external'})`
    )
    typeof graphqlPath === 'string' && console.log(
      '\x1b[32m%s\x1b[33m%s\x1b[0m',
      'GraphQL  ', `http://${item.address as string}:${serverPort as string}${graphqlPath} (${item.internal === true ? 'local' : 'external'})\n`
    )
  })

  console.log(
    '\x1b[32m%s\x1b[0m', '🟢 ============================\n'
  )
}

const briefLog = async (ctx: Koa.Context, next: () => Promise<any>): Promise<void> => {
  // 按需开启不同测试信息的输出
  // console.log('ctx.req(node req): ', ctx.req)
  // console.log('ctx.request: ', ctx.request)

  const start: number = Date.now()
  if (ctx.url !== '/favicon.ico') await next()

  const duration: number = Date.now() - start
  const durationText: string = `${duration}ms`

  ctx.set('X-Response-Time', durationText)
  ctx.set('APP-Client-IP', getClientIP(ctx.req))

  console.log(`${ctx.ip} > ${ctx.method} ${ctx.url} - ${durationText}`)
}

export {
  consoleInit,
  consoleStart,
  briefLog
}

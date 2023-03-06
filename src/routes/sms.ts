/**
 * SMS/small_message 短信子路由/控制器模块
 *
 * 实现基础CRUD功能，并可扩展其它功能
 *
 * ORM
 * https://www.prisma.io/docs/concepts/components/prisma-client/crud
 *
 * 路由
 * https://github.com/koajs/router/blob/master/API.md
 *
 * author: Kamas Lau<kamaslau@dingtalk.com>
 */
import KoaRouter from '@koa/router'
import { sendOne } from '../libs/luosimao'

const Router = new KoaRouter()

/**
 * Create
 */
Router.post('/', async ctx => {
  console.log('ctx.request.body: ', ctx.request.body)
  const createInput = ctx.request.body

  if (!('mobile' in createInput)) {
    ctx.status = 404
    ctx.body = {
      message: '未传入必要的请求参数',
      inputBody: ctx.request.body
    }
  }

  // 尝试发送短信
  const trySend = await sendOne(createInput.mobile, createInput.content)
  if (trySend === null || trySend.error !== 0) {
    ctx.status = 500
    ctx.body = {
      errorCode: `供应商错误码: ${trySend.error as string}`,
      message: `短信发送失败: ${trySend.msg as string}`
    }

    return
  }

  // 保存数据
  const result =
  {
    ...createInput,
    time_sent: parseInt((+new Date() / 1000).toString()),
    content: trySend.content,
    captcha: trySend.captcha ?? undefined,
    time_expire: trySend.captcha?.length > 0 ? parseInt((+new Date() / 1000).toString()) + 60 * 3 : undefined // 默认3分钟内有效
  }

  if (result === null) {
    ctx.status = 500
    ctx.body = { message: '数据写入失败' }
  } else {
    const body = { data: result, inputBody: ctx.request.body }

    ctx.body = body
    ctx.status = 200
  }
})

export default Router

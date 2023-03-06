/**
 * SMS/small_message 短信子路由/控制器模块
 * 
 * 路由
 * https://github.com/koajs/router/blob/master/API.md
 *
 * author: Kamas Lau<kamaslau@dingtalk.com>
 */
import KoaRouter from '@koa/router'
import { Validator } from '../libs/sms'
import { sendOne } from '../libs/luosimao'

const Router = new KoaRouter()

/**
 * Create
 */
Router.post('/', async ctx => {
  ctx.body = {
    inputBody: ctx.request.body
  }

  // console.log('ctx.request.body: ', ctx.request.body)
  const createInput = ctx.request.body

  // 核验请求参数
  const validator = new Validator
  const validResult = validator.mobile(createInput.mobile)
  if (validResult.valid === false) {
    ctx.status = 406
    ctx.body.message = '未传入合规的请求参数'

    return
  }

  // 尝试发送短信
  const trySend = await sendOne(createInput.mobile, createInput.content)
  if (trySend === null || trySend.error !== 0) {
    ctx.status = 500
    ctx.body.message = `短信发送失败，供应商错误码: ${trySend.error as string}，${trySend.msg as string}`

    return
  }

  // 组装响应体
  try {
    const timestamp = Math.ceil(Date.now() / 1000) // 当前Unix时间戳

    const result =
    {
      ...createInput,
      timeSent: timestamp,
      content: trySend.content,
      captcha: trySend.captcha ?? undefined,
      timeExpire: trySend.captcha?.length > 0 ? timestamp + 60 * 3 : undefined // 默认3分钟内有效
    }

    ctx.body.data = result
  } catch (error) {
    console.error(error)
  }
})

export default Router

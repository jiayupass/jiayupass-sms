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
import Basic from '../controllers/utils'
import BasicTypes from '../../types'
import BasicModel from '../models/basic'

import { sendOne } from '../libs/luosimao'
const Router = new KoaRouter()

// 基础配置
const routeCode: string = 'SMS' // 路由编码
const modelName: string = 'sms' // 数据表名称
const pkName: string = 'id' // 主键名

// 可排序字段
const defaultSorter = { ...Basic.defaultSorter }
const allowedSorters = ['name', ...Object.keys(defaultSorter)]
// console.log(`${routeCode} allowedSorters: `, allowedSorters)

/**
 * Get Count
 */
Router.get('/count', async (ctx) => {
  const apiCode = `${routeCode}0` // API编码；仅API功能有此项
  const body: BasicTypes.responseBody = {
    apiCode,
    inputBody: ctx.request.body
  }

  const filter = undefined // 筛选器

  const basicModel = new BasicModel(modelName, ctx) // Init model
  const result = await basicModel.count(filter)
  body.data = result

  ctx.status = typeof result === 'number' ? 200 : 500
  ctx.body = body
})

/**
 * Get List
 */
Router.get('/', async (ctx) => {
  const apiCode = `${routeCode}1`
  const body: BasicTypes.responseBody = {
    apiCode,
    inputBody: ctx.request.body,
    inputQuery: ctx.query
  }

  // 筛选器；例如：?sorter={"time_created":"desc"}
  const sorter =
    ctx.query.sorter?.length > 0
      ? Basic.composeSorter(ctx.query.sorter, allowedSorters)
      : defaultSorter // 排序器
  const filter = undefined // 筛选器

  const limit = ctx.query.limit >= 0 ? Number(ctx.query.limit) : undefined
  const offset = ctx.query.offset >= 0 ? Number(ctx.query.offset) : undefined

  const basicModel = new BasicModel(modelName, ctx) // Init model
  const result = await basicModel.findMany(filter, sorter, offset, limit)
  body.data = result

  ctx.status = result.length === 0 ? 404 : 200
  ctx.body = body
})

/**
 * Get by ID
 */
Router.get('/:id', async ctx => {
  const apiCode = `${routeCode}2`

  const basicModel = new BasicModel(modelName, ctx) // Init model
  const result = await basicModel.findUnique(pkName, ctx.params.id)

  ctx.status = result === null ? 404 : 200
  ctx.body = { apiCode, data: result }
})

/**
 * Create
 */
Router.post('/', async ctx => {
  const apiCode = `${routeCode}3`

  console.log('ctx.request.body: ', ctx.request.body)
  const createInput = ctx.request.body

  if (!('mobile' in createInput)) {
    ctx.status = 404
    ctx.body = {
      apiCode,
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
  const basicModel = new BasicModel(modelName, ctx) // Init model
  const result = await basicModel.create(
    {
      ...createInput,
      time_sent: parseInt((+new Date() / 1000).toString()),
      content: trySend.content,
      captcha: trySend.captcha ?? undefined,
      time_expire: trySend.captcha?.length > 0 ? parseInt((+new Date() / 1000).toString()) + 60 * 3 : undefined // 默认3分钟内有效
    }
  )

  if (result === null) {
    ctx.status = 500
    ctx.body = { message: '数据写入失败' }
  } else {
    const body: BasicTypes.responseBody = { apiCode, data: result, inputBody: ctx.request.body }

    ctx.body = body
    ctx.status = 200
  }
})

export default Router

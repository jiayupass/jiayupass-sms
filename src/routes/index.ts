/**
 * 主路由
 *
 * 引入，并集成各个子路由
 *
 * author: Kamas Lau<kamaslau@dingtalk.com>
 */
// External
import KoaRouter from '@koa/router'

// Local
import sms from './sms'

const Router = new KoaRouter()
Router.use('/', sms.routes(), sms.allowedMethods())

export default Router

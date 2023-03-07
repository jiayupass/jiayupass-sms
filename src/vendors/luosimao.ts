/**
 * https://luosimao.com/
 * https://luosimao.com/docs/api
 */
// External
import fetch from 'node-fetch'

// Local
import { URLSearchParams } from 'node:url'
import { base64 } from '../libs/encrypt'
import { composeCaptchaMsg } from '../libs/sms'

/**
 * API路径词典
 */
const apiRootPath = 'https://sms-api.luosimao.com/v1/'
const apiPathDict = {
  sendOne: `${apiRootPath}send.json`
}

/**
 * 通用后缀（签名）
 */
const msgSuffix: string = process.env.SMS_SUFFIX ?? ''

// 生成鉴权头信息
const composeAuth = (): string => {
  const authKey = `api:key-${process.env.LUOSIMAO_TOKEN as string}`
  const result = `Basic ${base64(authKey)}`

  return result
}

// 生成请求头信息
const composeHeaders = (): any => {
  const result = {
    Authorization: composeAuth(),
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  return result
}

/**
 * 发送单条
 *
 * @param mobile {string|int}
 * @param content {string}
 */
const sendOne = async (mobile: string | number, content: null | string = null): Promise<any> => {
  // console.log('sendOne: ', mobile, content)

  let captcha

  // 若未传入短信内容，则默认为验证码短信
  if (content === null) {
    const composedMsg = composeCaptchaMsg()

    content = composedMsg.message
    captcha = composedMsg.captcha
  }

  const params = {
    mobile: (mobile as number).toString(),
    message: `${content}${msgSuffix}`
  }

  let result: any = null

  try {
    result = await fetch(
      apiPathDict.sendOne,
      {
        headers: composeHeaders(),
        method: 'POST',
        body: new URLSearchParams(params).toString()
      }
    ).then((res) => res.json())
  } catch (error) {
    console.error('sendOne error: ', error)
  }

  // 若发送验证码成功，一并返回验证码
  if (result.error === 0) {
    result.captcha = captcha
    result.content = content
  }

  // console.log('sendOne result: ', result)
  return result
}

export { sendOne }

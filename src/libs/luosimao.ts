/**
 * https://luosimao.com/
 */
import fetch from 'node-fetch'
import { URLSearchParams } from 'node:url'
import { base64 } from '../libs/encrypt'

/**
 * 短信
 *
 * https://luosimao.com/docs/api
 */
const apiPathDict = {
  sendOne: 'http://sms-api.luosimao.com/v1/send.json'
}
const msgSuffix: string = process.env.SMS_SUFFIX ?? '' // 通用后缀

// 生成鉴权头信息
const composeAuth = (): string => {
  const authKey = `api:key-${process.env.API_TOKEN as string}`
  const result = `Basic ${base64(authKey)}`

  return result
}

/**
 * 生成验证码短信内容
 */
const composeCaptchaMsg = (): { message: string, captcha?: string } => {
  const getRandomIntInclusive = (min: number, max: number): number => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min // 含最大值，含最小值
  }
  const captchaCode = getRandomIntInclusive(100000, 999999).toString()

  const captchaTemplate = "### 是您的验证码，3分钟内有效；若非您已知、理解，且自愿、主动进行的操作导致收到此信息，请勿理会或转发。"
  const message = captchaTemplate.replace("###", captchaCode)

  const result = { message, captcha: captchaCode }

  // console.log('composeCaptchaMsg result: ', result)
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
        headers: {
          Authorization: composeAuth(),
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
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

/**
 * https://cloud.tencent.com/
 * https://cloud.tencent.com/document/product/382/55981
 */
// External
import fetch from 'node-fetch'

// Local
import { sha256, sha256Hmac } from '../libs/encrypt'
import { composeCaptchaMsg } from '../libs/sms'

/**
 * API路径词典
 */
const apiRootPath = 'sms.tencentcloudapi.com'
const apiPathDict = {
  sendOne: apiRootPath
}

/**
 * 通用后缀（签名）
 */
const msgSuffix: string = process.env.SMS_SUFFIX ?? ''

// 获取当期日期
const getDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  const year = date.getUTCFullYear()
  const month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
  const day = ('0' + date.getUTCDate()).slice(-2)

  return `${year}-${month}-${day}`
}

// 公共请求头
const commonHeaders = {
  Action: 'SendSms',
  Region: 'ap-beijing',
  Timestamp: 0, // 调用时生成Unix时间戳
  Version: '2021-01-11',
}

// 生成规范请求串
const composeCanonicalRequest = (payload): string => {
  const method = 'POST'
  const canonicalURI = '/'
  const canonicalQueryString = ''
  const canonicalHeaders = "content-type:application/json\n"
    + "host:" + apiPathDict.sendOne + "\n"
  const signedHeaders = 'content-type;host'

  const hashedRequestPayload = sha256(JSON.stringify(payload))

  let result = method + "\n" +
    canonicalURI + "\n" +
    canonicalQueryString + "\n" +
    canonicalHeaders + "\n" +
    signedHeaders + "\n" +
    hashedRequestPayload

  // console.log('composeCanonicalRequest: ', result)
  return result
}

// 生成待签名字符串
const composeStringToSign = (canonicalRequest: string): string => {
  const algorithm = "TC3-HMAC-SHA256"
  const hashedCanonicalRequest = sha256(canonicalRequest);
  const credentialScope = getDate(commonHeaders.Timestamp) + "/" + 'sms' + "/" + "tc3_request"

  const result = algorithm + "\n" +
    commonHeaders.Timestamp + "\n" +
    credentialScope + "\n" +
    hashedCanonicalRequest

  // console.log('composeStringToSign: ', result)
  return result
}

// 生成签名
const composeSign = (stringToSign: string): string => {
  const kDate = sha256Hmac(getDate(commonHeaders.Timestamp), 'TC3' + process.env.TENCENT_SECRET_KEY, null)
  const kService = sha256Hmac('sms', kDate, null)
  const kSigning = sha256Hmac('tc3_request', kService, null)

  const result = sha256Hmac(stringToSign, kSigning, 'hex')

  // console.log('composeSign: ', result)
  return result
}

// 生成鉴权头信息
const composeAuth = (payload): string => {
  const credentialScope = `${getDate(commonHeaders.Timestamp)}/sms/tc3_request`

  const canonicalRequest = composeCanonicalRequest(payload)
  const stringToSign = composeStringToSign(canonicalRequest)
  const sign = composeSign(stringToSign)

  let result = 'TC3-HMAC-SHA256 '
  result += `Credential=${process.env.TENCENT_SECRET_ID}/${credentialScope}, `
  result += `SignedHeaders=content-type;host, `
  result += `Signature=${sign}`

  // console.log('composeAuth: ', result)
  return result
}

// 生成请求头信息
const composeHeaders = (payload): any => {
  commonHeaders.Timestamp = Math.ceil(Date.now() / 1000)

  const result = {
    Authorization: composeAuth(payload),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  for (let item in commonHeaders) {
    result[`X-TC-${item}`] = commonHeaders[item]
  }

  // console.log('composeHeaders: ', result)
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
    PhoneNumberSet: [mobile],
    SmsSdkAppId: process.env.TENCENT_APP_ID,
    SignName: msgSuffix,
    TemplateId: process.env.TENCENT_TEMPLATE_ID,
    TemplateParamSet: [
      captcha
    ],
  }
  // console.log('params: ', params)

  let result: any = null

  try {
    result = await fetch(
      'https://' + apiPathDict.sendOne,
      {
        headers: composeHeaders(params),
        method: 'POST',
        body: JSON.stringify(params)
      }
    ).then(
      (res) => res.json()
    ).then(
      (data) => conclude(data)
    )
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

// 发送后回调
const conclude = (res): any => {
  // console.log('conclude: ', res)

  // 初步实现单条发送的回调处理，即仅处理SendStatusSet数组的第一条
  const data = res.Response.SendStatusSet[0]
  console.log('conclude data: ', data)

  const result = {
    succeed: data.Code === 'Ok',
    message: data.Message ?? ''
  }

  // console.log('conclude ends:', result)
  return result
}

export { sendOne }
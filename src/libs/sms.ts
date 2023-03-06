/**
 * 公共库：短信相关
 * 
 * author: Kamas Lau<kamaslau@dingtalk.com>
 */
class Validator {
  mobile = (value: string): any => {
    // 排除虚拟运营商和上网卡号段
    const reg = /^1(3\d|5[0-35-9]|7[2-8]|8\d|9[0-35-9])\d{8}$/
    const result = { valid: reg.test(value) }

    console.log('mobile: ', result)
    return result
  }
}

/**
 * 验证码短信模板
 */
const captchaTemplate = "### 是您的验证码，3分钟内有效；若非您已知、理解，且自愿、主动进行的操作导致收到此信息，请勿理会或转发。"

/**
 * 生成随机整数
 * 
 * @param min 
 * @param max 
 * @returns 
 */
const getRandomIntInclusive = (min: number = 0, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min // 含最大值，含最小值
}

/**
 * 组装验证码短信内容
 */
const composeCaptchaMsg = (): { message: string, captcha?: string } => {
  const captchaCode = getRandomIntInclusive(100000, 999999).toString()

  const message = captchaTemplate.replace("###", captchaCode)

  const result = { message, captcha: captchaCode }

  // console.log('composeCaptchaMsg result: ', result)
  return result
}

export { composeCaptchaMsg, Validator }
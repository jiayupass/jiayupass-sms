import crypto from 'node:crypto'

const sha256 = (source: string, encoding: any = 'hex'): string => {
  const hash = crypto.createHash('sha256')

  return hash.update(source).digest(encoding)
}

/**
 * 使用HMACsha256算法对密码进行加密
 *
 * @params key 加密用的密钥，留空或者设定为与密码所属数据相关的值，否则丢失后无法找回。
 *
 * https://nodejs.org/dist/latest-v19.x/docs/api/crypto.html#crypto_crypto
 */
const sha256Hmac = (source: crypto.BinaryLike, key: string = '', encoding: any = 'hex'): string => {
  const hash = crypto.createHmac('sha256', key)

  return hash.update(source).digest(encoding)
}

const base64 = (source: string): string => {
  // console.log('base64: ', source)

  const hash = Buffer.from(source).toString('base64')

  return hash
}

export { sha256, sha256Hmac, base64 }

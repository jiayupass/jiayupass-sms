/**
 * Cron Jobs
 *
 * https://www.npmjs.com/package/node-cron
 */
import nodeCron from 'node-cron'
import { getTimeString } from './utils'
import { PrismaClient } from '@prisma/client' // ORM

// 控制台输出前缀
const consolePrefix = '⏱ cron job: '

/**
  * 任务计划
  */
const plans = {
  minutely: async (): Promise<void> => {
    console.log(`${consolePrefix} minutely: `, getTimeString())

    await refreshSMSstatus()
  },
  hourly: async (): Promise<void> => {
    console.log(`${consolePrefix} hourly: `, getTimeString())
  },
  daily: async (): Promise<void> => {
    console.log(`${consolePrefix} daily: `, getTimeString())
  }
}

/**
  * 启动所有计划任务
  */
const startAll = (): void => {
  console.log('\x1b[32m%s\x1b[0m', '⏱ cron job initiated')

  try {
    nodeCron.schedule('0 * * * * *', plans.minutely)
    nodeCron.schedule('0 0 * * * *', plans.hourly)
    nodeCron.schedule('0 0 0 * * *', plans.daily)
  } catch (error) {
    console.error('startAll error: ', error)
  }
}

/**
  * TODO 更新短信状态
  *
  * 标注已过期状态
  */
const refreshSMSstatus = async (): Promise<void> => {
  console.log('updateSMSstatus: ')

  // 更新当前有效，验证码字段非空，且过期时间小于当前时间的数据行
  const filter = {
    status: 'VALID',
    captcha: { not: null },
    time_expire: { lte: Math.floor(Date.now() / 1000) }
  }

  // 目标状态
  const targetState = {
    status: 'EXPIRED'
  }

  let result
  try {
    const db = new PrismaClient()
    result = await db.sms.updateMany({
      where: filter,
      data: targetState
    })
    await db.$disconnect()
  } catch (error) {
    console.error('updateSMSstatus error: ', error)
  }

  console.log('result: ', result)
}

export default { startAll }

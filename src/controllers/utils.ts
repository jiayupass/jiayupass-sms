import { PrismaClient } from '@prisma/client' // ORM
const db = new PrismaClient()

// 默认可排序字段
const defaultSorter = { time_created: 'desc' }

// 当前客户端类型
const clientType: string = 'client'

// 所有客户端类型
const clientTypes: string[] = ['admin', 'biz', 'client']

// 所有员工角色
const stuffRoles: string[] = ['GOD', 'MANAGER', 'STUFF']

/**
 * 生成排序规则
 *
 * 根据传入的ctx.query.sorter参数结合可排序字段生成，或使用默认可排序字段
 *
 * @param sorterInput ?sorter={"time_created":"desc"}
 * @param allowedSorter
 * @returns
 */
const composeSorter = (sorterInput: string, allowedSorter: null | string[] = null): any => {
  const result = {}

  // 可排序字段名
  const allowedSorters = allowedSorter ?? Object.keys(defaultSorter)
  // console.log('allowedSorters:', allowedSorters)

  if (sorterInput.length > 0) {
    // 使用传入的排序规则进行排序
    // console.log('custom sorter:', sorterInput)

    const sorterInputs = JSON.parse(sorterInput)
    Object.keys(sorterInputs).forEach(item => {
      if (allowedSorters.includes(item)) {
        result[item] = sorterInputs[item]
      }
    })
  } else {
    // 使用默认的排序规则进行排序
    // console.log('default sorter: ', defaultSorter)

    Object.keys(defaultSorter).forEach(item => {
      result[item] = defaultSorter[item]
    })
  }

  console.log('composeSorter result: ', result)

  return result ?? {}
}

/**
 * 客户端类型核验
 *
 * @param currentType
 * @param allowedTypes
 * @returns {boolean}
 */
const clientTypeCheck = (currentType: string = clientType, allowedTypes: string[] = clientTypes): boolean => {
  console.log('clientTypeCheck: ', currentType, allowedTypes)

  return allowedTypes.includes(currentType)
}

/**
 * TODO 获取用户数据
 *
 * @param userID
 * @returns {null | boolean}
 */
const requireUser = async (userID: string | number): Promise<null | object> => {
  console.log('requireUser: ', userID)

  let result: any = null

  if (typeof userID !== 'undefined') {
    result = await db.user.findUnique({
      where: { id: +userID }
    })
  }

  return result
}

/**
 * TODO 获取员工数据
 *
 * @param userID
 * @returns {null | boolean}
 */
const requireStuff = async (userID: string | number): Promise<null | object> => {
  console.log('requireStuff: ', userID)

  return null
}

/**
 * TODO 权限检查
 *
 * @param stuff
 * @param allowedRoles
 * @returns
 */
const permissionCheck = (stuff: object, allowedRoles: string[] = stuffRoles): boolean => {
  console.log('permissionCheck: ', stuff, allowedRoles)

  return true
}

/**
 * TODO 表单字段核验
 *
 * @param payload
 * @param rules
 * @param namesToSkip
 * @returns {boolean}
 */
const namesCheck = (payload: any, rules?: object, namesToSkip?: string[]): boolean => {
  // console.log('namesCheck: ', payload, rules, namesToSkip)

  if (rules == null) return true

  // 计算待检查字段数组
  const keysToCheck: string[] = Object.keys(payload).filter(item => namesToSkip?.includes(item))

  console.log('keysToCheck: ', keysToCheck)

  // TODO 根据规则进行检查

  return true
}

export default { defaultSorter, clientTypes, stuffRoles, composeSorter, clientTypeCheck, requireUser, requireStuff, permissionCheck, namesCheck }

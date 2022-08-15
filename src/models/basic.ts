/**
 * 基础模型类
 */

 const defaultLimit = 30
 const defaultOffset = 0
 class BasicModel {
   constructor (
     modelName,
     ctx,
     limit = defaultLimit,
     offset = defaultOffset
   ) {
     this.modelName = modelName
     this.ctx = ctx
     this.limit = limit
     this.offset = offset
   }
 
   modelName: string = ''
   ctx: any = null
   limit: number
   offset: number
 
   /**
  * Get Count
  *
  * 通过get方式接收
  *
  * https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#count
  */
   count = async (filter = undefined): Promise<number> => {
     console.log('BasicModel.count: ', filter)
 
     let result = 0
 
     result = await this.ctx.db[this.modelName].count({
       where: filter
     })
 
     console.log('count result: ', result)
     return result
   }
 
   /**
  * Get List
  *
  * 通过get方式接收
  *
  * https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
  */
   findMany = async (
     filter: object | undefined = undefined,
     sorter: object | undefined = undefined,
     skip: number = this.offset,
     take: number = this.limit
   ): Promise<object[]> => {
     console.log('BasicModel.findMany: ', filter, sorter, skip, take)
 
     let result = []
 
     result = await this.ctx.db[this.modelName].findMany({
       where: filter,
       orderBy: sorter,
       skip,
       take
     })
 
     console.log('findMany result: ', result)
     return result
   }
 
   /**
  * Get Sole - By Unique Index
  *
  * 通过get方式接收
  *
  * 根据ID、unique键查找 https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique
  */
   findUnique = async (name: string, value: string): Promise<null | object> => {
     console.log('BasicModel.findUnique: ', name, value)
 
     let result = null
 
     result = await this.ctx.db[this.modelName].findUnique({
       where: { [name]: +value }
     })
 
     console.log('findUnique result: ', result)
     return result
   }
 
   /**
  * Get Sole - Pick First Matched
  *
  * 通过get方式接收
  *
  * 根据满足条件的首项 https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findfirst
  */
   findFirst = async (name: string, value: string): Promise<null | object> => {
     console.log('BasicModel.findFirst: ', name, value)
 
     let result = null
 
     result = await this.ctx.db[this.modelName].findFirst({
       where: { [name]: value }
     })
 
     console.log('findFirst result: ', result)
     return result
   }
 
   /**
  * Create One
  *
  * 通过post方式接收
  *
  * https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create
  */
   create = async (data: object): Promise<null | object> => {
     // console.log('BasicModel.create: ', data)
 
     let result = null
 
     try {
       result = await this.ctx.db[this.modelName].create({ data })
     } catch (error) {
       console.error(error)
     }
 
     // console.log('create result: ', result)
     return result
   }
 
   /**
  * TODO Create Many
  *
  * 通过post方式接收
  *
  * https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany
  */
   // createMany = async (): Promise<{ count: number }> => {
   //   console.log('BasicModel.createMany: ')
 
   // }
 
   /**
  * Update one
  *
  * 通过put方式接收
  *
  * https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update
  */
   update = async (data: object, indexName: string, indexValue: any): Promise<null | object> => {
     console.log('BasicModel.update: ', data, indexName, indexValue)
 
     let result = null
 
     try {
       result = await this.ctx.db[this.modelName].update({
         where: { [indexName]: indexValue },
         data
       })
     } catch (error) {
       console.error(error)
     }
 
     console.log('update result: ', result)
     return result
   }
 
   /**
  * TODO Update Many
  *
  * 通过put方式接收
  *
  * https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#updatemany
  */
   // updateMany = async (): Promise<{ count: number }> => {
   //   console.log('BasicModel.updateMany: ')
 
   // }
 
   /**
    * Delete one
    *
    * 通过delete方式接收
    *
    * 删除行为仅标记数据项为已删除状态，不进行逻辑/物理删除
    *
    * https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#delete
    */
   delete = async (indexName: string, indexValue: any): Promise<null | object> => {
     console.log('BasicModel.delete: ', indexName, indexValue)
 
     let result = null
 
     try {
       result = await this.ctx.db[this.modelName].delete({
         where: { [indexName]: indexValue }
       })
     } catch (error) {
       console.error(error)
     }
 
     console.log('delete result: ', result)
     return result
   }
 }
 
 /**
  * 工具方法
  */
 
 export default BasicModel
 
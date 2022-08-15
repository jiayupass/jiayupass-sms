
// 可排序字段
export interface sortableName {
  name: string // 字段名
  order?: string // 排序方式
}

// 响应体
export interface responseBody {
  apiCode?: string // API编码；仅对外开放的功能有此项
  data?: any[] | object | number | string | any // 数据体；仅请求成功时有，且必有此项
  errorCode?: string // 错误编码；请求失败时必有此项
  message?: string // 消息体；请求失败时必有此项
  sorter?: object // 排序器；请求列表时可有此项
  filter?: object // 筛选器；请求列表、计数时可有此项
  inputBody?: Object // 请求体；创建、更新等有此项
  inputQuery?: Object // 参数体；从URL中获取
}

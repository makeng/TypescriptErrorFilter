/**
 * 命名空间存储类，管理一个大对象
 */
export class StorageSpace<T = Record<string, unknown>> {
  /**
   * 存储引擎，默认使用 localStorage
   * @param spaceKey 存储空间名称
   * @param defaultValue 默认值
   * @param storage 存储引擎，默认使用 localStorage
   */
  constructor(
    private readonly spaceKey: string,
    private readonly defaultValue?: T,
    private readonly storage: Storage = localStorage,
  ) {
  }

  /**
   * 获取存储空间名称
   */
  get name(): string {
    return this.spaceKey
  }

  /**
   * 获取整个大对象
   */
  get() {
    const value = this.storage.getItem(this.spaceKey)
    const getDefaultValue = () => this.defaultValue ?? {} as T
    if (value === null) {
      return getDefaultValue()
    }
    try {
      return JSON.parse(value) as T
    } catch {
      return getDefaultValue()
    }
  }

  /**
   * 设置整个大对象
   */
  set(value: T): void {
    this.storage.setItem(this.spaceKey, JSON.stringify(value))
  }

  /**
   * 获取大对象中的某个属性
   */
  getItem<K extends keyof T>(key: K): T[K] | undefined {
    const data = this.get()
    return data[key]
  }

  /**
   * 设置大对象中的某个属性
   */
  setItem<K extends keyof T>(key: K, value: T[K]): void {
    const data = this.get()
    data[key] = value
    this.set(data)
  }

  /**
   * 删除大对象中的某个属性
   */
  remove<K extends keyof T>(key: K): void {
    const data = this.get()
    delete data[key]
    this.set(data)
  }

  /**
   * 清空整个大对象
   */
  clear(): void {
    this.storage.removeItem(this.spaceKey)
  }
}

/**
 * this.space 桥接类，提供命名空间隔离的存储功能
 */
export class StorageSpace {
  space = localStorage
  constructor(public name: string) {
  }

  /**
   * 生成带前缀的 key
   */
  private getKey(key: string): string {
    return `${this.name}:${key}`
  }

  /**
   * 获取值（自动 JSON 解析）
   */
  get<T = unknown>(key: string, defaultValue?: T): T | undefined {
    const value = this.space.getItem(this.getKey(key))
    if (value === null) {
      return defaultValue
    }
    try {
      return JSON.parse(value) as T
    } catch {
      return defaultValue
    }
  }

  /**
   * 设置值（自动 JSON 序列化）
   */
  set<T = unknown>(key: string, value: T): void {
    this.space.setItem(this.getKey(key), JSON.stringify(value))
  }

  /**
   * 获取原始字符串值
   */
  getItem(key: string) {
    return this.space.getItem(this.getKey(key))
  }

  /**
   * 设置原始字符串值
   */
  setItem(key: string, value: string): void {
    this.space.setItem(this.getKey(key), value)
  }

  /**
   * 移除指定 key
   */
  remove(key: string): void {
    this.space.removeItem(this.getKey(key))
  }

  /**
   * 清空当前空间的所有数据
   */
  clear(): void {
    const keys: string[] = []
    for (let i = 0; i < this.space.length; i++) {
      const key = this.space.key(i)
      if (key?.startsWith(`${this.name}:`)) {
        keys.push(key)
      }
    }
    keys.forEach(key => this.space.removeItem(key))
  }
}

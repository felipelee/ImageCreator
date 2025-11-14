import Dexie, { Table } from 'dexie'
import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'

class AppDatabase extends Dexie {
  brands!: Table<Brand>
  skus!: Table<SKU>

  constructor() {
    super('SocialPostGeneratorDB')
    this.version(1).stores({
      brands: '++id, name, createdAt',
      skus: '++id, brandId, name, createdAt'
    })
  }
}

export const db = new AppDatabase()


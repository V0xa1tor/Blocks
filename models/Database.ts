import Dexie, { type DexieOptions, type Table } from 'dexie';
import type { PageBlock } from './blocks/PageBlock';

export class Database extends Dexie {

  static readonly v: number = 1;

  blocks!: Table<PageBlock, string>;
  settings!: Table<Setting, string>;

  constructor(name: string, options?: DexieOptions) {
    super(name, options);
    this.version(Database.v).stores({
      blocks: "id, parentId, type, createdAt, updatedAt",
      settings: "id, group"
    });
  }
}
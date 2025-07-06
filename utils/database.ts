import Dexie, { type DexieOptions, type Table } from 'dexie';

interface Block {
  id?: number;
  name: string;
  content: string;
}

interface Setting {
  id?: number;
  name: string;
  content: string;
}

class Database extends Dexie {
  blocks!: Table<Block, number>;
  settings!: Table<Setting, number>;

  constructor(name: string, options?: DexieOptions) {
    super(name, options);
    this.version(1).stores({
      blocks: "++id, name, content",
      settings: "++id, name, content"
    });
  }
}

export type { Block, Setting };
export default Database;

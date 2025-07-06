import { defineStore } from 'pinia';
import Database, { type Block, type Setting } from '~/utils/database';

export const useDatabaseStore = defineStore('database', {
  state: () => ({
    databases: [] as Database[],
    version: 1
  }),

  actions: {
    async loadDatabases() {
      Database.getDatabaseNames().then(async names => {
        this.databases = await Promise.all(names.map(async name => {
          const db = new Database(name, { autoOpen: false });
          return db;
        }));
      });
    },

    async createDatabase(name: string) {
      const db = new Database(name, { autoOpen: false });
      await db.open();
      db.close();
    },

    // async toggleTask(id: number) {
    //   const task = this.tasks.find(t => t.id === id);
    //   if (task) {
    //     task.done = !task.done;
    //     await db.tasks.update(id, { done: task.done });
    //   }
    // },

    // async deleteTask(id: number) {
    //   await db.tasks.delete(id);
    //   this.tasks = this.tasks.filter(t => t.id !== id);
    // }
  }
});

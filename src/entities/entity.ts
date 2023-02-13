import { DB } from 'https://deno.land/x/sqlite@v3.7.0/mod.ts';

/** Entity */
export class Entity {
  /** DB File Path */
  private dbFilePath: string = 'self-shumai.sqlite.db';
  
  /**
   * Create Connection
   * 
   * @return DB
   */
  public createConnection(): DB {
    return new DB(this.dbFilePath);
  }
  
  /**
   * Close Connection
   * 
   * @param db DB
   */
  public closeConnection(db: DB): void {
    db.close(true);
  }
  
  /**
   * Initialize Database
   * 
   * @throws SQL Error
   */
  public initialize(): void {
    const db = this.createConnection();
    try {
      db.query('CREATE TABLE IF NOT EXISTS inputs  (text TEXT PRIMARY KEY, created_at INTEGER)');
      db.query('CREATE TABLE IF NOT EXISTS outputs (text TEXT PRIMARY KEY, created_at INTEGER)');
      console.log('Entity#initialize() : Succeeded');
    }
    finally {
      this.closeConnection(db);
    }
  }
}

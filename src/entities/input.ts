import { Entity } from './entity.ts';

/** Input Entity */
export class InputEntity extends Entity {
  /** Max Records */
  private maxRecords: number = 1000;
  
  /**
   * Save All Texts
   * 
   * @param texts Texts To Save
   * @throws SQL Error (Exclude Unique Constraint)
   */
  public saveAll(texts: Array<string>): void {
    const db = this.createConnection();
    try {
      let inserted = 0;
      for(const text of texts) {
        try {
          db.query('INSERT INTO inputs (text, created_at) VALUES(?, ?)', [text, Date.now()]);
          inserted++;
        }
        catch(error) {
          if(error.code !== 19) throw error;  // `SqliteError: UNIQUE constraint failed`
        }
      }
      console.log(`InputEntity#saveAll() : Succeeded [${inserted} of ${texts.length}]`);
    }
    finally {
      this.closeConnection(db);
    }
  }
  
  /** Remove Old Texts */
  public removeOlds(): void {
    const db = this.createConnection();
    try {
      const countRow = db.query<[number]>('SELECT COUNT(*) FROM inputs');
      const count = countRow.flat()[0];
      console.log(`InputEntity#removeOlds() : Count [${count}] Max [${this.maxRecords}]`);
      if(count <= this.maxRecords) return console.log('InputEntity#removeOlds() : Do Nothing');
      const targetRowCount = count - this.maxRecords;
      db.query('DELETE FROM inputs WHERE created_at IN (SELECT created_at FROM inputs ORDER BY created_at ASC LIMIT :targetRowCount)', { targetRowCount });
      const afterCountRow = db.query<[number]>('SELECT COUNT(*) FROM inputs');
      const afterCount = afterCountRow.flat()[0];
      console.log(`InputEntity#removeOlds() : Removed [${targetRowCount}] Records [${afterCount}]`);
    }
    catch(error) {
      console.warn(`InputEntity#removeOlds() : Failed To Remove [${error}]`);
    }
    finally {
      this.closeConnection(db);
    }
  }
  
  /**
   * Find All Texts
   * 
   * @return All Texts
   * @throws SQL Error, No Records
   */
  public findAll(): Array<string> {
    const db = this.createConnection();
    try {
      const textRows = db.query<[string]>('SELECT text FROM inputs');
      if(textRows.length === 0) throw new Error('inputs Table Has No Records');
      const texts = textRows.flat();
      console.log(`InputEntity#findAll() : [${texts.length}]`);
      return texts;
    }
    finally {
      this.closeConnection(db);
    }
  }
}

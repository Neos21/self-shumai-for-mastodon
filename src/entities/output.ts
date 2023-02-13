import { Entity } from './entity.ts';

/** Output Entity */
export class OutputEntity extends Entity {
  /** Max Records */
  private maxRecords: number = 100;
  
  /**
   * Save Text
   * 
   * @param text Text
   * @throws SQL Error
   */
  public save(text: string): void {
    const db = this.createConnection();
    try {
      db.query('INSERT INTO outputs (text, created_at) VALUES(?, ?)', [text, Date.now()]);
      console.log('OutputEntity#save() : Succeeded');
    }
    finally {
      this.closeConnection(db);
    }
  }
  
  /** Remove Old Texts */
  public removeOlds(): void {
    const db = this.createConnection();
    try {
      const countRow = db.query<[number]>('SELECT COUNT(*) FROM outputs');
      const count = countRow.flat()[0];
      console.log(`OutputEntity#removeOlds() : Count [${count}] Max [${this.maxRecords}]`);
      if(count <= this.maxRecords) return console.log('OutputEntity#removeOlds() : Do Nothing');
      const targetRowCount = count - this.maxRecords;
      db.query('DELETE FROM outputs WHERE created_at IN (SELECT created_at FROM outputs ORDER BY created_at ASC LIMIT :targetRowCount)', { targetRowCount });
      const afterCountRow = db.query<[number]>('SELECT COUNT(*) FROM outputs');
      const afterCount = afterCountRow.flat()[0];
      console.log(`OutputEntity#removeOlds() : Removed [${targetRowCount}] Records [${afterCount}]`);
    }
    catch(error) {
      console.warn(`OutputEntity#removeOlds() : Failed To Remove [${error}]`);
    }
    finally {
      this.closeConnection(db);
    }
  }
  
  /**
   * Find One Text By Random
   * 
   * @return Text
   * @throws SQL Error, No Records
   */
  public findOneByRandom(): string {
    const db = this.createConnection();
    try {
      const textRows = db.query<[string]>('SELECT text FROM outputs');
      if(textRows.length === 0) throw new Error('outputs Table Has No Records');
      const texts = textRows.flat();
      const randomIndex = Math.floor(Math.random() * texts.length);
      const text = texts[randomIndex];
      console.log(`OutputEntity#findOneByRandom() : [${text}]`);
      return text;
    }
    finally {
      this.closeConnection(db);
    }
  }
  
  /**
   * Remove One By Text
   * 
   * @param text Text
   */
  public removeOneByText(text: string): void {
    const db = this.createConnection();
    try {
      const beforeCountRow = db.query<[number]>('SELECT COUNT(*) FROM outputs');
      const beforeCount = beforeCountRow.flat()[0];
      db.query('DELETE FROM outputs WHERE text = :text', { text });
      const afterCountRow = db.query<[number]>('SELECT COUNT(*) FROM outputs');
      const afterCount = afterCountRow.flat()[0];
      console.log(`OutputEntity#removeOneByText() : Removed [${beforeCount - afterCount}] Records [${afterCount}]`);
    }
    catch(error) {
      console.warn(`OutputEntity#removeOneByText() : Failed To Remove [${error}]`);
    }
    finally {
      this.closeConnection(db);
    }
  }
}

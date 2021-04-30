import mysql from 'mysql';
export class MysqlClient {
  private static _pool: mysql.Pool | null;
  private static _config = {
    host: 'localhost',
    port: 3306,
    username: 'admin',
    password: 'admin',
    database: 'noix'
  };
  public static InitServer(
    host: string,
    port: number,
    username: string,
    password: string,
    database: string
  ) {
    this._config.database = database;
    this._config.host = host;
    this._config.password = password;
    this._config.port = port;
    this._config.username = username;
  }
  public static Connect() {
    MysqlClient._pool = mysql.createPool({
      port: this._config.port,
      host: this._config.host,
      user: this._config.username,
      password: this._config.password,
      database: this._config.database
    });
  }
  public static async ResetDatabase() {
    return new Promise<void>((resolve, reject) => {
      this.Release();
      const pool = mysql.createPool({
        user: this._config.username,
        host: this._config.host,
        port: this._config.port,
        password: this._config.password
      });
      pool.getConnection((err, conQuery) => {
        if (err) {
          reject(err);
        }
        conQuery.query(
          `select * 
        from information_schema.SCHEMATA 
        where SCHEMA_NAME = 'noix'; `,
          (err, res) => {
            conQuery.release();
            if (res && res.length) {
              pool.getConnection((err, con) => {
                if (err) {
                  reject(err);
                }
                con.query(`drop database ${this._config.database};`, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    con.release();
                    pool.getConnection((err, conCreate) => {
                      if (err) {
                        reject(err);
                      } else {
                        conCreate.query(
                          `create database ${this._config.database};`,
                          (err) => {
                            if (err) {
                              reject(err);
                            } else {
                              conCreate.release();
                              pool.end();
                              this.Connect();
                              resolve();
                            }
                          }
                        );
                      }
                    });
                  }
                });
              });
            } else {
              pool.getConnection((err, conCreate) => {
                if (err) {
                  reject(err);
                }
                conCreate.query(
                  `create database ${this._config.database};`,
                  (err) => {
                    if (err) {
                      reject(err);
                    } else {
                      conCreate.release();
                      pool.end();
                      this.Connect();
                      resolve();
                    }
                  }
                );
              });
            }
          }
        );
      });
    });
  }

  public static async Query(sql: string) {
    return new Promise((resolve, reject) =>
      MysqlClient._pool
        ? MysqlClient._pool.getConnection((err, conn) => {
            if (err) {
              reject(err);
            } else {
              conn.query(sql, (err, res) => {
                conn.release();
                if (err) {
                  reject(err);
                } else {
                  resolve(res);
                }
              });
            }
          })
        : reject('uninitialize pool')
    );
  }

  public static Release() {
    this._pool && this._pool.end();
    this._pool = null;
  }
}

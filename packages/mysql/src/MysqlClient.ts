import mysql from 'mysql';
export class MysqlClient {
  private static _pool: mysql.Pool;
  public static ConnectToServer(
    host: string,
    port: number,
    username: string,
    password: string,
    database: string
  ) {
    MysqlClient._pool = mysql.createPool({
      port,
      host,
      user: username,
      password,
      database
    });
  }

  public static async query(sql: string) {
    return new Promise((resolve, reject) =>
      MysqlClient._pool.getConnection((err, conn) => {
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
    );
  }
}

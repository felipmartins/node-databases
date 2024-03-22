const pg = require("pg");

async function poolFunction() {
  const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "maxcoin",
    password: "password",
    port: 5432,
  });

  return pool.query("SELECT NOW()");
}

poolFunction()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.error(err));

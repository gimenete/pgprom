# pgprom

Easiest and safest way to use postgres abusing template strings

This is a tiny library that uses `pg` under the hood. The aim of this library is to create the easiest and safest way to run queries abusing the new template strings available in ES2015. Template strings can be tagged and the tagging function is responsible of concatenating the raw portions of the string with the interpolated values and it can also return anything, not only strings. `pgprom` uses these two capabilities to:

* Automatically build a SQL with all the interpolated values replaced with placeholders and thus avoiding any SQL injection
* Return a promise that will contain the query result

# Installing

```bash
npm install pgprom --save
```

# Usage

## Instantiating

```javascript
const sql = require('pgprom')(process.env.DATABASE_URL)
```

## query()

This method returns all the information provided by `pg` when running SQL.

```javascript
const status = 'open'
const interval = '1 year'
sql.query`SELECT * FROM issues WHERE status=${status} AND created_at > NOW() interval ${interval}`
  .then((result) => {
    console.log('rows', result.rows)
    console.log('rowCount', result.rowCount)
    // etc.
  })
```

## find()

This method is like `.query()` but it only returns the array of rows.

```javascript
const status = 'open'
const interval = '1 year'
sql.find`SELECT * FROM issues WHERE status=${status} AND created_at > NOW() interval ${interval}`
  .then((rows) => {
    console.log('rows', rows)
  })
```

## findOne()

This method is like `.find()` but it only returns the first returned row.

```javascript
const status = 'open'
const interval = '1 year'
sql.findOne`SELECT * FROM issues WHERE status=${status} AND created_at > NOW() interval ${interval} ORDER BY created_at ASC LIMIT 1`
  .then((row) => {
    console.log('row', row)
  })
```

## execute()

This method executes the SQL and returns the number of affected rows.

```javascript
const date = ...
sql.execute`DELETE FROM issues WHERE created_at < ${date}`
  .then((rowCount) => {
    console.log('affected rows', rowCount)
  })
```

# Caveat

This idea doesn't work well with dynamic queries because it will escape all the interpolated values. Example:

```javascript
const func = something ? 'NOW' : 'VERSION'
sql.findOne`SELECT ${func}()`
```

This doesn't work because the function name will be escaped.

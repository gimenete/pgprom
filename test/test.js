var assert = require('assert')

const sql = require('../')(process.env.DATABASE_URL)
const one = 1
const two = 'two'
const three = ['three', '3', 'tres']
const func = 'NOW'

describe('pgprom', () => {

  it('#query', () => {
    return sql.query`SELECT ${sql.raw(func)}() as now, ${one}::int as one, ${two}::text as two, ARRAY[${three}] as three`
      .then((result) => {
        assert.ok(result.rows[0].now)
        assert.deepEqual(result.rows[0].one, one)
        assert.deepEqual(result.rows[0].two, two)
        assert.deepEqual(result.rows[0].three, three)
      })
  })

  it('#find', () => {
    return sql.find`SELECT ${sql.raw(func)}() as now, ${one}::int as one, ${two}::text as two, ARRAY[${three}] as three`
      .then((rows) => {
        assert.ok(rows[0].now)
        assert.deepEqual(rows[0].one, 1)
        assert.deepEqual(rows[0].two, two)
        assert.deepEqual(rows[0].three, three)
      })
  })

  it('#findOne', () => {
    return sql.findOne`SELECT ${sql.raw(func)}() as now, ${one}::int as one, ${two}::text as two, ARRAY[${three}] as three`
      .then((row) => {
        assert.ok(row.now)
        assert.deepEqual(row.one, 1)
        assert.deepEqual(row.two, two)
        assert.deepEqual(row.three, three)
      })
  })

  it('#execute', () => {
    return Promise.resolve()
      .then(() => (
        sql.query`
          DROP TABLE IF EXISTS products;
          CREATE TABLE products (
            product_no integer,
            name text,
            price numeric
          )`
      ))
      .then(() => (
        sql.execute`
          INSERT INTO products (product_no, name, price) VALUES
            (1, 'Cheese', 9.99),
            (2, 'Bread', 1.99),
            (3, 'Milk', 2.99)`
      ))
      .then((rowCount) => (
        assert.equal(rowCount, 3)
      ))
  })

  it('should test a failed SQL', (done) => {
    sql.query`SELECT foobar()`
      .then((result) => {
        throw new Error('It should not succeed')
      })
      .catch((err) => {
        assert.ok(err)
        done()
      })
  })

  it('should test a fail connecting', (done) => {
    const conn = require('../')('wrong-connection-string')
    conn.query`SELECT 1`
      .then((result) => {
        throw new Error('It should not succeed')
      })
      .catch((err) => {
        assert.ok(err)
        done()
      })
  })

})

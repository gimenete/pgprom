'use strict'

var pg = require('pg')

module.exports = function(conString) {

  return {
    query(strings) {
      var sql = ''
      var params = []
      for (var i = 0; i < strings.length-1; i++) {
        let value = arguments[i+1]
        sql += strings[i]
        if (Array.isArray(value)) {
          for (var i = 0; i < value.length; i++) {
            params.push(value[i])
            if (i > 0) sql+=','
            sql += '$'+params.length
          }
        } else {
          params.push(value)
          sql += '$'+params.length
        }
      }
      sql += strings[strings.length-1]

      return new Promise((resolve, reject) => {
        pg.connect(conString, (err, client, done) => {
          if (err) return reject(err)
          client.query(sql, params, (err, result) => {
            done()
            if (err) return reject(err)
            resolve(result)
          })
        })
      })
    },
    find() {
      return this.query.apply(this, arguments)
        .then((result) => result.rows)
    },
    findOne() {
      return this.query.apply(this, arguments)
        .then((result) => result.rows[0])
    },
    execute() {
      return this.query.apply(this, arguments)
        .then((result) => result.rowCount)
    }
  }
}

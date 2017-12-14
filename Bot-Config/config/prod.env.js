'use strict'
module.exports = {
  NODE_ENV: '"production"',
  HOST: process.env.HOST ? `"${process.env.HOST}"` : '"localhost"'
}

'use strict'

const { CodedError } = require('@ballistagroup/error-support')

module.exports = {
  TreeCircularityError: CodedError({ name: 'TreeCircularityError' })
}

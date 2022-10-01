'use strict'

const { Trait } = require('@ballistagroup/mutrait')
const property = require('@northscaler/property-decorator')

/**
 * Imparts a `name` property with backing property `_name`.
 */
const Nameable = Trait(superclass =>
  class extends superclass {
    @property()
    _name
  }
)

module.exports = Nameable

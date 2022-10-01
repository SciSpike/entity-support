const Identifiable = require('./Identifiable')
const { Trait, superclass } = require('@ballistagroup/mutrait')
const { IllegalArgumentError } = require('@ballistagroup/error-support')

/**
 * Imparts an `id` property with backing property `_id` that is an unsigned integer.
 */
const IdentifiableByInteger = Trait(sup =>
  class extends superclass(sup).expressing(Identifiable) {
    _testSetId (id) {
      super._testSetId(id)

      const n = parseInt(id)
      if (isNaN(n) || n <= 0 || n !== parseFloat(id)) { throw new IllegalArgumentError({ info: { id } }) }
      return n
    }
  }
)

module.exports = IdentifiableByInteger

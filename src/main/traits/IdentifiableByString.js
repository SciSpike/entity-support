const Identifiable = require('./Identifiable')
const { Trait, superclass } = require('@ballistagroup/mutrait')

/**
 * Imparts an `id` property with backing property `_id` that is an unsigned integer.
 */
const IdentifiableByString = Trait(sup =>
  class extends superclass(sup).expressing(Identifiable) {
    _testSetId (id) {
      super._testSetId(id)
      return id.toString()
    }
  }
)

module.exports = IdentifiableByString

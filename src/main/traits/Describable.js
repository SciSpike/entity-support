const { Trait } = require('@ballistagroup/mutrait')
const property = require('@northscaler/property-decorator')

/**
 * Imparts a `description` property with backing property `_description`.
 */
const Describable = Trait(superclass =>
  class extends superclass {
    @property()
    _description
  }
)

module.exports = Describable

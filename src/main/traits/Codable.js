const { Trait } = require('@ballistagroup/mutrait')
const property = require('@northscaler/property-decorator')

/**
 * Imparts a `code` property with backing property `_code`.
 */
const Codable = Trait(superclass =>
  class extends superclass {
    @property()
    _code
  }
)

module.exports = Codable

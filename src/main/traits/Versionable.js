const { Trait } = require('@ballistagroup/mutrait')
const property = require('@northscaler/property-decorator')

/**
 * Imparts a `version` property with backing property `_version`.
 */
const Versionable = Trait(
  superclass =>
    class extends superclass {
      @property()
      _version
    }
)

module.exports = Versionable

const { Trait } = require('@ballistagroup/mutrait')
const property = require('@northscaler/property-decorator')
const semver = require('semver')
const { IllegalArgumentError } = require('@ballistagroup/error-support')

/**
 * Imparts a `semver` property with backing property `_semver`.
 */
const SemanticallyVersionable = Trait(
  superclass =>
    class extends superclass {
      @property()
      _semver

      _testSetSemver (version) {
        if (!semver.valid(version)) {
          throw new IllegalArgumentError({ message: `invalid semver ${version}`, info: { semver: version } })
        }
        return semver.clean(version)
      }

      _semverComparator () {
        return (thiz, that) => semver.compare(thiz.semver, that.semver)
      }

      _compareSemverTo (version) {
        return semver.compare(this.semver, version)
      }

      _semverGt (version) {
        return semver.gt(this.semver, version)
      }

      _semverLt (version) {
        return semver.lt(this.semver, version)
      }

      _semverGte (version) {
        return semver.gte(this.semver, version)
      }

      _semverLte (version) {
        return semver.lte(this.semver, version)
      }
    }
)

module.exports = SemanticallyVersionable

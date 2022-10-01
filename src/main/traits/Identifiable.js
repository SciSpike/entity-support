'use strict'

const _ = {
  isEqual: require('lodash.isequal')
}
const { Trait } = require('@ballistagroup/mutrait')
const { MissingRequiredArgumentError } = require('@ballistagroup/error-support')
const property = require('@northscaler/property-decorator')

/**
 * Imparts an `id` property with backing property `_id`.
 */
const Identifiable = Trait(superclass =>
  class extends superclass {
    @property()
    _id

    _testSetId (id) {
      if (id === null || id === undefined) { throw new MissingRequiredArgumentError({ message: 'id' }) }
      return id
    }

    identifies (that) {
      if (!that || !that._id || !this._id) return false
      return _.isEqual(this._id, that._id)
    }
  }
)

module.exports = Identifiable

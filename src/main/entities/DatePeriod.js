'use strict'

const moment = require('moment-timezone')
const Period = require('./Period')
const TimeUnit = require('../enums/TimeUnit')
const { IllegalArgumentError } = require('@ballistagroup/error-support')

/**
 * @deprecated Use https://moment.github.io/luxon/docs/class/src/interval.js~Interval.html if you can.
 */
class DatePeriod extends Period {
  static beginningAtWithDays (begin, days) {
    return new DatePeriod(
      begin.clone(),
      begin.clone().add(days, TimeUnit.DAY.key)
    )
  }

  constructor (begin, end) {
    super(...arguments)
    this.begin = begin
    this.end = end
  }

  _testSetBegin (value) {
    if (!value) return value
    value = moment.utc(value)
    DatePeriod._checkGranularity(value)
    if (!value.isValid() || this._end?.isBefore(value)) { throw new IllegalArgumentError(`value:${value}`) }
    return value
  }

  _testSetEnd (value) {
    if (!value) return value
    value = moment.utc(value)
    DatePeriod._checkGranularity(value)
    if (!value.isValid() || this._begin?.isAfter(value)) { throw new IllegalArgumentError(`value:${value}`) }
    return value
  }

  static _checkGranularity (value) {
    if (value.valueOf() !== moment.utc({ year: value.year(), month: value.month(), date: value.date() }).valueOf()) {
      throw new IllegalArgumentError({ message: 'value', info: { value } })
    }
  }
}

module.exports = DatePeriod

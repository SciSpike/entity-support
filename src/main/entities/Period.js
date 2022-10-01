'use strict'

const moment = require('moment-timezone')
const TimeUnit = require('../enums/TimeUnit')
const { IllegalArgumentError } = require('@ballistagroup/error-support')

/**
 * @deprecated Use https://moment.github.io/luxon/docs/class/src/interval.js~Interval.html if you can.
 */
class Period {
  static beginningAtWithMinutes (begin, minutes) {
    return new Period(begin.clone(), begin.clone().add(minutes, TimeUnit.MINUTE.key))
  }

  static compare (a, b) {
    if (a._begin && !b._begin) return 1
    if (!a._begin && b._begin) return -1
    if (a._begin && b._begin) {
      if (a._begin.isBefore(b._begin)) return -1
      if (a._begin.isAfter(b._begin)) return 1
    }

    if (a._end && !b._end) return -1
    if (!a._end && b._end) return 1
    if (a._end && b._end) {
      if (a._end.isBefore(b._end)) return -1
      if (a._end.isAfter(b._end)) return 1
    }

    return 0
  }

  static equal (a, b) {
    return Period.compare(a, b) === 0
  }

  /**
   * Determines if the begin & end of {@param candidate} are within {@param container}'s begin & end.
   *
   * @param container {Period} The {@link Period} that potentially contains `candidate`.
   * @param candidate {Period|moment} The {@link Period} or `moment` that is potentially contained by {@param container}.
   * @return {*}
   */
  static contain (container, candidate) {
    if (candidate instanceof Period) return container.containsPeriod(candidate)
    if (moment.isMoment(candidate)) return container.containsMoment(candidate)
    throw new IllegalArgumentError('candidate')
  }

  /**
   * Determines if the begin or end of {@param b} are within {@param a}'s begin & end.
   *
   * @param a {Period} The {@link Period} that potentially contains `candidate`.
   * @param candidate The {@link Period} that is potentially contained by {@param a}.
   * @return {*}
   */
  static overlap (a, b) {
    return a.overlaps(b)
  }

  _begin // moment-timezone
  _end // moment-timezone

  constructor (begin, end) {
    this.begin = begin
    this.end = end
  }

  equals (that) {
    return Period.equal(this, that)
  }

  clone () {
    return new Period(this._begin.clone(), this._end.clone())
  }

  get begin () {
    return this._begin?.clone()
  }

  set begin (value) {
    this._begin = this._testSetBegin(value)
  }

  _testSetBegin (value) {
    if (!value) return value
    value = moment(value).utc()
    if (!value.isValid() || this._end?.isBefore(value)) {
      throw new IllegalArgumentError(`value: ${value}`)
    }
    return value
  }

  withBegin (value) {
    this.begin = value
    return this
  }

  get end () {
    return this._end?.clone()
  }

  set end (value) {
    this._end = this._testSetEnd(value)
  }

  _testSetEnd (value) {
    if (!value) return value
    value = moment(value).utc()
    if (!value.isValid() || this._begin?.isAfter(value)) {
      throw new IllegalArgumentError(`value: ${value}`)
    }
    return value
  }

  withEnd (value) {
    this.end = value
    return this
  }

  get length () {
    if (!this._begin || !this._end) return -1
    return this._end.valueOf() - this._begin.valueOf()
  }

  /**
   * Determines whether this {@link Period} begins at or before and ends at or after the given {@link Period}.
   *
   * @param that
   * @return {boolean}
   */
  containsPeriod (that) {
    if (!that) throw new IllegalArgumentError('that')

    if (that._begin) {
      if (that._end) {
        return (
          this.containsMoment(that._begin, '[)') &&
          this.containsMoment(that._end, '(]')
        )
      }
      // else not that._end
      return this._begin.isSameOrBefore(that._begin)
    }
    // else no that._begin
    if (that._end) {
      return this._end.isSameOrAfter(that._end)
    }

    return !(this._begin || this._end) // that is "forever", so this must be too to contain that
  }

  /**
   * Determines whether the given value falls within this period, optionally with the given inclusivity.
   *
   * @param m the given `moment` instance; if `undefined`, this method returns `false`
   * @param inclusivity {string} see https://momentjs.com/docs/#/query/is-between/ for possible values; default is `[)`, meaning inclusive of begin, exclusive of end
   * @return {boolean}
   */
  containsMoment (m, inclusivity) {
    if (!moment.isMoment(m) || !m.isValid()) return false

    inclusivity = inclusivity || '[)'

    if (this._begin) {
      if (this._end) {
        return m.isBetween(this._begin, this._end, null, inclusivity)
      }
      // else no this._end
      return inclusivity.startsWith('[')
        ? m.isSameOrAfter(this._begin)
        : m.isAfter(this._begin)
    }
    // else no this._begin
    if (this._end) {
      return inclusivity.endsWith(']')
        ? m.isSameOrBefore(this._end)
        : m.isBefore(this._end)
    }
    // neither this._begin nor this._end, meaning "forever"
    return true
  }

  /**
   * Determines whether the given period overlaps, or begin & end moments overlap, this period.
   *
   * @param period {Period} The period to check.
   * @return {boolean}
   */
  overlaps (period) {
    if (this._begin) {
      if (this._end) {
        return (
          this.containsMoment(period._begin, '[)') ||
          this.containsMoment(period._end, '(]') ||
          period.containsPeriod(this)
        )
      }
      // else no this._end
      return !period._end || this._begin.isSameOrBefore(period._begin)
    }
    // else no this._begin
    if (this._end) {
      return !period._begin || this._end.isSameOrAfter(period._end)
    }

    return true // forever overlaps everything
  }

  compareTo (that) {
    return Period.compare(this, that)
  }

  toString () {
    return `${this._begin ? this._begin.toISOString() : '-∞'},${
      this._end ? this._end.toISOString() : '+∞'
    }`
  }
}

module.exports = Period

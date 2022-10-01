'use strict'

const Enumeration = require('@ballistagroup/enum-support')

const MILLISECOND = 1
const SECOND = MILLISECOND * 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7
const MONTH = DAY * 30 // approximate
const QUARTER = DAY * 90 // approximate
const YEAR = DAY * 365 // approximate

const TimeUnit = Enumeration.new({
  name: 'TimeUnit',
  values: {
    YEAR: {
      get key () {
        return 'y'
      },
      get ms () {
        return YEAR
      }
    },
    QUARTER: {
      get key () {
        return 'Q'
      },
      get ms () {
        return QUARTER
      }
    },
    MONTH: {
      get key () {
        return 'M'
      },
      get ms () {
        return MONTH
      }
    },
    WEEK: {
      get key () {
        return 'w'
      },
      get ms () {
        return WEEK
      }
    },
    DAY: {
      get key () {
        return 'd'
      },
      get ms () {
        return DAY
      }
    },
    HOUR: {
      get key () {
        return 'h'
      },
      get ms () {
        return HOUR
      }
    },
    MINUTE: {
      get key () {
        return 'm'
      },
      get ms () {
        return MINUTE
      }
    },
    SECOND: {
      get key () {
        return 's'
      },
      get ms () {
        return SECOND
      }
    },
    MILLISECOND: {
      get key () {
        return 'ms'
      },
      get ms () {
        return MILLISECOND
      }
    }
  }
})

module.exports = TimeUnit

'use strict'

const property = require('@northscaler/property-decorator')
const { IllegalArgumentError, MissingRequiredArgumentError, MethodNotImplementedError } = require('@ballistagroup/error-support')
const CardinalDirection = require('../enums/CardinalDirection')

class Parallel {
  @property()
  _degrees

  @property()
  _max

  constructor (degrees, max = 180) {
    this.degrees = degrees
    this.max = max
  }

  get minutes () {
    return Math.abs((this.degrees - parseInt(this.degrees)) * 60)
  }

  get seconds () {
    const minutes = this.minutes
    return Math.abs((minutes - parseInt(minutes)) * 60)
  }

  get direction () {
    throw new MethodNotImplementedError({ info: 'get direction' })
  }

  _testSetDegrees (degrees) {
    degrees = parseFloat(degrees)
    if (isNaN(degrees) || degrees < -this.max || degrees > this.max) {
      throw new IllegalArgumentError({
        info: 'degrees',
        message: `only between -${this.max} and ${this.max} inclusive allowed`
      })
    }
    return degrees
  }

  toString (format) {
    switch ((format || '').toString().trim().toLowerCase()) {
      case 'dd': // unsigned degrees plus direction
        return `${Math.abs(this.degrees)}\xB0${this.direction.name}`
      case 'd': // signed decimal degrees
        return `${this.degrees}\xB0`
      case 'dms': // signed degrees, minute, seconds
        return `${this.degrees}\xB0${parseInt(this.minutes)}'${this.seconds}"`
      default:
        // unsigned degrees, minutes, seconds plus direction
        return `${Math.abs(this.degrees)}\xB0${parseInt(this.minutes)}'${this.seconds}"${this.direction.name}`
    }
  }

  clone () {
    return new Parallel(this._degrees, this._max)
  }
}

class Longitude extends Parallel {
  get direction () {
    return this.degrees >= 0 ? CardinalDirection.E : CardinalDirection.W
  }
}

class Latitude extends Parallel {
  get direction () {
    return this.degrees >= 0 ? CardinalDirection.N : CardinalDirection.S
  }
}

class Gps {
  @property()
  _lat

  @property()
  _lon

  constructor ({ lat, lon }) {
    this.lat = typeof lat === 'number' ? new Latitude(lat) : lat
    this.lon = typeof lon === 'number' ? new Longitude(lon) : lon
  }

  _testSetLat (lat) {
    lat = typeof lat === 'number' ? new Latitude(lat) : lat
    return lat
  }

  _testSetLon (lon) {
    lon = typeof lon === 'number' ? new Longitude(lon) : lon
    return lon
  }

  toString (format) {
    return `${this.lat.toString(format)} ${this.lon.toString(format)}`
  }

  clone () {
    return new Gps({ lat: this._lat.clone(), lon: this._lon.clone() })
  }
}

class StreetAddress {
  // inspired by https://stackoverflow.com/questions/1159756/how-should-international-geographical-addresses-be-stored-in-a-relational-databa

  @property()
  _streetNumber // 123, ...

  @property()
  _buildingName // some addresses have building names instead of street numbers

  @property()
  _streetNumberSuffix // A, ½, ...

  @property()
  _streetNameDirectionPrefix // N, SW, ...

  @property()
  _streetName // Mulberry, ...

  @property()
  _streetNameDirectionSuffix // N, SW, ...

  @property()
  _streetType // boulevard, street, place, lane, ...

  @property()
  _streetTypeDirectionSuffix // N, SW, ...

  @property()
  _compartmentType // po box, apartment, floor, suite, ...

  @property()
  _compartmentId // 123, 1A, ...

  @property()
  _localMunicipality // if it appears in address before the city

  @property()
  _city // Metroville, ...

  @property()
  _governingDistrict // state in US, province in CA, distrito federal in MX, ...

  @property()
  _postalCode // 34213 in US, ...

  @property()
  _postalCodeSuffixSeparator

  @property()
  _postalCodeSuffix // US plus-four, ...

  @property()
  _country // US, CA, MX, ...

  clone () {
    return Object.keys(this).reduce((it, key) => {
      it[key] = this[key]
      return it
    }, Object.create({}, Object.getPrototypeOf(this)))
  }
}

class UsStreetAddress extends StreetAddress {
  constructor ({
    streetNumber, // 123
    streetNumberSuffix, // A, ½, ...
    streetNameDirectionPrefix, // N, SW, ...
    streetName, // Mulberry
    streetNameDirectionSuffix, // N, SW, ...
    streetType, // St, Ave, Blvd, ...
    streetTypeDirectionSuffix, // N, SW, ...
    compartmentType, // Suite, Apartment, ...
    compartmentId, // 1A, 200, ...
    city, // Austin
    state, // TX
    zip, // 12345
    zipPlus4 // 4321
  }) {
    super()

    this.streetNumber = streetNumber
    this.streetNameDirectionPrefix = streetNameDirectionPrefix
    this.streetNumberSuffix = streetNumberSuffix
    this.streetName = streetName
    this.streetNameDirectionSuffix = streetNameDirectionSuffix
    this.streetType = streetType
    this.streetTypeDirectionSuffix = streetTypeDirectionSuffix
    this.compartmentType = compartmentType
    this.compartmentId = compartmentId
    this.city = city
    this.governingDistrict = state
    this.postalCode = zip
    this.postalCodeSuffix = zipPlus4
    this.country = 'US'
    this.postalCodeSuffixSeparator = '-'
  }

  _testSetStreetNumber (it) {
    if (!it) throw new MissingRequiredArgumentError({ info: 'streetNumber' })
    return it
  }

  _testSetStreetName (it) {
    if (!it) throw new MissingRequiredArgumentError({ info: 'streetName' })
    return it
  }

  _testSetCity (it) {
    if (!it) throw new MissingRequiredArgumentError({ info: 'city' })
    return it
  }

  _testSetGoverningDistrict (it) {
    const rx = /^[A-Z]{2}$/
    if (!it) throw new MissingRequiredArgumentError({ info: 'state' })
    if (!rx.test('' + it)) {
      throw new IllegalArgumentError({ info: 'state', message: `must be ${rx}` })
    }
    return it
  }

  _testSetPostalCode (it) {
    const rx = /^[0-9]{5}$/
    if (!it) throw new MissingRequiredArgumentError({ info: 'zip' })
    if (!rx.test(it)) {
      throw new IllegalArgumentError({ info: 'zip', message: `must be ${rx}` })
    }
    return it
  }

  _testSetPostalCodeSuffix (it) {
    const rx = /^[0-9]{4}$/
    if (it && !rx.test(it)) {
      throw new IllegalArgumentError({ info: 'zipPlus4', message: `must be ${rx}` })
    }
    return it
  }

  _testDirection (it, property) {
    const rx = /^(N|S|E|W|NW|NE|SW|SE)$/
    if (!it) return it
    if (!rx.test(it)) { throw new IllegalArgumentError({ info: property, message: `must be ${rx}` }) }
  }

  _testSetStreetNameDirectionPrefix (it) {
    this._testDirection(it, 'streetNameDirectionPrefix')
    return it
  }

  _testSetStreetNameDirectionSuffix (it) {
    this._testDirection(it, 'streetNameDirectionSuffix')
    return it
  }

  _testSetStreetTypeDirectionSuffix (it) {
    this._testDirection(it, 'streetTypeDirectionSuffix')
    return it
  }

  toString ({
    lineSeparator = '\n',
    compartmentSeparator = ', ',
    cityStateSeparator = ', ',
    stateZipSeparator = ' '
  } = {}) {
    let it = `${this.streetNumber}`
    if (this.streetNumberSuffix) it += this.streetNumberSuffix
    if (this.streetNameDirectionPrefix) it += ` ${this.streetNameDirectionPrefix}`
    it += ` ${this.streetName}`
    if (this.streetNameDirectionSuffix) it += ` ${this.streetNameDirectionSuffix}`
    if (this.streetType) it += ` ${this.streetType}`
    if (this.streetTypeDirectionSuffix) { it += ` ${this.streetTypeDirectionSuffix}` }
    if (this.compartmentType) { it += `${compartmentSeparator}${this.compartmentType} ${this.compartmentId}` }
    it += lineSeparator
    it += `${this.city}${cityStateSeparator}${this.governingDistrict}${stateZipSeparator}${this.postalCode}`
    if (this.postalCodeSuffix) { it += `${this.postalCodeSuffixSeparator}${this.postalCodeSuffix}` }

    return it
  }
}

module.exports = {
  Longitude,
  Latitude,
  Gps,
  StreetAddress,
  UsStreetAddress,
  Parallel
}

import dbquery from "./dbquery.mjs"

export default class extends dbquery {
  constructor() {
    super()
  }

  _deschema() {
    return {
      id        : null,
      lid       : null,
      did       : null,
      start     : null,
      end       : null,
      status    : null,
      create    : null,
      modified  : null
    }
  }

  Schema() {
    const now     = this._now()
    const data    = this._deschema()
    data.id       = this._id()
    data.create   = now
    data.modified = now
    return data
  }

}


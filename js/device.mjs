import dbquery from "./dbquery.mjs"

export default class extends dbquery {
  constructor() {
    super()
  }

  _deschema() {
    return {
      id        : null,
      uid       : null,
      lid       : null,
      type      : null,
      btu       : null,
      coolant   : null,
      name      : null,
      detail    : null,
      last      : null,
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


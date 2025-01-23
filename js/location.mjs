import dbquery from "./dbquery.mjs"

export default class extends dbquery {
  constructor() {
    super()
  }

  _deschema() {
    return {
      id        : null,
      place     : null,
      number    : null,
      detail    : null,
      phone     : null,
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


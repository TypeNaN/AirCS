export default class {
  constructor() {
    this._r   = null
    this._rw  = null
  }

  _id() {
    const timestamp = Math.floor(Date.now() / 1000).toString(16) // 4 bytes
    const machineIdentifier = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0') // 3 bytes
    const processIdentifier = Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0') // 2 bytes
    const counter = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0') // 3 bytes
    return timestamp + machineIdentifier + processIdentifier + counter
  }

  _now() {
    const date = new Date()
    const bangkokOffset = 1000 * 60 * 60 * 7
    const localTime = new Date(date.getTime() + bangkokOffset)
    return localTime.toISOString()
  }

  async Store(db, store) {
    this._r   = await db.R(store)
    this._rw  = await db.RW(store)
  }

  async Put(data) {
    data.modified = this._now()
    return await this._rw.Put(data)
  }
  async Add(data) { return await this._rw.Add(data) }
  async Delete(value) { return await this._rw.Delete(value) }
  async Clear(store) { return await this._rw.Clear(store) }

  async GetFrom(index, value, sort) { return await this._r.GetFrom(index, value, sort) }
  async GetBy(value) { return await this._r.GetBy(value) }
  async Get(sort) { return await this._r.Get(sort) }

  async GetOnceFrom(index, value, sort) {
    const data = await this._r.GetFrom(index, value, sort)
    if (data.length > 0) { return data[0] }
    return
  }

  async GetOnce(sort) {
    const data = await this._r.Get(sort)
    if (data.length > 0) { return data[0] }
    return
  }
}

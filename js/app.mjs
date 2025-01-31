import DB       from './db.mjs'
import SPA      from './spa.mjs'
import ACCOUNT  from './account.mjs'
import LOCATION from './location.mjs'
import DEVICE   from './device.mjs'
import BOOKING  from './booking.mjs'


import Landing      from './page/landing.mjs'
//import Test         from './page/test.mjs'
import Place        from './page/place.mjs'
import PlaceAdd     from './page/placeadd.mjs'
import Air          from './page/air.mjs'
import AirAdd       from './page/airadd.mjs'
import Reservation  from './page/reservation.mjs'
import page404      from './page/404.mjs'


class App {
  constructor() {
    this.name = 'AirCS'

    this.base = `/${this.name}`

    this.apis = {
      v1: {
        github: 'https://679cc8d658c2c3055bbd7cbc--aircs.netlify.app/.netlify/functions/v1'
      }
    }

    this.dbName = this.name
    this.dbStores = [
      { key: 'account'    , option: { keyPath: 'id' }},
      { key: 'location'   , option: { keyPath: 'id' }},
      { key: 'device'     , option: { keyPath: 'id' }, indexes: [
        { name: 'location', keyPath: 'lid', option: { unique: false }},
      ]},
      { key: 'booking'  , option: { keyPath: 'id' } , indexes: [
        { name: 'did'   , keyPath: 'did'            , option: { unique: true }},
        { name: 'start' , keyPath: 'start.dateTime' , option: { unique: true }},
      ]},
    ]
  }

  async init({ api, host }) {

    this.api_root = this.apis[api][host] || ''

    this.DB       = new DB(this.dbName, this.dbStores)
    this.Account  = new ACCOUNT(this.api_root)
    this.Location = new LOCATION()
    this.Device   = new DEVICE()
    this.Booking  = new BOOKING()

    await this.DB.Open()
    await this.Account.Store  ( this.DB, 'account'  )
    await this.Location.Store ( this.DB, 'location' )
    await this.Device.Store   ( this.DB, 'device'   )
    await this.Booking.Store  ( this.DB, 'booking'  )


    this.SPA    = new SPA()
    this.routes = {
      Landing     : new Landing(this),
      //Test        : new Test(this),
      Place       : new Place(this),
      PlaceAdd    : new PlaceAdd(this),
      Air         : new Air(this),
      AirAdd      : new AirAdd(this),
      Reservation : new Reservation(this),
      page404     : new page404(this),
    }

  }
  async Serv(pathname, query) {
    await this.SPA.Route(this.base, this.routes, pathname, query)
  }
}

ononline  = e =>  console.log('online')
onoffline = e =>  console.log('offline')

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App()
  //await app.init({ api: 'v1', host: window.location.hostname })
  await app.init({ api: 'v1', host: 'github' })
  await app.Serv(window.location.pathname)
})

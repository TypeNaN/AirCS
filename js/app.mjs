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


const db = 'AirCS'
const stores = [
  { key: 'account', option: { keyPath: 'id' }},
  { key: 'location', option: { keyPath: 'id' }},
  { key: 'device', option: { keyPath: 'id' }, indexes: [
    { name: 'location', keyPath: 'lid', option: { unique: false }},
  ]},
  { key: 'booking', option: { keyPath: 'id' }, indexes: [
    { name: 'did', keyPath: 'did', option: { unique: true }},
    { name: 'start', keyPath: 'start.dateTime', option: { unique: true }},
  ]},
]

class App {
  constructor() {
    this.db       = new DB(db, stores)
    this.spa      = new SPA()
    this.account  = new ACCOUNT()
    this.location = new LOCATION()
    this.device   = new DEVICE()
    this.booking  = new BOOKING()
  }
}

ononline = e =>  console.log('online')
onoffline = e =>  console.log('offline')

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App()
  await app.db.Open()

  await app.account.Store(app.db, 'account')
  await app.location.Store(app.db, 'location')
  await app.device.Store(app.db, 'device')
  await app.booking.Store(app.db, 'booking')

  app.api_v1 = 'https://6795150ce4546bd1640e647e--aircs.netlify.app/.netlify/functions/v1'

  const route = {
    Landing     : new Landing(app),
    //Test        : new Test(app),
    Place       : new Place(app),
    PlaceAdd    : new PlaceAdd(app),
    Air         : new Air(app),
    AirAdd      : new AirAdd(app),
    Reservation : new Reservation(app),
    page404     : new page404(app),
  }

  const root = '/AirCS' // github repository name
  await app.spa.Route(root, route, window.location.pathname)
})

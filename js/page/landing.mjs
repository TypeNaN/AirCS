import Notify from "../notify.mjs";
import Page   from '../page.mjs'

export default class extends Page {
  constructor(app) {
    super(app, {
      path      : '/landing',
      name      : 'Landing',
      menu      : 'Landing',
      title     : 'Welcome to Professional Aircon Cleaning Service.',
      icon      : '',
      callback  : null,
      navShow   : false,
    })
  }

  Destroy() { super.Destroy() }

  async Render(params, query) {
    super.Render(params, query)

    if (query && query.code && query.state) {
      new Notify({ head : 'Authorize', body : "ตรวจสอบการรับรองการเข้าสู่ระบบ<br/> กรุณารอสักครู่" })
      const authorize = await this.Account.RequestLogin(query.code)
      if (authorize) {
        window.history.replaceState(null, '', `${this.base}/`)
        return await this.SPA.Change(this.SPA.Pages.Place)
      }
    }

    document.body.innerHTML = `
      <div class="overlay"></div>
      <div class="container">
        <h1>ยินดีต้อนรับสู่ AirCS<br/>บริการล้างแอร์<br/>มืออาชีพ</h1>
        <p>แอร์คุณเราล้างให้<br/>มั่นใจคุณภาพถูกใจบริการ</p>
        <button id="checkLogin">จองคิว</button>
      </div>
    `

    document.getElementById('checkLogin').onclick = async (e) => {
      e.preventDefault()
      document.body.innerHTML = ''
      const user = await this.Account.GetOnce()
      if (!user) {
        new Notify({ head : 'Request Authorize', body : "Let's login." })
        return setTimeout(() => { return this.Account.RequestAuthorize() }, 1000)
      } else {
        window.history.replaceState(null, '', `${this.base}/`)
        return this.SPA.Change(this.SPA.Pages.Place)
      }
    }
  }

}

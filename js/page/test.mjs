import page from '../page.mjs'
import Notify from '../notify.mjs'

export default class extends page {
  constructor(app) {
    super(app, {
      path: '/test',
      name: 'Test',
      menu: 'ทดสอบ',
      title: 'หน้านี้ใช้ทดสอบ',
      icon: '',
      callback: () => app.SPA.Change(this),
      navShow: true,
    })
  }

  Destroy() {
    super.Destroy()
  }

  async Render(params, query) {
    super.Render(params, query)

    parent = document.body
    parent.appendChild(this.header)
    parent.appendChild(this.body)
    parent.appendChild(this.footer)

    this.Account.Profile(this.header)

    new Notify({ head : 'WELCOME', body : 'Welcome to Professional Aircon Cleaning Service.' })
  }
}

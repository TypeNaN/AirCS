export default class {
  constructor(app, prop) {

    this.header   = app.SPA.header
    this.body     = app.SPA.body
    this.content  = app.SPA.content
    this.left     = app.SPA.left
    this.right    = app.SPA.right
    this.footer   = app.SPA.footer
    this.headName = app.SPA.headName
    this.api      = app.api_v1

    this.path     = prop.path
    this.name     = prop.name
    this.menu     = prop.menu
    this.title    = prop.title
    this.navShow  = prop.navShow

    if (this.navShow) {
      this.nav = document.createElement('button')
      this.nav.className = 'page-nav'
      this.nav.innerHTML = `${prop.icon}<span class="page-nav-label">${this.menu}</span>`
      if (prop.callback) {
        this.nav.callback = prop.callback
        // จำเป็นต้องใช้ addEventListener เนื่องจากต้องการควบคุม event เอง
        // เพราะ element ไม่ได้ถูกลบออกและสร้างใหม่แต่จะคงอยู่ถาวรตลอดการใช้งาน
        // จะสร้างใหม่ต่อเมื่อ refesh หน้าเว็บเท่านั้น
        this.nav.addEventListener('click', this.nav.callback)
      }
      app.SPA.NavAdd(this.nav)
    }

    this.SPA      = app.SPA
    this.Account  = app.Account
    this.api_root = app.api_root
    this.base     = app.base
  }

  Destroy() {
    if (this.navShow) {
      if (this.nav.callback) this.nav.removeEventListener('click', this.nav.callback)
    }
    document.body.innerHTML = ''
  }

  async Render(params, query) {
    this.params = params
    this.query = query

    parent = document.body
    parent.id = `page-${this.name.toLowerCase()}`
    this.body.innerHTML = ''

  }
}

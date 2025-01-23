export default class {
  constructor(app, prop) {

    this.header   = app.spa.header
    this.body     = app.spa.body
    this.content  = app.spa.content
    this.left     = app.spa.left
    this.right    = app.spa.right
    this.footer   = app.spa.footer
    this.headName = app.spa.headName

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
      app.spa.NavAdd(this.nav)
    }

    this.spa = app.spa
    this.account = app.account
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

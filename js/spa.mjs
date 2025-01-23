// ┌────────────────────────────────────────────────────────────────────────────┐
// │ Full SPA on client                                                         |
// └────────────────────────────────────────────────────────────────────────────┘

export default class {
  constructor() {

    this.page = null
    this.pages = {}

    const tag     = 'section'
    this.header   = document.createElement(tag)
    this.body     = document.createElement(tag)
    this.footer   = document.createElement(tag)
    this.content  = document.createElement(tag)
    this.left     = document.createElement(tag)
    this.right    = document.createElement(tag)
    this.headName = document.createElement('h1')
    this.nav      = document.createElement('nav')

    this.header.id     = 'page-header'
    this.body.id       = 'page-body'
    this.footer.id     = 'page-footer'
    this.content.id    = 'page-content'
    this.left.id       = 'page-left'
    this.right.id      = 'page-right'
    this.headName.id   = 'page-name'
    this.nav.id        = 'page-nav'

    this.header.appendChild(this.headName)
    this.header.appendChild(this.nav)
  }

  Title(title) { document.title = title }
  NavAdd(e) { this.nav.appendChild(e) }
  NavRemove(e) { this.nav.removeChild(e) }

  NavSelected(e) {
    // จำเป็นต้องใช้ addEventListener เนื่องจากต้องการควบคุม event เอง
    // เพราะ element ไม่ได้ถูกลบออกและสร้างใหม่แต่จะคงอยู่ถาวรตลอดการใช้งาน
    // จะสร้างใหม่ต่อเมื่อ refesh หน้าเว็บเท่านั้น
    for (const item of this.nav.childNodes) {
      item.classList.remove('selected')
      if (item.callback) item.addEventListener('click', item.callback)
    }
    if (e) {
      if (e.callback) e.removeEventListener('click', e.callback)
      e.classList.add('selected')
    }
  }

  getRoute(path) {
    return new RegExp(`^${path.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/:(\w+)/g, '(?<$1>[^/]+)')}\/?$`)
  }

  getParams(match) {
    const v = match.result.slice(1)
    if (v.length < 1) return []
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((r) => r[1])
    return Object.fromEntries(keys.map((k, i) => [k, v[i]]))
  }

  getUrlquery() {
    const urlquery = {}
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, k, v) => urlquery[k] = v)
    return urlquery
  }

  async Route(root, pages, path, query) {
    this.pages = pages
    this.routes = []
    for (const page in pages) {
      this.routes.push({ path: `${root}${pages[page].path}`, view: pages[page] })
    }
    console.log(this.routes)

    const matches = this.routes.map((route) => ({ route: route, result: path.match(this.getRoute(route.path)) }))
    const match = matches.find((m) => m.result !== null) || { route: this.routes[0], result: [path] }
    const view = match.route.view
    await this.Change(view, this.getParams(match), query || this.getUrlquery())
  }

  async Change(page, params, query) {
    console.log(page, params, query)
    if (this.page) this.page.Destroy()
    this.page = page
    this.Title(page.title)
    this.headName.innerHTML = page.title
    this.NavSelected(page.nav)
    await this.page.Render(params, query)
  }
}

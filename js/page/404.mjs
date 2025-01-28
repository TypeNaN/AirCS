import Notify from '../notify.mjs'
import Dialog from '../dialog.mjs'
import page from '../page.mjs'

export default class extends page {
  constructor(app) {
    super(app, {
      path: '/:another',
      name: '404',
      menu: '404',
      title: '404 Page Not Found :(',
      icon: '',
      change: null,
      callback: null,
      navShow: false,
    })
  }

  Destroy() {
    super.Destroy()
  }

  Render(params, query) {
    super.Render(params, query)

    //parent = document.body
    //parent.appendChild(this.headName)
    //parent.appendChild(this.body)
    //parent.appendChild(this.footer)

    new Notify({ head : '404', body : '404 Page Not Found :(' })

    new Dialog({
      head    : '404',
      body    : '404 Page Not Found :(',
      accept  : { label: '✔ ไปที่หน้าหลัก' , callback: (e) => window.location.href = `${this.base}/` },
    })

    //this.headName.textContent = this.title
    console.error('404 Page Not Found :(')
  }
}

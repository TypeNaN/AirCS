import Notify from '../notify.mjs'
import Dialog from '../dialog.mjs'
import page   from '../page.mjs'

export default class extends page {
  constructor(app) {
    super(app, {
      path      : '/place',
      name      : 'Place',
      menu      : 'สถานที่',
      title     : 'สถานที่พักอาศัย',
      icon      : '',
      callback  : () => app.spa.Change(this),
      navShow   : true,
    })

    this.location = app.location
    this.device   = app.device
  }

  Destroy() { super.Destroy() }

  async Render(params, query) {
    super.Render(params, query)

    parent = document.body
    parent.appendChild(this.header)
    parent.appendChild(this.body)
    parent.appendChild(this.footer)

    this.account.Profile(this.header)

    //new Notify({ head : 'WELCOME', body : 'Welcome to Professional Aircon Cleaning Service.' })

    const locations = await this.location.Get()

    await this.DrawLocations(locations)
    if (locations.length < 1) { return this.HandlerNoLocation() }

  }

  async DrawLocations(locations) {
    const container     = document.createElement('div')
    container.id        = 'location-container'
    container.className = 'location-container'
    this.body.appendChild(container)

    locations.forEach(location => {
      const item      = document.createElement('div')
      item.id         = `location-${location.id}`
      item.className  = 'location-item'
      item.innerHTML  = `
        <label>สถานที่:</label><div id="place-${location.id}" class="location-place">${location.place}</div>
        <label>เลขที่:</label><div id="number-${location.id}" class="location-number">${location.number}</div>
        <label>เบอร์ติดต่อ:</label><div id="phone-${location.id}" class="location-phone"> ${location.phone}</div>
        <label>รายละเอียด:</label><div id="detail-${location.id}" class="location-detail"> ${location.detail}</div>
        <div class="location-footer">

          <svg id="icon-svg-air-${location.id}"
            class="icon-svg-air"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="m 14.122544,2.3464 c 5.955312,-2.30521549 7.774767,5.5961151 7.960646,12.479596 L 2.0245275,16.470561 2.0268175,6.1415501 Z" />
            <path d="M 4.6611738,12.810719 15.243479,10.991466" />
            <path d="M 6.5351562,18.742577 3.8657226,22.053856" />
            <path d="M 11.802124,18.742577 9.1326903,22.053856" />
            <path d="m 17.069092,18.742577 -2.669434,3.311279" />
          </svg>

          <svg id="icon-svg-edit-${location.id}"
            class="icon-svg-edit"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M 12,2 H 5 c -1,0 -2,0 -2,2 V 20 c 0,1 0,2 2,2 H 19 c 1,0 2,-0 2,-2 v -9" />
            <path d="m 17,2 a 2,2 0 0 1 3,2 L 12,16 8,17 8,13 Z" id="path2" />
          </svg>

          <svg id="icon-svg-remove-${location.id}"
            class="icon-svg-remove"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>

        </div>
      `
      container.appendChild(item)

      document.getElementById(`icon-svg-air-${location.id}`).onclick = async (e) => {
        return await this.spa.Change(this.spa.pages.Air, null, { location: location.id })
      }

      document.getElementById(`icon-svg-edit-${location.id}`).onclick = async (e) => {
        e.preventDefault()

        const loc = Object.assign({}, location)
        const editing = document.createElement('div')
        const msg     = document.createElement('div')
        const form    = document.createElement('form')
        const number  = document.createElement('input')
        const phone   = document.createElement('input')
        const detail  = document.createElement('textarea')

        msg.innerHTML = `<center><p>ทำการแก้ไขสถานที่ ${location.place} อาคารเลขที่ ${location.number}</p></center>`
        number.value  = location.number
        detail.value  = location.detail
        phone.value   = location.phone

        editing.appendChild(msg)
        editing.appendChild(form)
        form.appendChild(number)
        form.appendChild(phone)
        form.appendChild(detail)

        number.onkeydown = (e) => {
          if (e.key === 'Enter') { loc.number = number.value }
          else if (e.key === 'Escape') {
            loc.number    = location.number
            number.value  = location.number
          }
        }

        phone.onkeydown = (e) => {
          if (e.key === 'Enter') { loc.phone = phone.value }
          else if (e.key === 'Escape') {
            loc.phone     = location.phone
            phone.value   = location.phone
          }
        }

        detail.onkeydown = (e) => {
          if (e.key === 'Enter') { loc.detail = detail.value }
          else if (e.key === 'Escape') {
            loc.detail    = location.detail
            detail.value  = location.detail
          }
        }

        number.onchange = (e) => { loc.number = number.value }
        phone.onchange  = (e) => { loc.phone  = phone.value }
        detail.onchange = (e) => { loc.detail = detail.value }

        new Dialog({
          head    : 'แก้ไขสถานที่',
          body    : editing,
          accept  : { label: '✔ บันทึก' , callback: await this.PlaceEdit(loc) },
          cancel  : { label: '✘ ทิ้ง'   , callback: (e) => console.log('ทิ้ง') },
        })
      }

      document.getElementById(`icon-svg-remove-${location.id}`).onclick = async (e) => {
        e.preventDefault()
        new Dialog({
          red     : true,
          head    : 'ลบสถานที่',
          body    : `<center>ทำการลบสถานที่ ${location.place} อาคารเลขที่ ${location.number} ออกจากรายการ<br/>เครื่องปรับอากาศที่เพิ่มไว้ในสถานที่นี้จะถูกลบไปด้วยทั้งหมด</center>`,
          accept  : { label: '✔ ลบเลย', callback: await this.PlaceDelete(location.id) },
          cancel  : { label: '✘ ยกเลิก', callback: (e) => console.log(e) },
        })
      }
    })

    const addLocation = document.createElement('button')
    addLocation.innerText = 'เพิ่มสถานที่'
    this.body.appendChild(addLocation)

    addLocation.onclick = async (e) => {
      return await this.spa.Change(this.spa.pages.PlaceAdd)
    }

  }

  async PlaceEdit(loc) {
    return async (e) => {
      const user = await this.account.GetOnce()
      if (!user) return
      return await fetch(`${this.api}/location/patch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(loc)
      }).then(async (response) => {
        console.log(response)
        this.body.innerHTML = ''
        await this.location.Put(loc)
        await this.DrawLocations(await this.location.Get())
        new Notify({ head : 'ผลการบันทึก', body : 'บันทึกสถานที่สำเร็จ!' })
      }).catch(async error => {
        console.error(error)
        new Notify({ head : 'ผลการบันทึก', body : 'เกิดข้อผิดพลาดในการบันทึกสถานที่!' })
      })
    }
  }

  async PlaceDelete(id) {
    return async (e) => {
      e.preventDefault()
      const user = await this.account.GetOnce()
      if (!user) return
      return await fetch(`${this.api}/location/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
          body: JSON.stringify({ data: id })
        }).then(async (response) => {
          console.log(response)
          const device = await this.device.GetFrom('location', id)
          device.forEach(async device => await this.device.Delete(device.id))
          await this.location.Delete(id)
          const locations = await this.location.Get()
          this.body.innerHTML = ''
          await this.DrawLocations(await this.location.Get())
          new Notify({ head : 'ผลการบันทึก', body : 'บันทึกสถานที่สำเร็จ!' })
          if (locations.length < 1) { return this.HandlerNoLocation() }
        }).catch(async error => {
          console.error(error)
          new Notify({ head : 'ผลการบันทึก', body : 'เกิดข้อผิดพลาดในการบันทึกสถานที่!' })
        })
    }
  }

  HandlerNoLocation() {
    return new Dialog({
      head    : `ไม่พบสถานที่`,
      body    : '<center>ไม่พบสถานที่ หรือสถานที่อาจถูกลบไปแล้ว</center>',
      accept  : { label: '✔ เพิ่มสถานที่' , callback: async (e) => await this.spa.Change(this.spa.pages.PlaceAdd) },
      cancel  : { label: '✘ ปิด'       , callback: () => console.log('ยกเลิก') },
    })
  }

}

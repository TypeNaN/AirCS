import Notify from '../notify.mjs'
import Dialog from '../dialog.mjs'
import page   from '../page.mjs'
import device_props from '../device_props.mjs'


export default class extends page {
  constructor(app) {
    super(app, {
      path      : '/air',
      name      : 'Air',
      menu      : 'แอร์',
      title     : 'เครื่องปรับอากาศ',
      icon      : '',
      callback  : null,
      navShow   : false,
    })

    this.Location  = app.Location
    this.Device    = app.Device

    this.AirSync()

  }

  Destroy() { super.Destroy() }

  async Render(params, query) {
    super.Render(params, query)

    parent = document.body
    parent.appendChild(this.header)
    parent.appendChild(this.body)
    parent.appendChild(this.footer)

    await this.Account.Profile(this.header)

    //new Notify({ head : 'WELCOME', body : 'Welcome to Professional Aircon Cleaning Service.' })

    if (!query || !query.location) { return this.HandlerNoLocation() }

    const location = await this.Location.GetBy(query.location)
    if (!location) { return this.HandlerNoLocation() }

    const devices = await this.Device.GetFrom('location', query.location)
    if (devices.length < 1) { return this.HandlerNoDevice(query.location) }

    this.DrawDevices(devices, query)

  }

  async DrawDevices(devices, query) {
    this.body.innerHTML = ''
    const container     = document.createElement('div')
    container.id        = 'device-container'
    container.className = 'device-container'
    this.body.appendChild(container)

    devices.forEach(async device => {
      const item      = document.createElement('div')
      item.id         = `device-${device.id}`
      item.className  = 'device-item'
      item.innerHTML  = `
        <label>ชื่อ:</label><div id="name-${device.id}" class="device-name">${device.name}</div>
        <label>รายละเอียด:</label> <div id="desc-${device.id}" class="device-detail">${device.detail}</div>
        <label>ประเภท:</label> <div id="type-${device.id}" class="device-type">${device_props.type[device.type].name}</div>
        <label>ขนาด:</label> <div id="btu-${device.id}" class="device-btu">${device_props.type[device.type].btu[device.btu].name}</div>
        <label>น้ำยา:</label> <div id="coolant-${device.id}" class="device-coolant">${device_props.coolant[device.coolant].name}</div>
        <label>ล้างครั้งล่าสุด:</label> <div id="last-${device.id}" class="device-last">${device.last || 'ยังไม่เคยล้าง'}</div>
        <div class="location-actions">

          <div class="icon-svg-container">
            <svg id="icon-svg-edit-${device.id}"
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
          </div>

          <div class="icon-svg-container">
            <svg id="icon-svg-remove-${device.id}"
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

        </div>
      `
      container.appendChild(item)
      document.getElementById(`icon-svg-edit-${device.id}`).onclick = async (e) => {
        e.preventDefault()

        const dev         = Object.assign({}, device)
        const editing     = document.createElement('div')
        const form        = document.createElement('form')
        const airType     = document.createElement('select')
        const airBtu      = document.createElement('select')
        const airCoolant  = document.createElement('select')
        const airName     = document.createElement('input')
        const airDetail   = document.createElement('input')

        this.RenderAirType(airType, device.type)
        this.RenderAirBTU(airBtu, device.type, device.btu)
        this.RenderAirCoolant(airCoolant, device.coolant)

        airType.value     = device.type
        airBtu.value      = device.btu
        airCoolant.value  = device.coolant
        airName.value     = device.name
        airDetail.value   = device.detail

        editing.appendChild(form)
        form.appendChild(airType)
        form.appendChild(airBtu)
        form.appendChild(airCoolant)
        form.appendChild(airName)
        form.appendChild(airDetail)

        airName.onkeydown = (e) => {
          if (e.key === 'Enter') { dev.name = airName.value }
          else if (e.key === 'Escape') {
            dev.name      = device.name
            airName.value = device.name
          }
        }

        airDetail.onkeydown = (e) => {
          if (e.key === 'Enter') { dev.detail = airDetail.value }
          else if (e.key === 'Escape') {
            dev.detail      = device.detail
            airDetail.value = device.detail
          }
        }

        airType.onchange    = (e) => { dev.type     = parseInt(airType.value) }
        airBtu.onchange     = (e) => { dev.btu      = parseInt(airBtu.value) }
        airCoolant.onchange = (e) => { dev.coolant  = parseInt(airCoolant.value) }
        airName.onchange    = (e) => { dev.name     = airName.value }
        airDetail.onchange  = (e) => { dev.detail   = airDetail.value }

        new Dialog({
          head    : 'แก้ไขรายละเอียดของตัวแอร์',
          body    : editing,
          accept  : { label: '✔ บันทึก' , callback: await this.AirEdit(dev, query) },
          cancel  : { label: '✘ ทิ้ง'   , callback: e => false }
        })

      }
      document.getElementById(`icon-svg-remove-${device.id}`).onclick = async (e) => {
        e.preventDefault()
        new Dialog({
          red: true,
          head: 'ลบแอร์',
          body: `ทำการลบแอร์ ${device.name} ออกจากรายการ`,
          accept: { label: '✔ ลบเลย', callback: await this.AirDelete(device.id, query) },
          cancel: { label: '✘ ยกเลิก', callback: e => false },
        })
      }

    })

    const addAir      = document.createElement('button')
    addAir.innerText  = 'เพิ่มแอร์'
    this.body.appendChild(addAir)

    addAir.onclick = async (e) => {
      return await this.SPA.Change(this.SPA.Pages.AirAdd, null, { location: query.location })
    }
  }

  RenderAirType(container, selected) {
    container.innerHTML = ''
    device_props.type.map((item, index) => {
      let ops = ''
      if (index === selected) {
        if (item.disabled) ops += `<option value="${index}" selected disabled>${item.name}</option>`
        else ops += `<option value="${index}" selected>${item.name}</option>`
      } else {
        if (item.disabled) ops += `<option value="${index}" disabled>${item.name}</option>`
        else ops += `<option value="${index}">${item.name}</option>`
      }
      container.innerHTML += ops
    })
  }

  RenderAirBTU(container, type, selected) {
    container.innerHTML = ''
    device_props.type[type].btu.map((item, index) => {
      let ops = ''
      if (index === selected)  ops += `<option value="${index}" selected>${item.name}</option>`
      else ops += `<option value="${index}">${item.name}</option>`
      container.innerHTML += ops
    })
  }

  RenderAirCoolant(container, selected) {
    container.innerHTML = ''
    device_props.coolant.map((item, index) => {
      let ops = ''
      if (index === selected) {
        ops += `<option value="${index}" selected>${item.name}</option>`
      } else {
        ops += `<option value="${index}">${item.name}</option>`
      }
      container.innerHTML += ops
    })
  }

  HandlerNoLocation() {
    return new Dialog({
      head    : `ไม่พบสถานที่`,
      body    : 'ไม่พบสถานที่ หรือสถานที่อาจถูกลบไปแล้ว',
      accept  : { label: '✔ เพิ่มสถานที่' , callback: async (e) => await this.SPA.Change(this.SPA.Pages.PlaceAdd) },
      cancel  : { label: '✘ กลับ'      , callback: async (e) => await this.SPA.Change(this.SPA.Pages.Place) },
    })
  }

  HandlerNoDevice(location) {
    return new Dialog({
      head    : `ไม่พบแอร์`,
      body    : 'ไม่พบแอร์ หรือแอร์อาจถูกลบไปแล้ว',
      accept  : { label: '✔ เพิ่มแอร์' , callback: async (e) => await this.SPA.Change(this.SPA.Pages.AirAdd, null, { location: location }) },
      cancel  : { label: '✘ กลับ'    , callback: async (e) => await this.SPA.Change(this.SPA.Pages.Place) },
    })
  }

  async AirEdit(device, query) {
    return async (e) => {

      const user = await this.Account.isAlive()
      if (!user) return

      let loading = document.getElementById('now-loading')
      if (!loading) {
        loading = document.createElement('div')
        loading.id = 'now-loading'
        loading.className = 'now-loading'
        loading.innerHTML = '<h1>Now Loading....</h1>'
      }

      return await fetch(`${this.api_root}/device/patch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(device)
      }).then(async (response) => {
        console.log(response)
        await this.Device.Put(device)
        const devices = await this.Device.GetFrom('location', query.location)
        if (devices.length < 1) { return this.HandlerNoDevice(query.location) }
        await this.DrawDevices(devices, query)
        new Notify({ head : 'ผลการบันทึก', body : 'บันทึกสถานที่สำเร็จ!' })
        let loading = document.getElementById('now-loading')
        if (loading) loading.remove()
      }).catch(async error => {
        console.error(error)
        new Notify({ red: true, head : 'ผลการบันทึก', body : 'เกิดข้อผิดพลาดในการบันทึกเครื่องปรับอากาศ!' })
        let loading = document.getElementById('now-loading')
        if (loading) loading.remove()
      })
    }
  }

  async AirDelete(id, query) {
    return async (e) => {
      e.preventDefault()

      const user = await this.Account.isAlive()
      if (!user) return

      let loading = document.getElementById('now-loading')
      if (!loading) {
        loading = document.createElement('div')
        loading.id = 'now-loading'
        loading.className = 'now-loading'
        loading.innerHTML = '<h1>Now Loading....</h1>'
      }

      return await fetch(`${this.api_root}/device/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ did: id })
      }).then(async (response) => {
        console.log(response)
        const item = document.getElementById(`device-${id}`)
        if (item) {
          const container = document.getElementById('device-container')
          container.removeChild(item)
          await this.Device.Delete(id)
        }
        const devices = await this.Device.GetFrom('location', query.location)
        if (devices.length < 1) { return this.HandlerNoDevice(query.location) }
        await this.DrawDevices(devices, query)
        new Notify({ head : 'ผลการบันทึก', body : 'บันทึกสถานที่สำเร็จ!' })
        let loading = document.getElementById('now-loading')
        if (loading) loading.remove()
      }).catch(async error => {
        new Notify({ red: true, head : 'ผลการบันทึก', body : 'เกิดข้อผิดพลาดในการบันทึกเครื่องปรับอากาศ!' })
        console.error(error)
        let loading = document.getElementById('now-loading')
        if (loading) loading.remove()
      })
    }
  }

  async AirSync() {
    const user = await this.Account.isAlive()
    if (!user) return

    await fetch(`${this.api_root}/device/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
    }).then(async (response) => {
      if (response.ok) {
        const result = await response.json()
        await this.Device.Clear()
        for (const item of result) {
          await this.Device.Put(item)
        }
      }
    }).catch(error => {
      new Notify({ red: true, head : 'Sync', body : 'เกิดข้อผิดพลาดในการ Sync เครื่องปรับอากาศ!' })
      console.error('Error:', error)
    })
  }

}

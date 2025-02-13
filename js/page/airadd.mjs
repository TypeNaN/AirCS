import Notify from '../notify.mjs'
import page   from '../page.mjs'
import device_props from '../device_props.mjs'


export default class extends page {
  constructor(app) {
    super(app, {
      path      : '/airadd',
      name      : 'AirAdd',
      menu      : 'เพิ่มแอร์',
      title     : 'เพิ่มแอร์ในสถานที่',
      icon      : '',
      callback  : null,
      navShow   : false,
    })

    this.Device = app.Device

  }

  Destroy() { super.Destroy() }

  async Render(params, query) {
    super.Render(params, query)

    parent = document.body
    parent.appendChild(this.header)
    parent.appendChild(this.body)
    parent.appendChild(this.footer)

    await this.Account.Profile(this.header)

    this.body.innerHTML = `
      <form id="addingForm">
        <label for="air-type">ประเภท:</label>
        <select id="air-type" name="air-type" required>
        </select>
        <label for="air-btu">ขนาด: (ดูที่ระบุไว้ในเพลทข้างตัวแอร์)</label>
        <select id="air-btu" name="air-btu" required>
        </select>
        <label for="air-coolant">ชนิดน้ำยาทำความเย็น: (ดูที่ระบุไว้ในเพลทข้างตัวแอร์)</label>
        <select id="air-coolant" name="air-coolant" required>
        </select>
        <label for="air-name">ชื่อ:</label>
        <input id="air-name" name="air-name" type="text" placeholder="ตั้งชื่อไห้เรียกง่าย เช่น แอร์ห้องนอน" required></input>
        <label for="air-detail">รายละเอียด:</label>
        <input id="air-detail" name="air-detail" type="text" placeholder="แอร์อยู่ในส่วนใดของสถานที่ เช่น ห้องนอนชั้นสอง" required></input>
        <button type="submit">บันทึกเครื่องปรับอากาศ</button>
      </form>
    `
    const airType = document.getElementById('air-type')
    const airBtu = document.getElementById('air-btu')
    const airCoolant = document.getElementById('air-coolant')

    airType.onchange = () => this.RenderAirBTU(airBtu, airType.value)

    this.RenderAirType(airType)
    this.RenderAirBTU(airBtu, airType.value)
    this.RenderAirCoolant(airCoolant)

    document.getElementById('addingForm').onsubmit = async (e) => {
      e.preventDefault()

      let loading = document.getElementById('now-loading')
      if (!loading) {
        loading = document.createElement('div')
        loading.id = 'now-loading'
        loading.className = 'now-loading'
        loading.innerHTML = '<h1>Now Loading....</h1>'
        document.body.appendChild(loading)
      }

      const user = await this.Account.isAlive()
      if (!user) {
        let loading = document.getElementById('now-loading')
        if (loading) loading.remove()
        return
      }

      const airType     = document.getElementById('air-type')
      const airBtu      = document.getElementById('air-btu')
      const airCoolant  = document.getElementById('air-coolant')
      const airName     = document.getElementById('air-name')
      const airDetail   = document.getElementById('air-detail')

      const air   = this.Device.Schema()
      air.uid     = user.id
      air.lid     = query.location
      air.type    = parseInt(airType.value)
      air.name    = airName.value
      air.btu     = parseInt(airBtu.value)
      air.coolant = parseInt(airCoolant.value)
      air.detail  = airDetail.value

      await fetch(`${this.api_root}/device/add`, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}`},
        body: JSON.stringify(air)
      }).then(() => {
        this.Device.Put(air)
        new Notify({ head: 'ผลการบันทึก', body: 'บันทึกแอร์สำเร็จ คุณสามารถเพิ่มแอร์ได้ต่อเนื่องหากมีอีก' })
        document.getElementById('addingForm').reset()
        let loading = document.getElementById('now-loading')
        if (loading) loading.remove()
      }).catch(error => {
        new Notify({ red: true, head: 'ผลการบันทึก', body: 'เกิดข้อผิดพลาดในการบันทึกแอร์' })
        console.error(error)
        let loading = document.getElementById('now-loading')
        if (loading) loading.remove()
      })

    }

  }

  RenderAirType(container) {
    container.innerHTML = ''
    device_props.type.map((item, index) => {
      let ops = ''
      if (index === 0) {
        if (item.disabled) ops += `<option value="${index}" selected disabled>${item.name}</option>`
        else ops += `<option value="${index}" selected>${item.name}</option>`
      } else {
        if (item.disabled) ops += `<option value="${index}" disabled>${item.name}</option>`
        else ops += `<option value="${index}">${item.name}</option>`
      }
      container.innerHTML += ops
    })
  }

  RenderAirBTU(container, type) {
    container.innerHTML = ''
    device_props.type[type].btu.map((item, index) => {
      let ops = ''
      if (index === 0)  ops += `<option value="${index}" selected>${item.name}</option>`
      else ops += `<option value="${index}">${item.name}</option>`
      container.innerHTML += ops
    })
  }

  RenderAirCoolant(container) {
    container.innerHTML = ''
    device_props.coolant.map((item, index) => {
      let ops = ''
      if (index === 0) {
        ops += `<option value="${index}" selected>${item.name}</option>`
      } else {
        ops += `<option value="${index}">${item.name}</option>`
      }
      container.innerHTML += ops
    })
  }

}

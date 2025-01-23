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

    this.device = app.device

  }

  Destroy() { super.Destroy() }

  async Render(params, query) {
    super.Render(params, query)

    parent = document.body
    parent.appendChild(this.header)
    parent.appendChild(this.body)
    parent.appendChild(this.footer)

    this.account.Profile(this.header)

    //new Notify({ head : 'เพิ่มแอร์', body : 'กรุณาเพิ่มแอร์เพื่อรับบริการ' })

    this.body.innerHTML = `
      <form id="bookingForm">
        <label for="air-type">ประเภท:</label>
        <select id="air-type" name="air-type" required>
          ${device_props.type.map((item, index, array) => {
            if (index === 0) {
              if (item.disabled) {
                return `<option value="${index}" selected disabled>${item.name}</option>`
              }
              return `<option value="${index}" selected>${item.name}</option>`
            } else {
              if (item.disabled) {
                return `<option value="${index}" disabled>${item.name}</option>`
              }
              return `<option value="${index}">${item.name}</option>`
            }
          }).join('')}
        </select>
        <label for="air-btu">ขนาด: (ดูที่ระบุไว้ในเพลทข้างตัวแอร์)</label>
        <select id="air-btu" name="air-btu" required>
          ${device_props.btu.map((item, index, array) => {
            if (index === 0) {
              return `<option value="${index}" selected>${item.name}</option>`
            } else {
              return `<option value="${index}">${item.name}</option>`
            }
          }).join('')}
        </select>
        <label for="air-coolant">ชนิดน้ำยาทำความเย็น: (ดูที่ระบุไว้ในเพลทข้างตัวแอร์)</label>
        <select id="air-coolant" name="air-coolant" required>
          ${device_props.coolant.map((item, index, array) => {
            if (index === 0) {
              return `<option value="${index}" selected>${item.name}</option>`
            } else {
              return `<option value="${index}">${item.name}</option>`
            }
          }).join('')}
        </select>
        <label for="air-name">ชื่อ:</label>
        <input id="air-name" name="air-name" type="text" placeholder="ตั้งชื่อไว้เรียกแอร์เพื่อให้จำง่าย" required></input>
        <label for="air-detail">รายละเอียด:</label>
        <input id="air-detail" name="air-detail" type="text" placeholder="แอร์อยู่ในส่วนใดของสถานที่" required></input>
        <button type="submit">บันทึกเครื่องปรับอากาศ</button>
      </form>
    `


    document.getElementById('bookingForm').onsubmit = async (e) => {
      e.preventDefault()

      const user = await this.account.GetOnce()
      if (!user) return

      const airType     = document.getElementById('air-type')
      const airBtu      = document.getElementById('air-btu')
      const airCoolant  = document.getElementById('air-coolant')
      const airName     = document.getElementById('air-name')
      const airDetail   = document.getElementById('air-detail')

      const air   = this.device.Schema()
      air.uid     = user.id
      air.lid     = query.location
      air.type    = parseInt(airType.value)
      air.name    = airName.value
      air.btu     = parseInt(airBtu.value)
      air.coolant = parseInt(airCoolant.value)
      air.detail  = airDetail.value

      await fetch('/user/device/add', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}`},
        body: JSON.stringify(air)
      }).then(() => {
        this.device.Put(air)
        new Notify({ head: 'ผลการบันทึก', body: 'บันทึกแอร์สำเร็จ คุณสามารถเพิ่มแอร์ได้ต่อเนื่องหากมีอีก' })
        document.getElementById('bookingForm').reset()
      }).catch(error => {
        new Notify({ head: 'ผลการบันทึก', body: 'เกิดข้อผิดพลาดในการบันทึกแอร์' })
        console.error(error)
      })

    }
  }

}

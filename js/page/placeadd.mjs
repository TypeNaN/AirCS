import Notify from '../notify.mjs'
import page from '../page.mjs'

export default class extends page {
  constructor(app) {
    super(app, {
      path: '/placeadd',
      name: 'PlaceAdd',
      menu: 'เพิ่มสถานที่',
      title: 'เลือกสถานที่',
      icon: '',
      callback: () => app.spa.Change(this),
      navShow: false,
    })

    this.location = app.location

    this.geoScale = 1.6
    this.geoOrigin = [-110, -20]
    this.geoFont = '14px monospace'
    this.geoGraphics = [
      { name: 'ลริล กรีนวิลล์', color1: 'maroon', color2: '#ffffff', t: {x:-10,y: 56}, points: [[100, 18], [163, 34], [240, 52], [231, 73], [153, 49], [119, 84], [70, 75]]},
      { name: 'ภัสสร', color1: 'purple', color2: '#ffffff', t: {x:10,y: 60}, points: [[155, 52], [203, 67], [199, 79], [213, 84], [212, 128], [169, 125], [170, 111], [116, 93]]},
      { name: 'คอนเน็กซ์ 3', color1: 'teal', color2: '#ffffff', t: {x:0,y: 39}, points: [[115, 95], [165, 111], [163, 124], [104, 124]]},
      { name: 'คอนเน็กซ์ 2', color1: 'cyan', color2: '#333333', t: {x:6,y: 57}, points: [[102, 129], [159, 136], [157, 193], [87, 193]]},
      { name: 'คอนเน็กซ์ 1', color1: 'red', color2: '#ffffff', t: {x:7,y: 48}, points: [[169, 135], [210, 139], [210, 194], [170, 193]]},
      { name: 'รีโว่', color1: '#004e00', color2: '#ff0000', t: {x:10,y: 0}, points: [[244, 52], [272, 58], [278, 71], [243, 63]]},
      { name: 'ดีคอนโด', color1: '#000067', color2: '#ffffff', t: {x:8,y: 22}, points: [[242, 63], [279, 72], [278, 85], [241, 75]]},
      { name: 'คอนโดมี', color1: '#866e00', color2: '#ff0000', t: {x:-30,y: 60}, points: [[277, 83], [290, 85], [286, 113], [274, 113]]},
      { name: 'เศรษฐศิริ', color1: '#acb100', color2: 'purple', t: {x:-6,y: 110}, points: [[241, 85], [257, 89], [255, 129], [273, 143], [269, 188], [236, 188], [234, 126]]},
    ]
  }

  Destroy() { super.Destroy() }

  async Render(params, query) {
    super.Render(params, query)

    parent = document.body
    parent.appendChild(this.header)
    parent.appendChild(this.body)
    parent.appendChild(this.footer)

    this.account.Profile(this.header)

    //new Notify({
    //  still: true,
    //  head : 'เลือกพื้นที่ให้บริการ',
    //  body : 'กรุณาเลือกพื้นที่จากแผนที่แสดงภูมิศาสตร์ ที่เราเตรียมไว้ให้บริการ',
    //  img  : '../../img/aircon-cleaning-professional.webp'
    //})

    this.body.innerHTML = `
      <form id="bookingForm">
        <canvas id="geoCanvas" width="358" height="300"></canvas>
        <div id="additionalInfo" style="display: none;">
          <label for="place">สถานที่:</label><input type="text" id="place" name="place" readonly required>
          <label for="number">บ้านเลขที่:</label><input type="text" id="number" name="number" autocomplete="off" required>
          <label for="phone">เบอร์ติดต่อ:</label><input type="text" id="phone" name="phone" autocomplete="off" required>
          <label for="detail">รายละเอียดเพิ่มเติม:</label><textarea id="detail" name="detail"></textarea>
          <button type="submit">บันทึกสถานที่</button>
        </div>
      </form>
    `
    document.getElementById('bookingForm').onsubmit = async (e) => {
      e.preventDefault()

      const user = await this.account.GetOnce()
      if (!user) return

      const locationPlace   = document.getElementById('place')
      const locationNumber  = document.getElementById('number')
      const locationDetail  = document.getElementById('detail')
      const locationPhone   = document.getElementById('phone')

      const info  = this.location.Schema()
      info.uid    = user.id
      info.place  = locationPlace.value
      info.number = locationNumber.value
      info.detail = locationDetail.value
      info.phone  = locationPhone.value

      this.location.Put(info)

      await fetch(`${this.api}/location/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(info),
      }).then(() => {
        new Notify({ head : 'ผลการบันทึก', body : 'บันทึกสถานที่สำเร็จ!' })
        document.getElementById('bookingForm').reset()
        document.body.removeChild(this.body)
        setTimeout(() => { this.spa.Change(this.spa.pages.Place) }, 2000)
      }).catch(error => {
        new Notify({ head : 'ผลการบันทึก', body : 'เกิดข้อผิดพลาดในการบันทึกสถานที่!' })
        console.error('Error:', error)
      })
    }

    const canvas = document.getElementById('geoCanvas')
    const ctx    = canvas.getContext('2d')

    function drawPolygon(ctx, font, name, color1, color2, t, points) {
      ctx.beginPath()
      ctx.moveTo(points[0][0], points[0][1])
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1])
      }
      ctx.closePath()
      ctx.fillStyle = color1
      ctx.fill()
      ctx.fillStyle = color2
      ctx.font = font
      ctx.fillText(name, points[0][0] + t.x, points[0][1] + t.y)
    }

    function rescale(scale, origin, points) {
      const result = []
      points.forEach(point => {
        result.push([
          origin[0] + (point[0] * scale),
          origin[1] + (point[1] * scale)
        ])
      })
      return result
    }

    const locations = []
    this.geoGraphics.forEach(graphic => {
      const result = rescale(this.geoScale, this.geoOrigin, graphic.points)
      locations.push({ name: graphic.name, color1: graphic.color1, color2: graphic.color2, t: graphic.t, points: result})
    })

    locations.forEach(location => drawPolygon(ctx, this.geoFont, location.name, location.color1, location.color2, location.t, location.points))

    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      let selectedLocation = null

      locations.forEach(location => {
        const path = new Path2D()
        path.moveTo(location.points[0][0], location.points[0][1])
        location.points.forEach(([px, py], index) => { if (index > 0) path.lineTo(px, py) })
        path.closePath()
        if (ctx.isPointInPath(path, x, y)) { selectedLocation = location }
      })

      if (selectedLocation) {
        document.getElementById('additionalInfo').style.display = 'block'
        document.getElementById('place').value = selectedLocation.name
      }
    }
  }

}

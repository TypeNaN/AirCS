import Notify from '../notify.mjs'
import Dialog from '../dialog.mjs'
import page   from '../page.mjs'
import device_props from '../device_props.mjs'

export default class extends page {
  constructor(app) {
    super(app, {
      path      : '/reservation',
      name      : 'Reservation',
      menu      : 'จองคิว',
      title     : 'จองคิวล้างแอร์',
      icon      : '',
      change    : null,
      callback  : () => app.spa.Change(this),
      navShow   : true,
    })

    this.location = app.location
    this.device   = app.device
    this.booking  = app.booking

    this.calendar = []

    this.today      = new Date()
    this.reservDay  = new Date()
    this.selectDay  = new Date()
    this.setMinDay  = new Date()

    this.today.setHours(0, 0, 0, 0)
    this.reservDay.setHours(0, 0, 0, 0)
    this.selectDay.setHours(0, 0, 0, 0)
    this.setMinDay.setHours(0, 0, 0, 0)
    this.setMaxDay  = new Date( this.today.getTime() + (1000 * 60 * 60 *  24  * 6))

    this.timeSlots = [
      { start: 9,  end: 12 },
      { start: 13, end: 15 },
      { start: 15, end: 17 },
    ]

    this.needClean          = []

    this.currentLocationId  = null
    this.currentDayIndex    = null
    this.currentHourIndex   = null

  }

  async Render(params, query) {
    super.Render(params, query)

    parent = document.body
    parent.appendChild(this.header)
    parent.appendChild(this.body)
    parent.appendChild(this.footer)

    this.account.Profile(this.header)
    this.user = await this.account.GetOnce()

    const locations = await this.location.Get()
    if (locations.length < 1) { return await this.spa.Change(this.spa.pages.PlaceAdd) }
    this.currentLocationId = locations[0].id

    this.airs = await this.device.Get()
    if (this.airs.length < 1) { await this.spa.Change(this.spa.pages.Air, null, { location: this.currentLocationId }) }

    //console.log(await this.booking.GetFrom('start', null, 'next'))
    //console.log(await this.booking.GetFrom('start', null, 'prev'))

    this.body.innerHTML = `
      <form id="bookingForm">
        <label for="location">สถานที่:</label>
        <select id="location" name="location" required>
          ${locations.map(location =>
            `<option value="${location.id}">${location.place} - ${location.number}</option>`
          ).join('')}
        </select>
        <label for="device-list">ต้องการล้าง: (เรียงลำดับตามการติ๊กเลือก)</label>
        <div id="device-list" name="device-list"></div>
        <label for="calendar-container">เลือกช่วงเวลา:<br/>* จองซ้อน จองกระโดดข้าม จองเลยปฏิทิน จะถูกตัดทิ้งอัติโนมัติ</label>
        <div id="calendar-container" name="calendar-container">
          <div id="calendar-button-wraper">
            <div id="calendar-backward">ย้อน</div>
            <div id="calendar-today">${this.FormatThaidate(this.selectDay)}</div>
            <div id="calendar-forward">ถัดไป</div>
          </div>
          <ul id="calendar-day-container"></ul>
        </div>
        <button id="submit" type="submit">บันทึกการจอง</button>
      </form>
    `

    await this.ApplyBookedToCalendar()
    this.DrawDevice()
    this.DrawCalendar()

    document.getElementById('location').onchange = (event) => {
      this.currentLocationId = event.target.value
      this.DrawDevice(event.target.value)
    }
    document.getElementById('calendar-backward').onclick = (e) => {
      this.selectDay = this.AdjustDate(this.selectDay, { days: -1 })
      this.selectDay = this.isMinDate(this.selectDay)
      this.DrawCalendar()
    }
    document.getElementById('calendar-forward').onclick = (e) => {
      this.selectDay = this.AdjustDate(this.selectDay, { days: 1 })
      this.selectDay = this.isMaxDate(this.selectDay)
      this.DrawCalendar()
    }
    document.getElementById('calendar-day-container').onclick = this.RegisterEvent()
    document.getElementById('submit').onclick = await this.SubmitEvent()
  }

  AdjustDate(now, arg) {
    const date = new Date(now)
    if (arg) {
      if (arg.years)    date.setFullYear(date.getFullYear() + arg.years)
      if (arg.months)   date.setMonth(date.getMonth()       + arg.months)
      if (arg.days)     date.setDate(date.getDate()         + arg.days)
      if (arg.hours)    date.setHours(date.getHours()       + arg.hours)
      if (arg.minutes)  date.setMinutes(date.getMinutes()   + arg.minutes)
      if (arg.seconds)  date.setSeconds(date.getSeconds()   + arg.seconds)
    }
    return date
  }

  isMinDate(date) {
    if (date < this.setMinDay) {
      new Notify({ killall: true, red: true, head : 'การเลือกวันที่', body : 'ไม่สามารถย้อนกลับไปก่อนวันที่ปัจจุบันได้!' })
      return new Date(this.setMinDay)
    }
    return date
  }

  isMaxDate(date) {
    if (date > this.setMaxDay) {
      new Notify({ killall: true, red: true, head : 'การเลือกวันที่', body : 'การจองเกิน 7 วันดูเหมือนจะนานเกินไป!' })
      return new Date(this.setMaxDay)
    }
    return date
  }

  FormatThaidate(date, options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Bangkok' }) {
    return new Intl.DateTimeFormat('th-TH', options).format(date)
  }

  FormatTimeSlot(now) {
    const date = new Date(now)
    if (isNaN(date)) return
    const HH = String(date.getHours()).padStart(2, '0')
    const MM = String(date.getMinutes()).padStart(2, '0')
    return `${HH}:${MM}`
  }

  FormatGetCalendar(now) {
    const date = new Date(now)
    const year    = date.getFullYear()
    const month   = String(date.getMonth() + 1).padStart(2, '0');
    const day     = String(date.getDate()).padStart(2,      '0');
    const hour    = String(date.getHours()).padStart(2,     '0');
    const minute  = String(date.getMinutes()).padStart(2,   '0');
    const seconds = String(date.getSeconds()).padStart(2,   '0') + '.000';
    return `${year}-${month}-${day}T${hour}:${minute}:${seconds}+07:00`
  }

  FormatAddCalendar(date) {
    return { dateTime: date.toISOString(), timeZone: 'Asia/Bangkok' }
  }

  async ApplyBookedToCalendar() {
    const booked = await this.booking.GetFrom('start', null, 'next')
    if (booked.length > 0) {
      booked.forEach(item => {
        this.calendar.push({
          id          : item.id,
          summary     : 'จองแล้ว',
          description : item.did,
          start       : item.start,
          end         : item.end,
          status      : item.status,
        })
      })
      if (new Date(booked[0].start.dateTime) < this.setMinDay) {
        await this.GetCalendarEvents()
      }
    }
  }

  async GetCalendarEvents() {
    const start = this.AdjustDate(this.today, {}, true, true)
    const end   = this.AdjustDate(this.today, { days: 6, hours: 23, minutes: 59, seconds: 59.999 }, true, true)

    await fetch('/booking/get', {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json', Authorization: `Bearer ${this.user.token}` },
      body: JSON.stringify({
        start : this.FormatGetCalendar(start),
        end   : this.FormatGetCalendar(end)
      }),
    }).then(async (response) => {
      const result = await response.json()
      const error = await new Promise(async (resolve, reject) => {
        if (result.length > 0) {
          await this.booking.Clear('booking')
          result.forEach(async (item, index, array) => {
            const air     = await this.device.GetBy(item.description)
            let booked    = await this.booking.GetOnceFrom('did', item.description)
            if (!booked) { booked = this.booking.Schema() }
            booked.id     = item.id
            booked.did    = item.description
            booked.start  = item.start
            booked.end    = item.end
            booked.status = item.status

            if (air) {
              booked.uid  = air.uid
              booked.lid  = air.lid
            } else {
              booked.uid  = 'secret'
              booked.lid  = 'secret'
            }

            this.calendar.push(item)
            await this.booking.Put(booked)
            if (index === array.length -1) resolve()
          })
        } else { reject() }
      })
      if (!error) {
        new Notify({ head : 'ปรับปรุงข้อมูล', body : 'ข้อมูลการจองคิวถูกปรับปรุงให้เป็นปัจจุบันแล้ว!' })
        this.DrawDevice()
        this.DrawCalendar()
        return
      }
      new Notify({ red: true, head : 'ปรับปรุงข้อมูล', body : 'ข้อมูลการจองคิวถูกปรับปรุงไม่ครบถ้วน อาจลองใหม่ในภายหลัง!' })
      this.DrawDevice()
      this.DrawCalendar()
    }).catch( async error => {
      if (!error) {
        await this.ApplyBookedToCalendar()
        this.DrawDevice()
        this.DrawCalendar()
        return
      }
      console.error('Error:', error)
    })
  }

  DrawDevice() {
    this.needClean = []
    const device_list = document.getElementById('device-list')
    const filtered = this.airs.filter(device => device.lid === this.currentLocationId)
    if (filtered.length < 1) {
      device_list.innerHTML = `
          <div class="device-checkbox-container">
            ไม่มีแอร์ในสถานที่นี้ ควรเพิ่มแอร์ก่อนจอง
          </div>
        `
      return
    }

    device_list.innerHTML = filtered.map(device => {
      const reservation = this.calendar.filter((item) => item.description == device.id)
      if (reservation.length > 0) {
        return  `
            <div class="device-checkbox-container">
              <input type="checkbox" id="checkbox-${device.id}" class="device-checkbox" name="checkbox-${device.id}" value="${device.id}" disabled>
              <label class="label-checkbox" for="checkbox-${device.id}">${device.name} - ${device_props.btu[device.btu].name}<br/>${device.detail}</label>
              <p class="device-booked">จองแล้ว</p>
            </div>
          `
      } else {
        return  `
            <div class="device-checkbox-container">
              <input type="checkbox" id="checkbox-${device.id}" class="device-checkbox" name="checkbox-${device.id}" value="${device.id}">
              <label class="label-checkbox" for="checkbox-${device.id}">${device.name} - ${device_props.btu[device.btu].name}<br/>${device.detail}</label>
            </div>
          `
      }
    }).join('')

    filtered.forEach(device => {
      const checkbox = document.getElementById(`checkbox-${device.id}`)
      checkbox.onchange = () => {
        if (checkbox.checked) {
          this.needClean.push(device)
        }
        else {
          const index = this.needClean.indexOf(device)
          if (index > -1) { this.needClean.splice(index, 1) }
        }
      }
    })
  }

  DrawCalendar() {
    this.SubmittingEvent = false
    const container = document.getElementById('calendar-day-container')
    container.innerHTML = ''

    const days = [0, 1, 2, 3, 4, 5, 6]
    const timeSlots = [
      { start: '09:00', end: '12:00' },
      { start: '13:00', end: '15:00' },
      { start: '15:00', end: '17:00' },
    ]

    days.forEach(offset => {
      const day = new Date(this.today)
      day.setDate(day.getDate() + offset)
      const dayElement = document.createElement('li')
      dayElement.classList.add('calendar-day')

      if (day.getTime() == this.selectDay.getTime()) {
        dayElement.classList.add('calendar-day-today')
      }

      timeSlots.forEach(slot => {
        const hourElement = document.createElement('ul')
        hourElement.classList.add('calendar-hour')

        const events = this.calendar.filter(event => {
          const eventStart  = new Date(event.start.dateTime)
          const eventEnd    = new Date(event.end.dateTime)
          const slotStart   = new Date(day)
          const slotEnd     = new Date(day)
          slotStart.setHours(...slot.start.split(':'))
          slotEnd.setHours(...slot.end.split(':'))

          return eventStart >= slotStart && eventEnd <= slotEnd
        })

        if (events.length > 0) {
          events.forEach(async event => {
            const eventElement = document.createElement('li')
            eventElement.classList.add('calendar-event')
            eventElement.classList.add('event-status-summary')
            let isYou = { msg: '', class: '', }
            let uid
            let lid

            const did = event.description
            const air = await this.device.GetBy(did)
            if (air) {
              uid = air.uid
              lid = air.lid
            }
            if (uid == this.user.id) {
              isYou.msg   = 'คุณ<br/>'
              isYou.class = ' class="event-owner"'
              eventElement.classList.add('event-owner')
              eventElement.booked = {
                id    : event.id,
                uid   : uid,
                lid   : lid,
                did   : did,
                start : event.start.dateTime,
                end   : event.end.dateTime,
              }
            }

            eventElement.innerHTML = `<div${isYou.class}>${isYou.msg}จองแล้ว<br/>${day.getDate()}<br/>${this.FormatTimeSlot(event.start.dateTime)}<br/>${this.FormatTimeSlot(event.end.dateTime)}</div>`
            hourElement.appendChild(eventElement)
          })
        } else {
          hourElement.innerHTML = `<li class="calendar-event event-status-empty"><div>ว่าง<br/>${day.getDate()}<br/>${slot.start}<br/>${slot.end}</div></li>`
        }
        dayElement.appendChild(hourElement)
      })
      container.appendChild(dayElement)
    })
    document.getElementById('calendar-today').innerText = this.FormatThaidate(this.selectDay)
  }


  isSlotAvailable(dayIndex, hourIndex) {
    const calendarDays = document.querySelectorAll('.calendar-day')
    const day = calendarDays[dayIndex]
    if (!day) return false

    const hours = day.querySelectorAll('.calendar-hour')
    const hour  = hours[hourIndex]
    return hour && !hour.querySelector('.event-booking') && !hour.querySelector('.event-status-summary')
  }

  ClearAllEventElement() {
    const elements = document.querySelectorAll('.event-booking')
    elements.forEach(el => el.remove())
  }

  DrawEventElement(startHourIndex, dayIndex, count) {
    this.period = []
    this.ClearAllEventElement()
    const calendarDays = document.querySelectorAll('.calendar-day')
    //let elementsPerDay = Math.ceil(count / (calendarDays.length - dayIndex)) // เฉลี่ย element ต่อวัน
    let remaining = count

    for (let i = dayIndex; i < calendarDays.length && remaining > 0; i++) {
      const day   = calendarDays[i]
      const hours = day.querySelectorAll('.calendar-hour')

      for (let j = (i === dayIndex ? startHourIndex : 0); j < hours.length && remaining > 0; j++) {
        if (!this.isSlotAvailable(i, j)) {
          this.ClearAllEventElement()
          return new Notify({ killall: true, red: true, head : 'การจอง', body : 'ไม่สามารถจองกรโดดข้ามระหว่างช่องที่จองอยู่ก่อนแล้วได้! <br/>ต้องจองต่อเนื่องกันเท่านั้น' })
        }

        const device = this.needClean[count - remaining]

        this.period.push({
          day   : i,
          start : this.timeSlots[j].start,
          end   : this.timeSlots[j].end,
          lid   : device.lid,
          did   : device.id,
          uid   : device.uid,
        })

        const element     = document.createElement('div')
        element.innerText = device.name
        element.classList.add('event-booking')
        hours[j].appendChild(element)
        remaining--
      }
    }
  }

  RegisterEvent() {
    return (e) => {
      e.preventDefault()
      if (e.target.closest('.calendar-hour')) {
        const clickedHour = e.target.closest('.calendar-hour')
        const hourIndex   = Array.from(clickedHour.parentNode.children).indexOf(clickedHour)
        const dayIndex    = Array.from(document.querySelectorAll('.calendar-day')).indexOf(clickedHour.closest('.calendar-day'))

        if (!this.isSlotAvailable(dayIndex, hourIndex)) {
          const target = clickedHour.childNodes[0]
          if (target.classList.contains('event-owner')) {
            console.log(target.booked)

            new Dialog({
              head    : 'ยกเลิก',
              body    : 'ยกเลิกการจองนี้หรือไม่!',
              accept  : { label: '✔ ยกเลิกเลย' , callback: this.BookingDelete(target) },
              cancel  : { label: '✘ เก็บไว้'   , callback: (e) => console.log('เก็บไว้') },
            })

          } else {
            this.DrawEventElement(hourIndex, dayIndex, this.needClean.length)
            this.currentHourIndex  = hourIndex
            this.currentDayIndex   = dayIndex
          }
        } else {
          if (this.needClean.length < 1) { return new Notify({ killall: true, red: true, head : 'การจอง', body : 'ยังไม่ได้เลือกแอร์ที่ต้องการล้าง!' }) }
          if (dayIndex < 1) { return new Notify({ killall: true, red: true, head : 'การจอง', body : 'กรุณาเลือกจองเป็นวันถัดไป!' }) }

          this.DrawEventElement(hourIndex, dayIndex, this.needClean.length)
          this.currentHourIndex  = hourIndex
          this.currentDayIndex   = dayIndex
        }
      }
    }
  }

  async SubmitEvent() {
    return async (e) => {
      e.preventDefault()

      document.getElementById('bookingForm').reset()

      if (!this.SubmittingEvent) {
        this.SubmittingEvent = true
        if (this.period.length === 1) {
          const reserv = this.period[0]
          const start = this.AdjustDate(this.today, { days: reserv.day, hours: reserv.start } )
          const end   = this.AdjustDate(this.today, { days: reserv.day, hours: reserv.end } )
          return await this.BookingAdd({
            summary     : 'นัดหมายใหม่',
            description : reserv.did,
            start       : this.FormatAddCalendar(start),
            end         : this.FormatAddCalendar(end),
          })
        }

        const events = []
        this.period.forEach(async reserv => {
          const start = this.AdjustDate(this.today, { days: reserv.day, hours: reserv.start } )
          const end   = this.AdjustDate(this.today, { days: reserv.day, hours: reserv.end } )
          const event = {
            summary     : 'นัดหมายใหม่',
            description : reserv.did,
            start       : this.FormatAddCalendar(start),
            end         : this.FormatAddCalendar(end),
          }
          events.push(event)
        })

        console.log('events', events.length)
        await this.BookingAddBatch(events)
      }
    }
  }

  async BookingAdd(event) {
    await fetch('/booking/add', {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json', Authorization: `Bearer ${this.user.token}` },
      body: JSON.stringify(event),
    }).then(async (response) => {
      console.log(response)
      if (response.status === 409) {
        new Notify({ red: true, head : 'ผลการจองคิว', body : 'เกิดข้อผิดพลาดในการจองคิว!<br/>มีใครบางคนจองก่อนหน้าคุณเพียงนิดเดียว<br/>คุณอาจต้องเลือกจองวันอื่นแทน' })
        return await this.GetCalendarEvents()
      }
      if (response.ok) {
        const result  = await response.json()
        const air     = await this.device.GetBy(result.description)
        const booked  = this.booking.Schema()
        booked.id     = result.id
        booked.did    = result.description
        booked.start  = result.start
        booked.end    = result.end
        booked.status = result.status

        if (air) {
          booked.uid  = air.uid
          booked.lid  = air.lid
        } else {
          booked.uid  = 'secret'
          booked.lid  = 'secret'
        }

        await this.booking.Add(booked)
        this.calendar.push(result)
        document.getElementById('bookingForm').reset()
        new Notify({ head : 'ผลการจองคิว', body : 'จองคิวสำเร็จ!' })
        this.DrawDevice()
        this.DrawCalendar()
        return
      }
      new Notify({ red: true, head : 'ผลการจองคิว', body : 'เกิดข้อผิดพลาดในการจองคิว!' })
    }).catch(async error => {
      new Notify({ red: true, head : 'ผลการจองคิว', body : 'เกิดข้อผิดพลาดในการจองคิว!' })
      console.error('Error:', error)
    })
  }

  async BookingAddBatch(events) {
    console.log(events)
    await fetch('/booking/batch/add', {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json', Authorization: `Bearer ${this.user.token}` },
      body: JSON.stringify({ events: events }),
    }).then(async (response) => {
      if (response.ok) {
        const result  = await response.json()
        console.log(result)
        if (result.success) {
          const error = await new Promise(async (resolve, reject) => {
            result.events.forEach(async (item, index, array) => {
              const air     = await this.device.GetBy(item.description)
              const booked  = this.booking.Schema()
              booked.id     = item.id
              booked.did    = item.description
              booked.start  = item.start
              booked.end    = item.end
              booked.status = item.status

              if (air) {
                booked.uid  = air.uid
                booked.lid  = air.lid
              } else {
                booked.uid  = 'secret'
                booked.lid  = 'secret'
              }

              this.calendar.push(item)
              await this.booking.Add(booked)
              if (index === array.length -1) resolve()
            })
          })

          if (!error) {
            new Notify({ head : 'ผลการจองคิว', body : 'จองคิวสำเร็จ!' })
            this.DrawDevice()
            this.DrawCalendar()
            return
          }
        }
      }
      new Notify({ red: true, head : 'ผลการจองคิว', body : 'เกิดข้อผิดพลาดในการจองคิว!' })
    }).catch(error => {
      new Notify({ red: true, head : 'ผลการจองคิว', body : 'เกิดข้อผิดพลาดในการจองคิว!' })
      console.error('Error:', error)
    })
  }

  BookingDelete(target) {
    return async (e) => {
      e.preventDefault()
      await fetch('/booking/delete', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json', Authorization: `Bearer ${this.user.token}` },
        body: JSON.stringify({ id: target.booked.id}),
      }).then(async (response) => {
        if (response.ok) {
          this.calendar = this.calendar.filter((item) => item.id != target.booked.id)
          await this.booking.Delete(target.booked.id)
          target.parentNode.removeChild(target)
          this.DrawDevice()
          this.DrawCalendar()
          new Notify({ head : 'ผลการยกเลิกคิว', body : 'ยกเลิกคิวสำเร็จ!' })
          return
        }
        new Notify({ red: true, head : 'ผลการจองคิว', body : 'เกิดข้อผิดพลาดในการยกเลิกคิว!' })
      }).catch(error => {
        console.error('Error:', error)
        new Notify({ red: true, head : 'ผลการจองคิว', body : 'เกิดข้อผิดพลาดในการยกเลิกคิว!' })
      })
    }
  }

}

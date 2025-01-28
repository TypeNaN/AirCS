import dbquery from "./dbquery.mjs"

export default class extends dbquery {
  constructor(api_root) {
    super()
    this._isRefreshing  = false
    this._Refresher     = null
    this.api_root       = api_root
  }

  _deschema() {
    return {
      id        : null,
      token     : null,
      expire    : null,
      name      : null,
      picture   : null,
      create    : null,
      modified  : null
    }
  }

  Schema() {
    const now     = this._now()
    const data    = this._deschema()
    data.id       = this._id()
    data.create   = now
    data.modified = now
    return data
  }

  async RequestLine() {
    //console.log('RequestLine')
    return await fetch(`${this.api_root}/line/clientid`, {
      method: 'GET'
    }).then(async response => {
      console.log(response)
      if (!response.ok) return
      const result = await response.json()
      return result
    }).catch(error => {
      console.error('Error request line client id!', error)
      return
    })
  }

  async RequestAuthorize() {
    //console.log('RequestCode')
    const locales       = 'th'
    const state         = 'login'
    let { client_id, redirect_uri } = await this.RequestLine()
    console.log(client_id, redirect_uri)
    if (!client_id) return
    redirect_uri  = `http://${window.location.hostname}:${window.location.port}/AirCS/`
    return window.location.href = `https://access.line.me/oauth2/v2.1/authorize?ui_locales=${locales}&response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${state}&scope=profile%20openid`
  }

  async RequestLogin(code) {
    //console.log('RequestLogin')
    return await fetch(`${this.api_root}/user/login`, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })
    }).then(async (response) => {
      if (!response.ok) return
      const result = await response.json()
      const user    = this.Schema()
      user.id       = result.id
      user.token    = result.token
      user.expire   = result.expire
      user.name     = result.name
      user.picture  = result.picture
      this.Put(user)
      return user
    }).catch(error => {
      console.error('Error RequestLogin:', error)
      return
    })
  }

  async RequestRefresh() {
    if (this._isRefreshing) return
    this._isRefreshing = true
    if (this._Refresher) {
      clearTimeout(this._Refresher)
      this._Refresher = null
    }

    const user = await this.GetOnce()
    if (!user) return

    let milliseconds = 0
    const calc = (user.expire * 1000) - Date.now()
    if (calc - 60000 > 0)  milliseconds = calc - 60000
    else return await this.RequestAuthorize()

    this._Refreshing = setTimeout(async () => {
      await fetch(`${this.api_root}/user/refresh`, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      }).then(async (response) => {
        if (response.ok) {
          const result = await response.json()
          user.token    = result.token
          user.expire   = result.expire
          user.modified = this._now()
          this.Put(user)
          this._isRefreshing = false
          this.RequestRefresh()
        }
      }).catch(error => {
        console.error('Error:', error)
        this._isRefreshing = false
      })
    }, milliseconds)
  }

  async RequestLogout() {
    const user = await this.GetOnce()
    if (!user) return
    return await fetch(`${this.api_root}/user/logout`, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
    }).then(async (response) => {
      await this.Delete(user.id)
      return window.location.href = '/AirCS/'
    }).catch(async error => {
      console.error('Error:', error)
      await this.Delete(user.id)
      return window.location.href = '/AirCS/'
    })
  }

  TimeLeft(expire) {
    const now = Date.now()
    const millisecondsLeft = (expire * 1000) - now
    if (millisecondsLeft <= 0) { return 'Expired' }
    let remaining = millisecondsLeft / 1000 // แปลงเป็นวินาที
    //const years = Math.floor(remaining / (365 * 24 * 60 * 60))
    //remaining %= 365 * 24 * 60 * 60
    //const months = Math.floor(remaining / (30 * 24 * 60 * 60))
    //remaining %= 30 * 24 * 60 * 60
    //const days = Math.floor(remaining / (24 * 60 * 60))
    //remaining %= 24 * 60 * 60
    //const hours = Math.floor(remaining / (60 * 60))
    remaining %= 60 * 60
    const minutes = Math.floor(remaining / 60)
    const seconds = Math.floor(remaining % 60)
    //return `${years} ปี / ${months} เดือน / ${days} วัน / ${hours} ชั่วโมง / ${minutes} นาที / ${seconds} วินาที`
    return `${minutes}:${seconds}`
  }

  async Profile(parent) {
    const user = await this.GetOnce()
    if (!user) return window.location.href = '/Aircs/'

    this.RequestRefresh()

    let container = document.getElementById('profile')
    if (!container) {
      container = document.createElement('div')
      container.id = 'profile'
      parent.appendChild(container)

      const picture = document.createElement('img')
      picture.id = 'profile-picture'
      picture.src = user.picture
      container.appendChild(picture)

      const name = document.createElement('div')
      name.id = 'profile-name'
      name.innerText = user.name
      container.appendChild(name)

      const expire = document.createElement('div')
      expire.id = 'profile-expire'
      expire.innerText = this.TimeLeft(user.expire)
      container.appendChild(expire)

      const logout = document.createElement('button')
      logout.id = 'profile-logout'
      logout.innerText = 'Logout'
      container.appendChild(logout)

      document.getElementById('profile-picture').onclick = (e) => {
        const logoutDisplay = logout.style.display
        expire.style.display = !logoutDisplay ? 'none' : logoutDisplay
        logout.style.display = ((!logoutDisplay || logoutDisplay == 'none') ? 'block' : 'none')
      }

      const ti = setInterval(() => {
        try {
          const countdown = this.TimeLeft(user.expire)
          document.getElementById('profile-expire').innerText = countdown
          if (countdown == 'Expired') {
            console.log(countdown)
            clearInterval(ti)
            //window.location.href = '/'
          }
        }
        catch (error) {
          console.error(error)
          clearInterval(ti)
          //window.location.href = '/'
        }
      }, 1000)

      document.getElementById('profile-logout').onclick = async (e) => {
        e.preventDefault()
        this.RequestLogout()
      }
    }
  }

}

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

  async RequestAuthorize() {
    fetch(`${this.api_root}/line/authorize`, {
      method  : 'GET',
    }).then(async (response) => {
      if (response.ok) {
        const result = await response.json()
        if (result.endpoint) {
          return window.location.href = result.endpoint
        }
      }
    }).catch(error => {
      console.error('Error RequestAuthorize:', error)
    })
  }

  async RequestLogin(code) {
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

  async isAlive() {
    const user = await this.GetOnce()
    if (!user) return false
    const calc = (user.expire * 1000) - Date.now()
    return calc > 0 ? user : false
  }

  async TimeLeft() {
    const user = await this.GetOnce()
    if (!user) return -1
    return (user.expire * 1000) - Date.now()
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
        if (response.status !== 200) return
        if (response.ok) {
          const result = await response.json()
          user.token    = result.token
          user.expire   = result.expire
          user.modified = this._now()
          this.Put(user)
          this._isRefreshing = false
          clearTimeout(this._Refresher)
          this._Refresher = null
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
      await this.Clear()
      return window.location.href = '/AirCS/'
    })
  }

  DrawTimeLeft(expire) {
    const now = Date.now()
    const millisecondsLeft = (expire * 1000) - now
    if (millisecondsLeft <= 0) { return 'Expired' }
    let remaining = millisecondsLeft / 1000 // แปลงเป็นวินาที
    remaining %= 60 * 60
    const minutes = Math.floor(remaining / 60)
    const seconds = Math.floor(remaining % 60)
    return `${minutes}:${seconds}`
  }

  async Profile(parent) {
    let user = await this.GetOnce()
    if (!user) return

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
      expire.innerText = this.DrawTimeLeft(user.expire)
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

      const ti = setInterval(async () => {
        try {
          user = await this.GetOnce()
          const countdown = this.DrawTimeLeft(user.expire)
          document.getElementById('profile-expire').innerText = countdown
          if (countdown == 'Expired') {
            console.log(countdown)
            clearInterval(ti)
          }
        } catch (error) {
          console.error(error)
          clearInterval(ti)
        }
      }, 1000)

      document.getElementById('profile-logout').onclick = async (e) => {
        e.preventDefault()
        this.RequestLogout()
      }
    }
  }

}

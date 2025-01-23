export default class {
  constructor() {
    this.deleted = false
    this.autoDelete = 10000

    this.container = document.getElementById('notify-container')
    if ( arguments[0].killall ) {
      if (this.container) { this.container.innerHTML = '' }
    }
    if (!this.container) {
      this.container = document.createElement( 'div' )
      this.container.id = 'notify-container'
      this.container.style.position = 'fixed'
      this.container.style.width = '100%'
      this.container.style.bottom = '10%'
      this.container.style.left = 0
      this.container.style.zIndex = 999999
      document.body.insertBefore( this.container, document.body.firstChild )
    }

    this.dom = document.createElement( 'div' )
    this.dom.style.position = 'relative'
    this.dom.style.width = 'clamp(400px, 70%, 600px)'
    this.dom.style.minHeight = '60px'
    this.dom.style.margin = '0 auto 2px auto'
    this.dom.style.padding = '5px'
    this.dom.style.lineHeight = '20px'
    this.dom.style.borderRadius = '5px'
    this.dom.style.backgroundColor = '#fff'
    this.dom.style.boxShadow = '5px 15px 10px #00000056'
    this.dom.style.opacity = 0
    this.container.appendChild( this.dom )

    this.title = document.createElement( 'div' )
    this.title.style.position = 'relative'
    this.title.style.width = '100%'
    this.title.style.height = '30px'
    this.title.style.padding = '5px'
    this.title.style.lineHeight = '20px'
    this.title.style.fontWeight = '800'
    this.title.style.textAlign = 'center'
    this.title.style.borderRadius = '5px 5px 0 0'
    this.title.style.color = '#fff'
    this.title.style.backgroundColor = arguments[0].red ? '#f43' : '#00c300'
    this.title.style.opacity = 0
    this.title.style.userSelect = 'none'
    if ( arguments[0].head ) { this.head( arguments[0].head ) }
    if ( arguments[0].icon ) { this.title.style.backgroundImage = `url( ${ arguments[0].icon } )` }
    else { this.title.style.backgroundImage = `url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgaWQ9Imljb24tc3ZnLWVkaXQiCiAgIGNsYXNzPSJpY29uLXN2Zy1lZGl0IgogICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgIGZpbGw9Im5vbmUiCiAgIHN0cm9rZT0iI2ZmZmZmZiIKICAgc3Ryb2tlLXdpZHRoPSIyIgogICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgIHN0cm9rZS1saW5lam9pbj0icm91bmQiCiAgIHZlcnNpb249IjEuMSIKICAgc29kaXBvZGk6ZG9jbmFtZT0iMy5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMy4xICg5YjliZGMxNDgwLCAyMDIzLTExLTI1LCBjdXN0b20pIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3MiIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOnpvb209IjIuODI4NDI3MSIKICAgICBpbmtzY2FwZTpjeD0iLTI0LjM5NTE4NCIKICAgICBpbmtzY2FwZTpjeT0iMzUuNzA4ODkyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTQ0MCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI4NjMiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJpY29uLXN2Zy1lZGl0IgogICAgIHNob3dndWlkZXM9InRydWUiPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMS4wMDA1MSwyMy4wMDEzNjciCiAgICAgICBvcmllbnRhdGlvbj0iMCwtMSIKICAgICAgIGlkPSJndWlkZTciCiAgICAgICBpbmtzY2FwZTpsb2NrZWQ9ImZhbHNlIiAvPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMS4wMDA3NTEzLDIyLjk5NTkyMyIKICAgICAgIG9yaWVudGF0aW9uPSIxLDAiCiAgICAgICBpZD0iZ3VpZGU4IgogICAgICAgaW5rc2NhcGU6bG9ja2VkPSJmYWxzZSIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjIzLDEiCiAgICAgICBvcmllbnRhdGlvbj0iMCwtMSIKICAgICAgIGlkPSJndWlkZTkiCiAgICAgICBpbmtzY2FwZTpsb2NrZWQ9ImZhbHNlIiAvPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMjMsMC45OTYwOTM3NSIKICAgICAgIG9yaWVudGF0aW9uPSIxLDAiCiAgICAgICBpZD0iZ3VpZGUxMCIKICAgICAgIGlua3NjYXBlOmxvY2tlZD0iZmFsc2UiIC8+CiAgPC9zb2RpcG9kaTpuYW1lZHZpZXc+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDpub25lIgogICAgIGQ9Im0gMTQuMTIyNTQ0LDIuMzQ2NCBjIDUuOTU1MzEyLC0yLjMwNTIxNTQ5IDcuNzc0NzY3LDUuNTk2MTE1MSA3Ljk2MDY0NiwxMi40Nzk1OTYgTCAyLjAyNDUyNzUsMTYuNDcwNTYxIDIuMDI2ODE3NSw2LjE0MTU1MDEgWiIKICAgICBpZD0icGF0aDEwIgogICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2MiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDpub25lIgogICAgIGQ9Ik0gNC42NjExNzM4LDEyLjgxMDcxOSAxNS4yNDM0NzksMTAuOTkxNDY2IgogICAgIGlkPSJwYXRoMTEiCiAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjYyIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOm5vbmUiCiAgICAgZD0iTSA2LjUzNTE1NjIsMTguNzQyNTc3IDMuODY1NzIyNiwyMi4wNTM4NTYiCiAgICAgaWQ9InBhdGgxNiIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOm5vbmUiCiAgICAgZD0iTSAxMS44MDIxMjQsMTguNzQyNTc3IDkuMTMyNjkwMywyMi4wNTM4NTYiCiAgICAgaWQ9InBhdGgxNyIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOm5vbmUiCiAgICAgZD0ibSAxNy4wNjkwOTIsMTguNzQyNTc3IC0yLjY2OTQzNCwzLjMxMTI3OSIKICAgICBpZD0icGF0aDE4IiAvPgo8L3N2Zz4K')` }
    this.title.style.backgroundRepeat = 'no-repeat'
    this.title.style.backgroundSize = '20px 20px'
    this.title.style.backgroundPosition = '5px 5px'
    this.title.fadein = this.fadein
    this.dom.appendChild( this.title )

    this.desc = document.createElement( 'div' )
    this.desc.style.position = 'relative'
    this.desc.style.width = '100%'
    this.desc.style.minHeight = '30px'
    this.desc.style.maxHeight = '280px'
    this.desc.style.padding = '5px'
    this.desc.style.margin = '20px auto'
    this.desc.style.borderRadius = '5px 5px 0 0'
    this.desc.style.textWrap = 'balance'
    this.desc.style.opacity = 0
    if ( arguments[0].body ) {
      if (arguments[0].body instanceof HTMLElement) { this.desc.appendChild(arguments[0].body) }
      else if (typeof arguments[0].body === 'string') { this.body( arguments[0].body ) }
    }
    this.desc.fadein = this.fadein
    this.dom.appendChild( this.desc )

    if ( arguments[0].img ) {
      this.img = document.createElement( 'div' )
      this.img.style.position = 'relative'
      this.img.style.width = '100%'
      this.img.style.height = '280px'
      this.img.style.padding = '5px'
      this.img.style.borderRadius = '0 0 5px 5px'
      this.img.style.backgroundImage = `url( ${ arguments[0].img } )`
      this.img.style.backgroundRepeat = 'no-repeat'
      this.img.style.backgroundSize = '100% auto'
      this.img.style.backgroundPosition = 'center'
      this.img.style.opacity = 0
      this.img.fadein = this.fadein
      this.dom.appendChild( this.img )
    }

    this.x = document.createElement( 'div' )
    this.x.innerHTML = '✘'
    this.x.style.position = 'absolute'
    this.x.style.top = '5px'
    this.x.style.right = '5px'
    this.x.style.width = '20px'
    this.x.style.height = '20px'
    this.x.style.color = '#f63'
    this.x.style.backgroundColor = '#fff'
    this.x.style.color = '#f63'
    this.x.style.fontSize = '1.2em'
    this.x.style.lineHeight = '20px'
    this.x.style.borderRadius = '50%'
    this.x.style.textAlign = 'center'
    this.x.style.opacity = 0
    this.x.style.userSelect = 'none'
    this.x.style.cursor = 'pointer'

    this.x.onmouseleave = (e) => { e.target.style.color = '#f63' }
    this.x.onmouseover = (e) => { e.target.style.color = '#f00' }

    this.x.onclick = () => {
      if ( !this.x.disabled ) {
        this.x.disabled = true
        this.remove()
      }
    }
    this.x.fadein = this.fadein
    this.title.appendChild( this.x )

    let delay = 0.0
    this.fadein()
    this.title.fadein( { dom: this.title, delay: delay += 0.3 } )
    if ( arguments[0].img ) { this.img.fadein( { dom: this.img, delay: delay += 0.3 } ) }
    this.desc.fadein( { dom: this.desc, delay: delay += 0.3 } )
    this.x.fadein( { dom: this.x, delay: delay += 0.3 } )

    if ( !arguments[0].still ) this.handler_isdeleted()
  }

  head(title) { if ( title ) { this.title.innerHTML = title } else { return this.title.innerHTML } }
  body(desc) { if ( desc ) { this.desc.innerHTML = `<center>${desc}</center>` } else { return this.desc.innerHTML } }

  handler_isdeleted( ) {
    let timer = setTimeout(() => {
      if ( !this.deleted ) { this.remove() }
      clearTimeout( timer )
    }, this.autoDelete)
  }

  fadein( parameter ) {
    let dom = this.dom
    let milliseconds = 1000
    let delay = 0
    let fps = 60
    if ( parameter ) {
      if ( parameter.milliseconds ) { milliseconds = parameter.milliseconds }
      if ( parameter.fps ) { fps = parameter.fps }
      if ( parameter.delay ) { delay = parameter.delay }
      if ( parameter.dom ) { dom = parameter.dom }
    }

    let seconds = ( parseFloat( milliseconds ) / parseFloat( fps ) ) * ( parseFloat( fps ) / 1000.0 )
    dom.style.animation = 'none'
    dom.style.animation = `${ seconds }s ease-out ${ delay }s 1 normal forwards running fade-in-slide-down`
  }

  remove( parameter ) {
    let dom = this.dom
    let milliseconds = 300
    let delay = 0
    let fps = 60
    if ( parameter ) {
      if ( parameter.milliseconds ) { milliseconds = parameter.milliseconds }
      if ( parameter.fps ) { fps = parameter.fps }
      if ( parameter.delay ) { delay = parameter.delay }
      if ( parameter.dom ) { dom = parameter.dom }
    }

    let seconds = ( parseFloat( milliseconds ) / parseFloat( fps ) ) * ( parseFloat( fps ) / 1000.0 )
    dom.style.animation = 'none'
    dom.style.animation = `${ seconds }s ease-out ${ delay }s 1 normal forwards running fade-out-slide-up`
    let timer = setInterval((() => {
      try {
        const style = window.getComputedStyle( dom )
        if ( parseFloat( style.opacity ) <= 0 ) {
          this.deleted = true
          dom.parentElement.removeChild( dom )
          clearInterval( timer )
        }
      } catch (error) {
        console.error( error )
        clearInterval( timer )
      }
    }), seconds)
  }
}

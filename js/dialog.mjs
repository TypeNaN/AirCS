export default class {
  constructor() {
    this.id = `dialog-${Date.now()}`

    this.container = document.createElement( 'div' )
    this.container.id = this.id
    this.container.style.position = 'fixed'
    this.container.style.display = 'flex'
    this.container.style.justifyContent = 'center'
    this.container.style.alignItems = 'center'
    this.container.style.width = '100%'
    this.container.style.height = '100%'
    this.container.style.top = 0
    this.container.style.left = 0
    this.container.style.zIndex = 999999
    this.container.style.backgroundColor = '#000000dd'
    this.container.style.animation = `0.3s ease-out 0s 1 normal forwards running fade-in`
    document.body.appendChild(this.container)

    this.dialog = document.createElement( 'div' )
    this.dialog.style.position = 'relative'
    this.dialog.style.width = 'clamp(400px, 70vw, 600px)'
    this.dialog.style.minHeight = '180px'
    this.dialog.style.maxHeight = '600px'
    //this.dialog.style.height = 'clamp(180px, 70vh, 600px)'
    this.dialog.style.padding = '5px'
    this.dialog.style.lineHeight = '20px'
    this.dialog.style.borderRadius = '5px'
    this.dialog.style.backgroundColor = '#fff'
    this.dialog.style.boxShadow = '5px 15px 10px #00000056'
    this.dialog.style.opacity = 0
    this.dialog.style.animation = `1s ease-out 0s 1 normal forwards running fade-in-slide-down`
    this.container.appendChild(this.dialog)

    this.head = document.createElement( 'div' )
    this.head.style.position = 'relative'
    this.head.style.width = '100%'
    this.head.style.height = '40px'
    this.head.style.padding = '5px'
    this.head.style.fontSize = '1.4rem'
    this.head.style.lineHeight = '30px'
    this.head.style.fontWeight = '800'
    this.head.style.textAlign = 'center'
    this.head.style.borderRadius = '5px 5px 0 0'
    this.head.style.color = '#fff'
    this.head.style.backgroundColor = arguments[0].red ? '#f43' : '#00c300'
    this.head.style.userSelect = 'none'
    if ( arguments[0].head ) { this.head.innerHTML = arguments[0].head }
    if ( arguments[0].icon ) { this.head.style.backgroundImage = `url( ${ arguments[0].icon } )` }
    else { this.head.style.backgroundImage = `url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgaWQ9Imljb24tc3ZnLWVkaXQiCiAgIGNsYXNzPSJpY29uLXN2Zy1lZGl0IgogICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgIGZpbGw9Im5vbmUiCiAgIHN0cm9rZT0iI2ZmZmZmZiIKICAgc3Ryb2tlLXdpZHRoPSIyIgogICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgIHN0cm9rZS1saW5lam9pbj0icm91bmQiCiAgIHZlcnNpb249IjEuMSIKICAgc29kaXBvZGk6ZG9jbmFtZT0iMy5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMy4xICg5YjliZGMxNDgwLCAyMDIzLTExLTI1LCBjdXN0b20pIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3MiIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOnpvb209IjIuODI4NDI3MSIKICAgICBpbmtzY2FwZTpjeD0iLTI0LjM5NTE4NCIKICAgICBpbmtzY2FwZTpjeT0iMzUuNzA4ODkyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTQ0MCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI4NjMiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJpY29uLXN2Zy1lZGl0IgogICAgIHNob3dndWlkZXM9InRydWUiPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMS4wMDA1MSwyMy4wMDEzNjciCiAgICAgICBvcmllbnRhdGlvbj0iMCwtMSIKICAgICAgIGlkPSJndWlkZTciCiAgICAgICBpbmtzY2FwZTpsb2NrZWQ9ImZhbHNlIiAvPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMS4wMDA3NTEzLDIyLjk5NTkyMyIKICAgICAgIG9yaWVudGF0aW9uPSIxLDAiCiAgICAgICBpZD0iZ3VpZGU4IgogICAgICAgaW5rc2NhcGU6bG9ja2VkPSJmYWxzZSIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjIzLDEiCiAgICAgICBvcmllbnRhdGlvbj0iMCwtMSIKICAgICAgIGlkPSJndWlkZTkiCiAgICAgICBpbmtzY2FwZTpsb2NrZWQ9ImZhbHNlIiAvPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMjMsMC45OTYwOTM3NSIKICAgICAgIG9yaWVudGF0aW9uPSIxLDAiCiAgICAgICBpZD0iZ3VpZGUxMCIKICAgICAgIGlua3NjYXBlOmxvY2tlZD0iZmFsc2UiIC8+CiAgPC9zb2RpcG9kaTpuYW1lZHZpZXc+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDpub25lIgogICAgIGQ9Im0gMTQuMTIyNTQ0LDIuMzQ2NCBjIDUuOTU1MzEyLC0yLjMwNTIxNTQ5IDcuNzc0NzY3LDUuNTk2MTE1MSA3Ljk2MDY0NiwxMi40Nzk1OTYgTCAyLjAyNDUyNzUsMTYuNDcwNTYxIDIuMDI2ODE3NSw2LjE0MTU1MDEgWiIKICAgICBpZD0icGF0aDEwIgogICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2MiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDpub25lIgogICAgIGQ9Ik0gNC42NjExNzM4LDEyLjgxMDcxOSAxNS4yNDM0NzksMTAuOTkxNDY2IgogICAgIGlkPSJwYXRoMTEiCiAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjYyIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOm5vbmUiCiAgICAgZD0iTSA2LjUzNTE1NjIsMTguNzQyNTc3IDMuODY1NzIyNiwyMi4wNTM4NTYiCiAgICAgaWQ9InBhdGgxNiIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOm5vbmUiCiAgICAgZD0iTSAxMS44MDIxMjQsMTguNzQyNTc3IDkuMTMyNjkwMywyMi4wNTM4NTYiCiAgICAgaWQ9InBhdGgxNyIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOm5vbmUiCiAgICAgZD0ibSAxNy4wNjkwOTIsMTguNzQyNTc3IC0yLjY2OTQzNCwzLjMxMTI3OSIKICAgICBpZD0icGF0aDE4IiAvPgo8L3N2Zz4K')` }
    this.head.style.backgroundRepeat = 'no-repeat'
    this.head.style.backgroundSize = '30px 30px'
    this.head.style.backgroundPosition = '5px 5px'
    this.dialog.appendChild(this.head)

    this.x = document.createElement( 'div' )
    this.x.innerHTML = '✘'
    this.x.style.position = 'absolute'
    this.x.style.top = '5px'
    this.x.style.right = '5px'
    this.x.style.width = '30px'
    this.x.style.height = '30px'
    this.x.style.color = '#f63'
    this.x.style.backgroundColor = '#fff'
    this.x.style.color = '#f63'
    this.x.style.fontSize = '1.2em'
    this.x.style.lineHeight = '30px'
    this.x.style.borderRadius = '50%'
    this.x.style.textAlign = 'center'
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

    this.head.appendChild(this.x)

    this.body = document.createElement( 'div' )
    this.body.style.position = 'relative'
    this.body.style.display = 'flex'
    this.body.style.justifyContent = 'center'
    this.body.style.alignItems = 'center'
    this.body.style.width = '100%'
    this.body.style.minHeight = '70px'
    this.body.style.maxHeight = '495px'
    //this.body.style.height = 'clamp(70px, calc(100% - 94px), 495px)'
    this.body.style.padding = '5px'
    this.body.style.borderRadius = '5px 5px 0 0'
    this.body.style.textWrap = 'balance'
    this.body.style.overflowX = 'hidden'
    this.body.style.overflowY = 'auto'
    if ( arguments[0].body ) {
      if (arguments[0].body instanceof HTMLElement) { this.body.appendChild(arguments[0].body) }
      else if (typeof arguments[0].body === 'string') { this.body.innerHTML = `<center>${arguments[0].body}</center>` }
    }

    this.dialog.appendChild(this.body)

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
      this.dialog.appendChild( this.img )
    }

    this.footer = document.createElement('div')
    this.footer.style.display = 'flex'
    this.footer.style.justifyContent = 'space-evenly'
    this.footer.style.alignItems = 'center'
    this.dialog.appendChild(this.footer)

    if ( arguments[0].accept ) {
      const resolve = document.createElement('button')
      resolve.innerHTML = arguments[0].accept.label
      resolve.className = 'dialog-accept'
      resolve.style.minWidth = '50px'
      resolve.style.minHeight = '30px'
      resolve.style.backgroundColor = '#37af8c'
      resolve.style.color = '#fff'
      resolve.style.textAlign = 'center'
      resolve.onclick = async (e) => {
        e.preventDefault()
        if ( !e.target.disabled ) {
          e.target.disabled = true
          this.remove()
          await arguments[0].accept.callback(e)
        }
      }
      resolve.onmouseleave = (e) => {
        e.target.style.backgroundColor = '#37af8c'
      }
      resolve.onmouseover = (e) => {
        e.target.style.backgroundColor = '#59cfae'
      }
      this.footer.appendChild(resolve)
    }

    if ( arguments[0].cancel ) {
      const reject = document.createElement('button')
      reject.innerHTML = arguments[0].cancel.label
      reject.className = 'dialog-cancel'
      reject.style.minWidth = '50px'
      reject.style.minHeight = '30px'
      reject.style.backgroundColor = '#f63'
      reject.style.color = '#fff'
      reject.style.textAlign = 'center'
      reject.onclick = async (e) => {
        e.preventDefault()
        if ( !e.target.disabled ) {
          e.target.disabled = true
          this.remove()
          await arguments[0].cancel.callback(e)
        }
      }
      reject.onmouseleave = (e) => {
        e.target.style.backgroundColor = '#f63'
      }
      reject.onmouseover = (e) => {
        e.target.style.backgroundColor = '#f85'
      }
      this.footer.appendChild(reject)
    }
  }

  remove() {
    const container = this.container
    const dialog = this.dialog
    dialog.style.animation = 'none'
    dialog.style.animation = `0.3s ease-out 0s 1 normal forwards running fade-out`
    container.style.animation = `0.3s ease-out 0s 1 normal forwards running fade-out`

    let timer = setInterval((() => {
      try {
        const style = window.getComputedStyle( dialog )
        if ( parseFloat( style.opacity ) <= 0 ) {
          container.removeChild( dialog )
          document.body.removeChild( container )
          clearInterval( timer )
        }
      } catch (error) {
        console.error( error )
        clearInterval( timer )
      }
    }), 50)
  }
}

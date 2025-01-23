export default class {
  constructor(name, stores) {
    this._name    = name
    this._ready   = false
    this._db      = null
    this._stores  = stores
  }

  async Open() {
    const indexedDB = (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB)
    if (!indexedDB) return console.error("Browser doesn't support a stable version of IndexedDB.")
    this._db = await new Promise((resolve, reject) => {
      const request     = indexedDB.open(this._name)
      request.onerror   = (event) => reject(event.target.error)
      request.onblocked = (event) => reject(event.target.error)
      request.onsuccess = (event) => {
        resolve(event.target.result)
        this._ready = true
      }
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        this._stores.forEach((store) => {
          let objectStore
          if (!db.objectStoreNames.contains(store.key)) {
            objectStore = db.createObjectStore(store.key, store.option)
            if (store.indexes) {
              store.indexes.forEach((index) => {
                if (!objectStore.indexNames.contains(index.name)) {
                  objectStore.createIndex(index.name, index.keyPath, index.option || {})
                }
              })
            }
          }
        })
      }
    })
  }

  async upgrade(version) {
    if (this._db) this._db.close()
    this._db = await new Promise((resolve, reject) => {
      const request     = indexedDB.open(this._name, version)
      request.onerror   = (event) => reject(event.target.error)
      request.onblocked = (event) => reject(event.target.error)
      request.onsuccess = (event) => {
        resolve(event.target.result)
        this._ready = true
      }
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        this._stores.forEach((store) => {
          let objectStore
          if (!db.objectStoreNames.contains(store.key)) {
            objectStore = db.createObjectStore(store.key, store.option)
            if (store.indexes) {
              store.indexes.forEach((index) => {
                if (!objectStore.indexNames.contains(index.name)) {
                  objectStore.createIndex(index.name, index.keyPath, index.option || {})
                }
              })
            }
          }
        })
      }
    })
  }

  async RW(store) {
    return {
      Add: async (data) => {
        return await new Promise((resolve, reject) => {
          const transactions  = this._db.transaction(store, 'readwrite')
          const objectStore   = transactions.objectStore(store)
          const request       = objectStore.add(data)
          request.onerror     = (event) => reject(event.target.error)
          request.onblocked   = (event) => reject(event.target.error)
          request.onsuccess   = (event) => resolve(event.target.result)
        })
      },
      Put: async (data) => {
        return await new Promise((resolve, reject) => {
          const transactions  = this._db.transaction(store, 'readwrite')
          const objectStore   = transactions.objectStore(store)
          const request       = objectStore.put(data)
          request.onerror     = (event) => reject(event.target.error)
          request.onblocked   = (event) => reject(event.target.error)
          request.onsuccess   = (event) => resolve(event.target.result)
        })
      },
      Delete: async (value) => {
        return await new Promise((resolve, reject) => {
          const transaction   = this._db.transaction(store, 'readwrite')
          const objectStore   = transaction.objectStore(store)
          const request       = objectStore.delete(value)
          request.onerror     = (event) => reject(event.target.error)
          request.onblocked   = (event) => reject(event.target.error)
          request.onsuccess   = (event) => resolve(event.target.result)
        })
      },
      Clear: async (store) => {
        return await new Promise((resolve, reject) => {
          const transaction   = this._db.transaction(store, 'readwrite')
          const objectStore   = transaction.objectStore(store)
          const request       = objectStore.clear()
          request.onerror     = (event) => reject(event.target.error)
          request.onblocked   = (event) => reject(event.target.error)
          request.onsuccess   = (event) => resolve(event.target.result)
        })

      }
    }
  }

  async R(store) {
    return {
      Get: async (sort) => {
        return await new Promise((resolve, reject) => {
          const transactions  = this._db.transaction(store, 'readonly')
          const objectStore   = transactions.objectStore(store)
          const result        = []

          const request = sort
            ? objectStore.openCursor(null, sort)
            : objectStore.getAll()

          request.onerror   = (event) => reject(event.target.error)
          request.onblocked = (event) => reject(event.target.error)
          request.onsuccess = (event) => {
            if (sort) {
              const cursor  = event.target.result
              if (cursor) {
                result.push(cursor.value)
                cursor.continue()
              } else {
                resolve(result)
              }
            } else {
              resolve(event.target.result)
            }
          }
        })
      },
      GetBy: async (value) => {
        return await new Promise((resolve, reject) => {
          const transactions  = this._db.transaction(store, 'readonly')
          const objectStore   = transactions.objectStore(store)
          const request       = objectStore.get(value)
          request.onerror     = (event) => reject(event.target.error)
          request.onblocked   = (event) => reject(event.target.error)
          request.onsuccess   = (event) => resolve(event.target.result)
        })
      },
      GetFrom: async (index, value, sort) => {
        return await new Promise((resolve, reject) => {
          const transactions  = this._db.transaction(store, 'readonly')
          const objectStore   = transactions.objectStore(store)

          const result      = []
          const request     = value
            ? objectStore.index(index).openCursor(IDBKeyRange.only(value), sort)
            : objectStore.index(index).openCursor(null, sort)

          request.onerror   = (event) => reject(event.target.error)
          request.onblocked = (event) => reject(event.target.error)
          request.onsuccess = (event) => {
            const cursor    = event.target.result
            if (cursor) {
              result.push(cursor.value)
              cursor.continue()
            } else {
              resolve(result)
            }
          }
        })
      },
    }
  }

}

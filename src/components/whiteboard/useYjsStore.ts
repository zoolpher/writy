import { useState, useEffect } from 'react'
import { createTLStore, defaultShapeUtils, TLRecord, TLStoreWithStatus } from 'tldraw'
import * as Y from 'yjs'
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import { useRoom } from '@liveblocks/react'

export function useYjsStore() {
  const room = useRoom()
  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
    status: 'loading',
  })

  useEffect(() => {
    let unsubs: (() => void)[] = []
    
    // 1. Initialize the Yjs document and connect it to the Liveblocks Room
    const yDoc = new Y.Doc()
    const yProvider = new LiveblocksYjsProvider(room, yDoc)
    const yMap = yDoc.getMap<TLRecord>('store')

    // 2. Create a brand new Tldraw store
    const store = createTLStore({ shapeUtils: defaultShapeUtils })

    // Track if we have already initialized to prevent duplicate listeners on reconnects!
    let hasInitialized = false

    // 3. Setup the real-time sync once connected
    const handleSync = (isSynced: boolean) => {
      if (!isSynced || hasInitialized) return
      hasInitialized = true

      // If the room is completely empty (brand new), initialize the canvas layout
      if (yMap.size === 0) {
        yDoc.transact(() => {
          yMap.set('document:document' as any, { typeName: 'document', id: 'document:document', gridSize: 10, name: '', meta: {} } as any)
          yMap.set('page:page' as any, { typeName: 'page', id: 'page:page', name: 'Page 1', index: 'a1', meta: {} } as any)
        })
      }

      // Sync the initial drawing state from Liveblocks to the local canvas
      store.mergeRemoteChanges(() => {
        store.put(Array.from(yMap.values()))
      })

      // Watch for changes from OTHER users over WebSockets
      yMap.observe((event) => {
        store.mergeRemoteChanges(() => {
          event.changes.keys.forEach((change, key) => {
            if (change.action === 'add' || change.action === 'update') {
              store.put([yMap.get(key)!])
            } else if (change.action === 'delete') {
              store.remove([key as any])
            }
          })
        })
      })

      // Watch for YOUR local drawings and send them to Liveblocks
      unsubs.push(
        store.listen(
          ({ changes }) => {
            yDoc.transact(() => {
              Object.values(changes.added).forEach((record) => yMap.set(record.id, record))
              Object.values(changes.updated).forEach(([_, record]) => yMap.set(record.id, record))
              Object.values(changes.removed).forEach((record) => yMap.delete(record.id))
            })
          },
          { source: 'user', scope: 'document' } 
        )
      )

      // Tell Tldraw that the store is completely ready to use
      setStoreWithStatus({ store, status: 'synced-remote', connectionStatus: 'online' })
    }

    // Attach the sync handler
    yProvider.on('sync', handleSync)

    // Cleanup when the user leaves the room
    return () => {
      unsubs.forEach((fn) => fn())
      yProvider.off('sync', handleSync)
      yProvider.destroy()
      yDoc.destroy()
    }
  }, [room.id])

  return storeWithStatus
}

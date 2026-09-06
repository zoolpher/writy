import { useEffect, useMemo, useState } from "react";
import { useRoom } from "@liveblocks/react";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { YKeyValue } from "y-utility/y-keyvalue";
import * as Y from "yjs";
import {
  createTLStore,
  transact,
  defaultShapeUtils,
  TLRecord,
  TLStoreWithStatus,
} from "tldraw";

export function useYjsStore() {
  const room = useRoom();

  const { yDoc, yStore, yProvider } = useMemo(() => {
    const yDoc = new Y.Doc();
    yDoc.gc = true;
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    const yArr = yDoc.getArray<{ key: string; val: TLRecord }>("tl_records");
    const yStore = new YKeyValue(yArr);

    return { yDoc, yStore, yProvider };
  }, [room.id]);

  const [store] = useState(() => createTLStore({ shapeUtils: defaultShapeUtils }));
  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({ status: "loading" });

  useEffect(() => {
    setStoreWithStatus({ status: "loading" });

    const unsubs: (() => void)[] = [];
    let hasInitialized = false;

    function handleSync(isSynced: boolean) {
      if (!isSynced || hasInitialized) return;
      hasInitialized = true;

      // 1. Initialize tldraw from Yjs, or if Yjs empty, init Yjs from default tldraw records
      if (yStore.yarray.length) {
        transact(() => {
          store.clear();
          const records = yStore.yarray.toJSON().map((item: any) => item.val);
          store.put(records);
        });
      } else {
        yDoc.transact(() => {
          for (const record of store.allRecords()) {
            yStore.set(record.id, record);
          }
        });
      }

      // 2. Sync tldraw changes back to Yjs
      unsubs.push(
        store.listen(
          ({ changes }) => {
            yDoc.transact(() => {
              Object.values(changes.added).forEach((record) => { yStore.set(record.id, record); });
              Object.values(changes.updated).forEach(([_, record]) => { yStore.set(record.id, record); });
              Object.values(changes.removed).forEach((record) => { yStore.delete(record.id); });
            });
          },
          { source: "user", scope: "document" }
        )
      );

      // 3. Sync Yjs changes back to tldraw
      const handleChange = (
        changes: Map<string, any>,
        transaction: Y.Transaction
      ) => {
        if (transaction.local) return;

        const toRemove: TLRecord["id"][] = [];
        const toPut: TLRecord[] = [];

        changes.forEach((change, id) => {
          switch (change.action) {
            case "add":
            case "update":
              toPut.push(yStore.get(id)!);
              break;
            case "delete":
              toRemove.push(id as TLRecord["id"]);
              break;
          }
        });

        store.mergeRemoteChanges(() => {
          if (toRemove.length) store.remove(toRemove);
          if (toPut.length) store.put(toPut);
        });
      };

      yStore.on("change", handleChange);
      unsubs.push(() => yStore.off("change", handleChange));

      setStoreWithStatus({
        store,
        status: "synced-remote",
        connectionStatus: "online",
      });
    }

    yProvider.on("sync", handleSync);

    return () => {
      unsubs.forEach((fn) => fn());
      yProvider.off("sync", handleSync);
      yProvider.destroy();
      yDoc.destroy();
    };
  }, [yProvider, yDoc, store, yStore]);

  return storeWithStatus;
}

import { useState, useEffect, useRef, useCallback } from 'react'
import { Peer } from 'peerjs'
import { nanoid } from 'nanoid'

const storageHelper = (_KEY_SUFFIX: string) => {
  return (lobbyId: string) => {
    const key = [lobbyId, _KEY_SUFFIX].join(':');
    const exists = () => {
      const raw = localStorage.getItem(key);
      return !!raw;
    };
    const get = () => {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw).val;
      } else {
        return null
      }
    };
    const set = (v: any) => {
      localStorage.setItem(key, JSON.stringify({ val: v }) );
      return v;
    }
    const update = (xform: () => {}) => {
      const old = get();
      set(cb(old));
    };
    const loadWithDefault = (defVal: any) => {
      let it = get();
      if (!it) {
        if (typeof defVal === 'function') { 
          it = defVal();
        } else {
          it = defVal;
        }
        set(it);
      }
      return it;
      
    };
    return { exists, get, set, loadWithDefault, update };
  };
};


const storage = {
  myPlayerInfo: storageHelper('my-player-info'),
}


const appendObservedPeerIdForPlayer = (gameState: any, upd: { peerId: string, playerId: string }) => {
  const old = gameState;
  const { peerId, playerId } = upd;
  return {
    ...old,
    myPlayerInfo: {
      ...(old.myPlayerInfo),
      allPlayerPeerIds: {
        ...(old.myPlayerInfo.allPlayerPeerIds),
        [playerId]: [
          ...(old.myPlayerInfo.allPlayerPeerIds[playerId] || []),
          peerId,
        ],
      }
    }
  };
}

function NewGame() {
  // const [count, setCount] = useState(0)
  const initialState = {};

  const urlPathArray = window.location.pathname.split('/');
  // expect format: "", "lobby-id", "peer-id"?
  let lobbyId = urlPathArray[1];
  let connectionHost = urlPathArray[2];

  if (!lobbyId) {
    // generate a new lobbyId and set it
    lobbyId = nanoid(8);
    history.replaceState(null, "", `/${lobbyId}`);
    
  }
  initialState.url = window.location.pathname.split('/');
  initialState.lobbyId = lobbyId ;

  // look up our player id in localstorage, if we can find one
  // if (storage.myPlayerId(lobbyId).exists()) {
  //   const myPlayerInfo = storage.myPlayerInfo(lobbyId).get();
  //   initialState.myPlayerInfo = myPlayerInfo;

  //   initialState.myPlayerId = storage.myPlayerId(lobbyId).get();
  //   initialState.gameSeed = storage.gameSeed(lobbyId).get();
  //   initialState.allPlayerIds = storage.allPlayerIds(lobbyId).get();
  //   initialState.allPlayerPeerIds = storage.allPlayerPeerIds(lobbyId).get();
  // } else {
  // }
  initialState.myPlayerInfo = storage.myPlayerInfo(lobbyId).loadWithDefault(() => {
    const myPlayerId = nanoid(12);
    return {
      myPlayerId,
      gameSeed: nanoid(12),
      allPlayerIds: [myPlayerId],
      allPlayerPeerIds: { [myPlayerId]: [] },
    };
  });

  if (connectionHost) {
    initialState.connectionHost = connectionHost;
    // initialState.allPlayerIds = storage.allPlayerIds(lobbyId).set([initialState.myPlayerId]);
  }
  else {
    // then we are host
  }

  // initiate peer connection(s)
  const [reactiveCurrentGameState, requestChangeState] = usePeer(initialState);

  // onClick = requestChangeState(blah)

  return (
    <>
      <pre>
        {JSON.stringify(reactiveCurrentGameState, undefined ,2)}
      </pre>
    </>
  )
}

function usePeer(initialState: Object) {

  const [gameState, setGameState] = useState(initialState);

  const currentGameState = useRef(gameState);

  // useEffect(() => {
  //   currentGameState.current = gameState;
  // }, [gameState]);

  let sendUpdateGameState: (() => void | undefined) = undefined;

  const meUpdateGameState = useCallback((valueOrCb: any) => {
    setGameState((pr) => {
      const ft = typeof valueOrCb === 'function' ? valueOrCb(pr) : valueOrCb;
      currentGameState.current = ft;
      sendUpdateGameState?.(ft);
      return ft;
    });
  }, []);

  useEffect(() => {
    const peer = new Peer({
      host: "tbbts-server-bbsi2.sprites.app",
      port: "443",
      path: "/",
      debug: 1,
    });
    peer.on('error', e => { /* hmm */ })
    peer.on('open', id => {

      // meUpdateGameState(old => { return {...old, peerId: id } });
      meUpdateGameState(old => appendObservedPeerIdForPlayer(old, { peerId: id, playerId: old.myPlayerInfo.myPlayerId }));
      
      const connectionHost = gameState.connectionHost;
      if (connectionHost) {
        const conn = peer.connect(connectionHost);
        
        conn.on('open', () => {
          conn.send({ type: 'hello', peerId: id, myPlayerId: gameState.myPlayerId });
          console.log('i sent hello to the host');
        });

        conn.on('data', (data) => {
          meUpdateGameState(old => ({ ...old, staleDebug: data }));
          console.log('i got my hello reply back from the host');
        });
      }
    });
    peer.on('connection', (c) => {
      console.log('received connection', c);
      c.on('open', () => {
        // first we will try to send our stuff
        sendUpdateGameState = () => {
          console.log('i reply', currentGameState.current);
          if (currentGameState.current) {
            // if for some reason the ref is not ready yet, not to worry, we will resend it during the ref lifecycle
            c.send({ type: 'update', gameState: currentGameState.current });
          }
        };
        sendUpdateGameState();
      });
      c.on('data', (data) => {
        
        meUpdateGameState(old => ({ ...old, staleDebug: data }));
      });
    });
 
 
    return () => {
      peer?.disconnect();
      peer?.destroy();
      setGameState(old => { return {...old, peerId: undefined } });
    };
  }, []);

  return [gameState, () => { /* TODO */ } ];
}

export default NewGame

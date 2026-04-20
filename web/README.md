## web

HTML + JS impmlementation of TBBtS

uses peerjs + client-side game logic (it's coop anyways)

## arch

fully p2p, no data stored on server.

player 1 creates a new game by navigating to website.url -> create new game ->

generates website.url/lobby-id-here . 

Each browser + game holds a "player-id", stable, stored in localstorage. Stable across refresh

BUT - client id is not a good medium for p2p webrtc, instead we need a peer-id which might change on refresh.

To share the game with someone, a link generates website.url/lobby-id-here/peer-id

player 2 loads the website, generates a local player-2-id, and connects via webrtc to peer-id.

player 1 and player 2 then store each others' player-ids and also a list of all known peer-ids that they have seen the other player connect as. this is used for if player1 or player2 temporarily disconnects/reconnects. 

If both players disconnect then the connection is lost and one of them will need to regenerate an invite link. (no data stored server side!!)
 



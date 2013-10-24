Code pastes saved in local storage and shared via websockets
=====

Allows you paste text which is saved in your browser's local storage.
You can send the URL of your paste to anyone, and they will be able to to see it.
Viewers will connect to your browser via a websocket, and will be able to access your paste
for as long as you are connected to the website.

Advantages:

* __Ownership.__ There is no server side database, so nothing will be stored on the server.
You are in posession of all code pastes.
* __(*Un*)availability.__ Once you leave this site, it will be impossible for anyone to see your
code paste, even if they have its URL.
* __Privacy.__ Search engines won't be able to index and share your pastes.

See an example at http://mem.pe

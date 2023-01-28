# Video call webapp based on WebRTC API

WebRTC api is inbuilt in modern web browsers

Link to WebRTC API documentation

https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API

# socket.io https://socket.io/

For video call or chat systems, some implementation of web sockets is useful. To facilitate real time communication(RTC) between the users (as required in video call), I used socket.io library (it's free)

Before using WebRTC for actual real time video stream exchange, we need to pass signalling stage. In this stage, the caller and callee try gathering more details about each other such as network status(fast or slow internet connection, according to which quality of vidoe call is set), public IP address(i.e. IP address of Router the user's device is connected to, and not of the mobile/computer itself). Read WebRTC docs.

For this signalling stage, we can use AJAX(or XMLHttpRequest) as well instead of socket.io, but you may have guessed, AJAX is resources hungry for RTC. Had we not implemented socket.io, we would have made an AJAX call each second or so.  It is commonly referred to as polling the server(i.e client periodically calling the server to find if there are any new notifications)

Actually, I had first tried using AJAX call to PHP endpoint. The video call was successful but the hosting service provider(InfinityFree) suspended my website very soon because the resource usage exceeded the limit for free account. I couldn't even test properly.  WebSockets provide a more efficient alternative to continually polling your application's server for data changes that should be reflected in your UI.

I switched to Heroku after implementing socket.io in conjunction with NodeJS(insted of PHP). Heroku was sufficient for testing purposes.

# Working flow

- user A lands on my website

- he now is associated with a unique socket id to enable RTC between himself and server(node js)

- socket id is the unquie key that identifies users connected to websocket

- the socket id of all the users who land on my website are then logged on to the waiting list in the database 

- If user A clicks on "START" button, "startCall" event is emitted from browser to node js server(where socket.io is also running)

- When server receives "startCall" event, the server checks whether there are any free users(the users who are not currently on call)

- Suppose the server retrieves free user B, then the socket id of users A and B are removed from the pool of waiting list. So those users form another row in database table currently_on_call (to track busy users). Then the server emits another event "proceedToCall" to both users A and B

- In case no any user is available, the server emits "userNotFound" event to the caller(user A in this case) by the help of socket id

- When "proceedToCall" event is received by both users, WebRTC comes into play for the exchange of video data between them

- when the call terminates (one of the users clicks on "End Call" button, the socket id of those users are first removed from the currently_on_call list, and they are inserted to waiting list

- if the users are disconnected from internet, they are removed from the waiting list table as well as currently_on_call (in case they were)

# Main file holding logic for video call

https://github.com/arjun703/itsVidTime/blob/main/itsvidtime-php-part/videocall.js

- uses vanilla javascript

# Main file holding logic for real time notifications

https://github.com/arjun703/itsVidTime/blob/main/itsvidtime-node-js-part/server.js

- uses Node js

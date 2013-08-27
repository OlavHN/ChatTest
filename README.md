# Extremly simple chat

An example chat application showing how to abstract away PeerConnection as a DOM element using Web Components

## Why

Since webRTC is still changing quickly, highly coupled to the browser environment and inherently between two instances it makes sense to abstract it away. Web Components seems like an ideal solution as it abstracts DOM elements behind higher level DOM elements. <code><appear-in></appear-in></code> is an attempt at making such an element and it looks like this: <code><appear-in peerId='anId' local=stream remote=stream></appear-in></code>.

By giving the element an id and a local stream the remote stream will correspond to another <code><appear-in /></code> tag somewhere on the internet.

## How

When both `peerId` and `local` is set a websocket is created to facilitate the PeerConnection handshake and on success it will close. In this way there is no persistence, state or even server interaction beyond the inital setup.

## Again .. why !?

By doing this
<ul>
  <li>webRTC is abstracted away leaving you free to make the service as you want</li>
  <li>The element is a standard DOM element. Gives lots of new flexibility for third party integration</li>
  <li>The signaling is pure websocket. Handshake can be standardized after RFC 6455</li>
</ul>

## Scalability

Since there is no state each pair only needs two server connections for the duration of the handshake (seconds). Also, server partitioning can be done by url load balancing as the `peerId` is given in the url. i.e:

<code>var signaling_channel = new WebSocket('ws://signalingserver.com/someCommonPeerId');</code>

## How to

This example have two servers: One RTC signaling server (server.js) and one chat room server using the `<appear-in />` element (chat.js).

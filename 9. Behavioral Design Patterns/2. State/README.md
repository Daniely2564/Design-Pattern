# State

The **State** pattern is a specialization of the **Strategy pattern** where the strategy changes depending on the _state_ of the context.

The _Strategy_ (also called the **state** in this circumstance) is dynamic and can change during the lifetime of the context, thus allowing its behavior to adapt depending on its internal state.

@import "../../src/State Diagram.PNG"

The figure shows how a context object transitions through three states (A,B, and C). With the State pattern, at each different context state, we select a different strategy. This means that the context object will adopt a different behavior based on the state it's in.

#### Example (Hotel)

Imagine we have a hotel booking system and an object called **Reservation** that models a room reservation. This is a typical situation where we have to adapt the behavior of an object based on its state.

Consider the following series of events:

**Confirm**

- When the reservation is initially created, the user can confirm using **confirm()**
- They cannot cancel it because it's still not confirmed
- They can delete if using **delete()** if they _change_ their mind before buying.

**Cancel**

- Once the reservation is confirmed, using the **confirm()** method again does not make any sense; however, now it should be possible to cancel the reservation but no longer delete it, because it has to be kept for the records.
- On the day before the reservation date, it should not be possible to cancel the reservation anymore; it's too late for that.

@import "../../src/State Pattern Example.PNG"

By using **State Pattern**, we can easily make Reservation object to switch from one behavior to another; this would simply require the **activation** of a different strategy on each state change.

### Implementing a basic failsafe socket

Let's build a TCP client socket that does not fail when the connection with the server is lost; instead, we want to queue all the data sent udring the time in which the server is offline and then try to send it again as soon as the connection is reestablished.

**Goal:** Leverage this socket in the context of a simple monitoring system, where a set of machines sends some statistics about their resource utilization at regular intervals. If the server that collects these resources goes down, our socket will continue to queue the data locally until the server comes back online.

```javascript
// failsafeSocket.js
import { OfflineState } from "./offlineState.js";
import { OnlineState } from "./onlineState.js";

export class FailesafeSocket {
  // (1) Initialize various data structure
  // Creates Two states : implementing behaviors when its online/offline
  constructor(options) {
    this.options = options;
    this.queue = [];
    this.currentState = null;
    this.socket = null;
    this.states = {
      offline: new OfflineState(this),
      online: new OnlineState(this),
    };
    this.changeState("offline");
  }

  // (2) responsible for transitioning from one state to another.
  //     updates the currentState instance variable and call activate() on the target state
  changeState(state) {
    console.log(`Activating state : ${state}`);
    this.currentState = this.states[state];
    this.currentState.activate();
  }

  // (3) contains the main functionality of the FailsafeSocket class.
  // We want to have a different behavior based on the offline/online state.
  send(data) {
    this.currentState.send(data);
  }
}
```

```javascript
// offlineState.js
// (1) Intead of using a row TCP socekt, we will use json-over-tcp-2
// it will take care of all the parsing and formatting of the data through socket into JSON objects.
import jsonOverTcp from "json-over-tcp-2";

export class OfflineState {
  constructor(failsafeSocket) {
    this.failsafeSocket = failsafeSocket;
  }

  // (2) only responsible for queuing any data it receives.
  // This is for offline so that we can send it when its online.
  send(data) {
    this.failsafeSocket.queue.push(data);
  }

  // (3) Tries to establish a connection with server using the json-over-tcp-2 socket.
  // Tries every second. Continues until a vliad connection is established.
  activate() {
    const retry = () => {
      setTimeout(() => this.activate(), 1000);
    };

    console.log("Trying to connect...");
    this.failsafeSocket.socket = jsonOverTcp.connect(
      this.failsafeSocket.options,
      () => {
        console.log("Connection established");
        this.failsafeSocket.socket.removeListener("error", retry);
        this.failsafeSocket.changeState("online");
      }
    );
    this.failsafeSocket.socket.once("error", retry);
  }
}
```

```javascript
// onlineState.js
export class OnlineState {
  constructor(failesafeSocket) {
    this.failsafeSocket = failesafeSocket;
    this.hasDisconnected = false;
  }

  // (1) queues the data and then immediately tries to write it
  //     into the socket. This is an online state.
  send(data) {
    this.failesafeSocket.queue.push(data);
    this._safeWrite(data);
  }

  // (2) Tries to write the data into the socket writable stream
  //     If no errors or the socket is still connected, remove it from the queue
  _safeWrite(data) {
    this.failesafeSocket.socket.write(data, (err) => {
      if (!this.hasDisconnected && !err) {
        this.failesafeSocket.queue.shift();
      }
    });
  }

  // (3) flushes any data that was queued while the socket was offline
  //     and it also starts listening for any error events.
  activate() {
    this.hasDisconnected = false;
    for (const data of this.failsafeSocket.queue) {
      this._safeWrite(data);
    }

    this.failesafeSocket.socket.once("error", () => {
      this.hasDisconnected = true;
      this.failesafeSocket.changeState("offline");
    });
  }
}
```

```javascript
// server.js
import jsonOverTcp from "json-over-tcp-2";

const server = jsonOverTcp.createServer({ port: 5000 });
server.on("connection", (socket) => {
  socket.on("data", (data) => {
    console.log("Client data", data);
  });
});

server.listen(5000, () => console.log("Server started"));
```

```javascript
// client.js
import { FailesafeSocket } from "./failsafeSocket.js";

setInterval(() => {
  // send current memory usage
  failsafeSocket.send(process.memoryUsage());
});
```

Server simply prints to the console any JSON message it receives., while clients are sending a measurement of their memory utilization every second, leveraging a FailsafeSocket object.

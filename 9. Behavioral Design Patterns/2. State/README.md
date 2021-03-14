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
  constructor(options) {
    this.options = options;
    this.queue = [];
    this.currentState = null;
    this.socket = null;
    this.states = {
      offline: new OfflineState(this),
      online: new OnlineState(this),
    };
  }
}
```

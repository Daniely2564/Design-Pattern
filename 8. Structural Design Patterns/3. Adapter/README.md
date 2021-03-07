# Adapter

Allows us to access the functionality of an object using different interface.

#### Real-life example

- Device that allows you to plug a USB Tyep-A cable into a USB Type-C port.

Generally an adapter converts an object with a given interface so that it chttps://www.fastify.io/an be used in a context where a different interface is expected.

The **Adapter pattern** is used to take the interface of an object(the **adaptee**) and make it compatible with another interface that is expected by a given client.

@import "../../src/img/Adapter Diagram.PNG"

In the figure, the adapter is essentially a wrapper for the adaptee, exposing a different interface. The diagram highlights that the operations of the adapter can also be a composition of one or more method invocations on the adaptee.

## Using LevelUP through the filesystem API

We will build an adapter around the LevelUP API, transforming it into an interface that is compatible with the core fs module. In particular, we will make sure that every call to **readFile()** and **writeFile()** will translate into calls to **db.get()** and **db.put()**.

Page 324

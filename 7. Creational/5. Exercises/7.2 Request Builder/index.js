import { RequestBuilder } from "./requestBuilder.js";

const request = new RequestBuilder()
  .setHostname("www.google.com")
  .setPath("/")
  .setHeader({})
  .setMethod("GET")
  .setData(null)
  .build();

request.invoke().then((data) => {
  console.log(data);
});

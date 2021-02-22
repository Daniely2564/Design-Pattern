import { Request } from "./request.js";

export class RequestBuilder {
  setHostname(hostname) {
    this.hostname = hostname;
    return this;
  }
  setPath(path) {
    this.path = path;
    return this;
  }
  setHeader(header) {
    this.header = header;
    return this;
  }
  setMethod(method) {
    this.method = method;
    return this;
  }
  setData(data) {
    this.data = data;
    return this;
  }
  build() {
    return new Request(
      this.hostname,
      this.path,
      this.method,
      this.header,
      this.data
    );
  }
}

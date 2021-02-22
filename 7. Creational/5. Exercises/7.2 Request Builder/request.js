import http from "http";

export class Request {
  constructor(url, path, method, header, data) {
    this.url = url;
    this.path = path;
    this.method = method;
    this.header = header;
    this.data = data;
  }

  invoke() {
    const options = {
      hostname: this.url,
      path: this.path,
      header: this.header,
    };
    return new Promise((resolve, reject) => {
      console.log("hi");
      const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding("utf-8");
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });
      });
      req.on("error", (e) => reject(e));
      req.end();
    });
  }
}

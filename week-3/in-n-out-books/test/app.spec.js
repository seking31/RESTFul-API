// test.spec.js
const request = require("supertest");
const app = require("./app");
describe("GET /", () => {
  it("responds with Landing Page!", (done) => {
    request(app).get("/").expect("Landing Page!", done);
  });
});

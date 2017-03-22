let chai = require("chai")
let chai_http = require("chai-http")
let should = chai.should()
const { expect } = require("chai");

chai.use(chai_http)


describe("/joke", () => {
    it("Get all jokes", (done) => {
        chai.request("http://localhost:3000/api/joke").get("/").end((err, res) => {
            expect(res).to.have.status(200);
            done();
        })
    })
})

describe("/findjoke/:id", ()=>{
    it("Find joke 58c67f055bf79529585d3a2e", (done) => {
        chai.request("http://localhost:3000/api/findjoke/58c67f055bf79529585d3a2e").get("/").end((err, res)=>{
//            console.log(res.body);

//returneres som array, så test efter index 0
            expect(res.body[0]).to.have.property("joke").and.equal(" Reality is an illusion created by a lack of alcohol");
            done();
        })
    })
})

// TODO: More tests

/*
Because the end function is passed a callback, assertions are run asynchronously.
Therefore, a mechanism must be used to notify the testing framework that the callback has completed.
Otherwise, the test will pass before the assertions are checked.

For example, in the Mocha test framework, this is accomplished using the done callback,
which signal that the callback has completed, and the assertions can be verified:
*/
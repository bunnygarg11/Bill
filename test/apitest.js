const chai = require("chai")
var path = require('path');
var dotenv = require('dotenv').config(path.resolve(process.cwd(), './.env'));
let chaiHttp = require("chai-http")

var should = chai.should()

const app = require("../server/routes")

chai.use(chaiHttp)

describe("Post/login", function () {
    it("logs user in", function (done) {

        chai.request(app)
            .post("/login")
            .send({
                email: "paramjeet.kaur@mail.vinove.com",
                password: "1234567"
            })
            .set("Accept", "application/json")
            .end(function (err, res) {
                if (err) return done(err)
                res.should.have.status(200)
                // res.body.success.assert.equal(true)
                done()
            })
    })

    it("forgot password", (done) => {
        chai.request(app)
            .post('/forgotPassword')
            .send({ email: "pkd2212870@gmail.com" })
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err) return done(err)
                res.should.have.status(200)
                done()
            })
    })
})
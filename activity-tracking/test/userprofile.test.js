const mongoose = require('mongoose');
const request = require('supertest');
const { app, server } = require('../server');
require("dotenv").config;

const username = "test-user"
const today = new Date()
let height = 190

const userProfileToAdd = {
    username: username,
    height: height,
    weight: 95,
    dateMeasured: today
}

const userProfileToUpdate = {
    username: username,
    height: height,
    weight: 100,
    dateMeasured: today
}

let userProfileId = " "

afterAll(async () => {
    await server.close()
    await mongoose.connection.close()
});

describe("GET /userprofiles/", () => {
    it("should return all userprofiles", async () => {
        return request(app)
            .get("/userprofiles/")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.statusCode).toBe(200);
            })
    });
});

describe("POST /userprofiles/add", () => {
    test("should create a new userprofile", async () => {
        return request(app)
            .post("/userprofiles/add")
            .send(userProfileToAdd)
            .expect(200)
            .then(({ body }) => {
                userProfileId = body.data._id
                expect(body.data.height).toBe(userProfileToAdd.height)
                expect(body.data.weight).toBe(userProfileToAdd.weight)
            })
    });
});

describe("GET /userprofiles/:id", () => {
    test("should get userprofile for an id", async () => {
        return request(app)
            .get(`/userprofiles/${userProfileId}`)
            .expect(200)
            .expect('Content-Type', /json/)
    });
});

describe("GET /userprofiles/user/:username", () => {
    test("should get all userprofile for a username", async () => {
        return request(app)
            .get(`/userprofiles/user/${username}`)
            .expect(200)
            .expect('Content-Type', /json/)
    });
});

describe("PUT /userprofiles/update/:id", () => {
    test("should update an existing userprofile", async () => {
        return request(app)
            .put(`/userprofiles/update/${userProfileId}`)
            .send(userProfileToUpdate)
            .expect(200)
            .then(({ body }) => {
                expect(body.userprofile._id).toBe(userProfileId)
                expect(body.userprofile.height).toBe(userProfileToUpdate.height)
                expect(body.userprofile.weight).toBe(userProfileToUpdate.weight)
            })
    });
});

describe("DELETE /userprofiles/:id", () => {
    test("should delete an userprofile for given id", async () => {
        return request(app)
            .delete(`/userprofiles/${userProfileId}`)
            .expect(200)
    });
});


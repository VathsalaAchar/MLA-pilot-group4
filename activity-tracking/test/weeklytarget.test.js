const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment')
const { app, server } = require('../server');
require("dotenv").config;

const username = "test"
const weekStartDate = moment().startOf('week').toDate()
console.log(weekStartDate)
const weeklyTargetToAdd = {
    username: username,
    runningTarget: 10,
    cyclingTarget: 20,
    swimmingTarget: 0,
    gymTarget: 100,
    walkingTarget: 100,
    otherTarget: 0,
    weekStartDate: weekStartDate
}

const weeklyTargetToUpdate = {
    username: username,
    runningTarget: 10,
    cyclingTarget: 45,
    swimmingTarget: 10,
    gymTarget: 60,
    walkingTarget: 60,
    otherTarget: 0,
    weekStartDate: weekStartDate
}

let weeklyTargetId = " "

afterAll(async () => {
    await server.close()
    await mongoose.connection.close()
});

describe("GET /targets/:username", () => {
    it("should return the weekly target for a specific user", async () => {
        return request(app)
            .get(`/targets/${username}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.statusCode).toBe(200);
            });
    });
});

describe("POST /targets/add", () => {
    test("should create a new weekly target", async () => {
        return request(app)
            .post("/targets/add")
            .send(weeklyTargetToAdd)
            .expect(201)
            .then(({ body }) => {
                weeklyTargetId = body._id
                expect(body.username).toBe(username)
                expect(body.runningTarget).toBe(weeklyTargetToAdd.runningTarget)
            })
    });
});

describe("PATCH /targets/update", () => {
    test("should create a new weekly target", async () => {
        return request(app)
            .patch("/targets/update")
            .send(weeklyTargetToUpdate)
            .expect(200)
            .then(({ body }) => {
                expect(body._id).toBe(weeklyTargetId)
                weeklyTargetId = body._id
                expect(body.username).toBe(username)
                expect(body.runningTarget).toBe(weeklyTargetToUpdate.runningTarget)
            })
    });
});

describe("DELETE /targets/:id", () => {
    test("should delete a target for given id", async () => {
        return request(app)
            .delete(`/targets/${weeklyTargetId}`)
            .expect(200)
    });
});

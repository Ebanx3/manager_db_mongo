import supertest from "supertest"
import Server from "../../src/services/server";
import { SERVER_MESSAGES, ServerResponse } from "../../src/types/response";
import dbConnection from "../../src/services/db";

const INVALID_EMAIL = "esteban.com";
const VALID_EMAIL = "esteban@gmail.com";
const INVALID_PASS = "asdasd";
const VALID_PASS = "asdasdasd"

const SIGNUP_ENDPOINT = "/api/auth/signup";

describe("tests signup endpoint", () => {
    let request: supertest.SuperTest<supertest.Test>;

    beforeAll(async () => {
        Server.getInstance();
        request = supertest(Server.getApp())
        new dbConnection({ collectionName: "users" }).deleteAll();
    });

    /*afterAll(async () => {
        Server.close()
    });*/

    test("signup with empty fields", async () => {
        const response = await request.post(SIGNUP_ENDPOINT).send({});
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(401);
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe(SERVER_MESSAGES.invalidEmail)
    });

    test("signup with invalid format email", async () => {
        const response = await request.post(SIGNUP_ENDPOINT).send({ email: INVALID_EMAIL, password: VALID_PASS });
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(401);
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe(SERVER_MESSAGES.invalidEmail)
    });

    test("signup with invalid password", async () => {
        const response = await request.post(SIGNUP_ENDPOINT).send({ email: VALID_EMAIL, password: INVALID_PASS });
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(401);
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe(SERVER_MESSAGES.invalidPassword)
    });

    test("signup with correct data", async () => {
        const response = await request.post(SIGNUP_ENDPOINT).send({ email: VALID_EMAIL, password: VALID_PASS });
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(201);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.insertedId).toBeDefined();
        expect(response.body.message).toBe(SERVER_MESSAGES.correctSignup)
    });

    test("signup with email already used", async () => {
        const response = await request.post(SIGNUP_ENDPOINT).send({ email: VALID_EMAIL, password: VALID_PASS });
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(401);
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe(SERVER_MESSAGES.emailAlreadyUser)
    })


})
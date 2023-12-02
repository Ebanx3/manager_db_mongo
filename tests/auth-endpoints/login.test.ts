import supertest from "supertest";
import Server from "../../src/services/server";
import dbConnection from "../../src/services/db";
import { SERVER_MESSAGES } from "../../src/types/response";

const INVALID_EMAIL = "esteban.com";
const VALID_EMAIL = "esteban@gmail.com";
const INVALID_PASS = "asdasd";
const VALID_PASS = "asdasdasd"
const VALID_PASS2 = "asdasda12"


const LOGIN_ENDPOINT = "/api/auth/login";
const SIGNUP_ENDPOINT = "/api/auth/signup";

describe("tests login endpoint", () => {
    let request: supertest.SuperTest<supertest.Test>;

    beforeAll(async () => {
        Server.getInstance();
        request = supertest(Server.getApp());
        new dbConnection({ collectionName: "users" }).deleteAll();
    });

    /*afterAll(async () => {
        Server.close();
    });*/

    test("login with empty fields", async () => {
        const response = await request.post(LOGIN_ENDPOINT).send({});
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(401);
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe(SERVER_MESSAGES.invalidEmail);
    })

    test("login with invalid email", async () => {
        const response = await request.post(LOGIN_ENDPOINT).send({ email: INVALID_EMAIL, password: VALID_PASS });
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(401);
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe(SERVER_MESSAGES.invalidEmail);
    })

    test("login with invalid password", async () => {
        const response = await request.post(LOGIN_ENDPOINT).send({ email: VALID_EMAIL, password: INVALID_PASS });
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(401);
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe(SERVER_MESSAGES.invalidPassword)
    })

    test("login with a email no registered", async () => {
        const response = await request.post(LOGIN_ENDPOINT).send({ email: VALID_EMAIL, password: VALID_PASS });
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(401);
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe(SERVER_MESSAGES.incorrectDataLogin)
    })

    test("login with a wrong password", async () => {
        const response = await request.post(LOGIN_ENDPOINT).send({ email: VALID_EMAIL, password: VALID_PASS2 });
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(401);
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe(SERVER_MESSAGES.incorrectDataLogin)
    })

    test("login with correct data", async () => {
        await request.post(SIGNUP_ENDPOINT).send({ email: VALID_EMAIL, password: VALID_PASS });

        const response = await request.post(LOGIN_ENDPOINT).send({ email: VALID_EMAIL, password: VALID_PASS });
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toBe(SERVER_MESSAGES.correctLogin)
    })
})
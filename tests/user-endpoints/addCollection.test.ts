import supertest from "supertest";
import Server from "../../src/services/server";
import dbConnection from "../../src/services/db";
import { SERVER_MESSAGES } from "../../src/types/response";

const ADD_COLLECTION_ENDPOINT = "/api/users/addCollection/"
const LOGIN_ENDPOINT = "/api/auth/login";
const SIGNUP_ENDPOINT = "/api/auth/signup";

const EMAIL = "esteban@gmail.com";
const PASS = "asdasdasd"

describe("addCollection endpoint", () => {
    let request: supertest.SuperTest<supertest.Test>;

    beforeAll(async () => {
        Server.getInstance()
        request = supertest(Server.getApp());
        new dbConnection({ collectionName: "users" }).deleteAll();
    });

    test("try to add a new Collection without be logued in", async () => {
        const response = await request.put(ADD_COLLECTION_ENDPOINT);
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(401)
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe(SERVER_MESSAGES.unautorized);
    });

    let tokenauth: string;

    test("try to add a new collection with invalid body data", async () => {
        await request.post(SIGNUP_ENDPOINT).send({ email: EMAIL, password: PASS });
        const loginResponse = await request.post(LOGIN_ENDPOINT).send({ email: EMAIL, password: PASS });
        tokenauth = loginResponse.headers.tokenauth;

        const response = await request.put(ADD_COLLECTION_ENDPOINT).set("tokenAuth", tokenauth);
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400)
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe(SERVER_MESSAGES.bodyMustContainCollection);
    }, 7000);

    test("try to add a new collection without fields", async () => {
        const collection = {
            collection: {
                name: "products",
                fields: "a"
            }
        }

        const response = await request.put(ADD_COLLECTION_ENDPOINT).set("tokenAuth", tokenauth).send(collection);
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400)
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe(SERVER_MESSAGES.collectionWithFields);
    });

    test("try to add a new collection with invalid fields", async () => {
        const collection = {
            collection: {
                name: "products",
                fields: [
                    {
                        name: "name",
                        type: "string"
                    }, {
                        name: "price"
                    }

                ]
            }
        }

        const response = await request.put(ADD_COLLECTION_ENDPOINT).set("tokenAuth", tokenauth).send(collection);
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400)
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe(SERVER_MESSAGES.invalidFormatFields);
    });

    test("try to add a new valid collection", async () => {
        const collection = {
            collection: {
                name: "products",
                fields: [
                    {
                        name: "name",
                        type: "string"
                    }, {
                        name: "price",
                        type: "number"
                    }

                ]
            }
        }

        const response = await request.put(ADD_COLLECTION_ENDPOINT).set("tokenAuth", tokenauth).send(collection);
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200)
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toBe(SERVER_MESSAGES.newCollectionAdded);
    })
})

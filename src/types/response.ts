export type ServerResponse = {
    success: boolean;
    message: string;
    data?: object;
}

export const SERVER_MESSAGES = {
    serverError: "Server error",
    //login and signup
    invalidEmail: "Request must have a valid email",
    invalidPassword: "Request must have a password with more than 8 characters",
    emailAlreadyUser: "Email already used",
    incorrectDataLogin: "Invalid email or password",
    correctLogin: "Successfully logued in",
    correctSignup: "New user created",
    unautorized: "Unautorized",
    //addCollection endpoint
    bodyMustContainCollection: "Body must contain a collection : { collection:{ name:string , fields: collectionField[] } }",
    collectionWithFields: "Collection.fields must be an array and have at least one field",
    invalidFormatFields: "All fields in collection must have defined name and type",
    newCollectionAdded: "Collection succesfully added"
}
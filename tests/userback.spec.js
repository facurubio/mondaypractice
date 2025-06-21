import { test, expect } from '@playwright/test';

const userName = 'FacuRubio';
const failedUserName = 'FacundoRubio';

test('Create User @POST', async ({ request }) => {
    // I create a const variable to use the post request
    const postURL = await request.post('https://petstore.swagger.io/v2/user', {
        data: {
            "id": 3,
            "username": userName,
            "firstName": "Facundo",
            "lastName": "Rubio",
            "email": "facundo@gmail.com",
            "password": "pass123",
            "phone": "12345678",
            "userStatus": 1
        }
    });
    // i save the body of the response in a variable to use it later for verification
    const body = await postURL.json();

    // here i check the response is okey
    expect(postURL).toBeOK();

    // here i verify the status of the response was 200
    expect(postURL.status()).toBe(200);

    // here i check the body i recive with the body should be correct
    expect(body).toMatchObject({
        "code": 200,
        "type": "unknown",
        "message": "3"
    });
});

test.describe('GET test', () => {
    //this test verify the status 200
    test('Verify user is created @GET', async ({ request }) => {
        const getURL = await request.get(`https://petstore.swagger.io/v2/user/${userName}`);
        const body = await getURL.json();

        expect(getURL).toBeOK();
        expect(getURL.status()).toBe(200);

        expect(body).toMatchObject({
            "id": 3,
            "username": userName,
            "firstName": "Facundo",
            "lastName": "Rubio",
            "email": "facundo@gmail.com",
            "password": "pass123",
            "phone": "12345678",
            "userStatus": 1
        });
    });

    // this test verify the status 404
    test('Verify user is not found @GET', async ({ request }) => {
        const getURL = await request.get(`https://petstore.swagger.io/v2/user/${failedUserName}`);
        const body = await getURL.json();

        expect(getURL).not.toBeOK();
        expect(getURL.status()).toBe(404);

        expect(body).toMatchObject({
            "code": 1,
            "type": "error",
            "message": "User not found"
        });
    });
});

test('Update user information @PUT', async ({ request }) => {
    const putURL = await request.put(`https://petstore.swagger.io/v2/user/${userName}`, {
        data: {
            "id": 3,
            "username": userName,
            "firstName": "Facundito",
            "lastName": "Rubio",
            "email": "facundo@gmail.com",
            "password": "pass123",
            "phone": "12345678",
            "userStatus": 1
        }
    })

    const body = await putURL.json();

    expect(putURL).toBeOK();
    expect(putURL.status()).toBe(200);

    expect(body).toMatchObject({
        "code": 200,
        "type": "unknown",
        "message": "3"
    });
});






test('Delete user @DELETE', async ({ request }) => {
    const deleteURL = await request.delete(`https://petstore.swagger.io/v2/user/${userName}`);

    expect(deleteURL).toBeOK();
    expect(deleteURL.status()).toBe(200);

    const body = await deleteURL.json();

    expect(body).toMatchObject({
        "code": 200,
        "type": "unknown",
        "message": "FacuRubio"
    });

});

// Here I create the end to end scenerario. We are going to create a new user, verify the creation, log in / log out and for last the delete of the user.
const userNameEnd = 'Morenito19';
test('End to End case @ENDTOEND', async ({ request }) => {

    //Here I create the user using the post request.
    const postURL = await request.post('https://petstore.swagger.io/v2/user', {
        data: {
            "id": 10,
            "username": userNameEnd,
            "firstName": "Morenito",
            "lastName": "Diecinueve",
            "email": "morenito19@gmail.com",
            "password": "pass1234",
            "phone": "12345678",
            "userStatus": 1
        }
    });

    //Here I verify the response status of the post request.
    expect(postURL).toBeOK();
    expect(postURL.status()).toBe(200);

    //Here I create the get request and check the user is in database calling the get request.
    const getURL = await request.get(`https://petstore.swagger.io/v2/user/${userNameEnd}`);

    //Here I verify the response status of the get request.
    expect(getURL).toBeOK();
    expect(getURL.status()).toBe(200);

    //Here I create the loging request
    const loginURL = await request.get(`https://petstore.swagger.io/v2/user/login?username=${userNameEnd}&password=pass1234`);

    //Here I check the response status of the login
    expect(loginURL).toBeOK();
    expect(loginURL.status()).toBe(200);

    //Here I create the logout request
    const logOutURL = await request.get('https://petstore.swagger.io/v2/user/logout');

    //Here I check the response status of the logout
    expect(logOutURL).toBeOK();
    expect(logOutURL.status()).toBe(200);

    //Here I create the delete request
    const deleteURL = await request.delete(`https://petstore.swagger.io/v2/user/${userNameEnd}`);

    //Here I check the response status of the delete
    expect(deleteURL).toBeOK();
    expect(deleteURL.status()).toBe(200);
});


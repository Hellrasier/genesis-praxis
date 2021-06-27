# genesis-praxis
## Description
Node js api for retrieving information about current Bitcoin rate with user sign up and authentification.

**Dependecies**: used only native node js libraries `http`, `https`, `fs`, `crypto` and one external library `dotenv`

Current Bitcoin currency rate is being taken from https://www.coinapi.io/

## API description

- ### Signing up

  `POST` `user/create`
  ```
    body: {
        email: "example@mail.com",
        password: "examplepassword"
    }
  ```
  Query for creating new user. After creating user unque token is generated for this user.

  Possible responses:
  + `201: Created user with E-mail: example@mail.com` 
  + `400: Error, your E-mail or password field is empty` 
  + `400: Error, incorrect email` 
  + `409: Error, user with this E-mail adress already exists`

- ### Signing in
  `POST` `user/login`
  ```
    body: {
        email: "example@mail.com",
        password: "examplepassword"
    }
   ```
   Query to authenticate and get user token.
    Possible responses:
  + `200: "68dd5aef0c**********************"` - user token
  + `400: Error, your E-mail or password field is empty` 
  + `400: Error, user with this email does not exist` 
  + `400: Error, password is invalid`


- ### Get BTC rate
  `GET` `btc/Rate`
  ```
  headers: {
    Authorization: "68dd5aef0c**********************"
  }
  ```
  With this query should provide headers with token to tell server that you are authorized.
  
  Possible responses:
  + `200: {cryptoCurrency: "BTC", rate: *BTC rate in UAH*}`
  + `401: Error, user is unauthorized` - if token is invalid or does not exist
  


# Users

- User object

```
{
  id: integer PRIMARY KEY
  username: string
  email: string
  password: string
  created_at: datetime(iso 8601)
  updated_at: datetime(iso 8601)
}
```

## **GET api/v1/users**

Returns all users in the system.

- **URL Params**  
  None
- **Data Params**  
  None
- **Headers**  
  Content-Type: application/json
- **Success Response:**
- **Code:** 200  
  **Content:**

  ```
  {
    status: "success"
    users: [
            {<user_object>},
            {<user_object>},
            {<user_object>}
          ]
  }
  ```

## **GET api/v1/users/:id**

Returns the specified user.

- **URL Params**  
  _Required:_ `id=[integer]`
- **Data Params**  
  None
- **Headers**  
  Content-Type: application/json  
  Authorization: Bearer `<OAuth Token>`
- **Success Response:**
- **Code:** 200  
  **Content:**
  ```
  {
    status: "success",
    data: [<user_object>]
  }
  ```
- **Error Response:**
  - **Code:** 404  
    **Content:**
  ```
    {
    status: "failed",
    message: "User doesn't exist"
    }
  ```
  OR
  - **Code:** 401  
    **Content:**
  ```
    {
    status: "failed",
    message: "You are unauthorized to make this request."
    }
  ```

## **POST api/v1/users**

Creates a new User and returns the OTP code .

- **URL Params**  
  None
- **Headers**  
  Content-Type: application/json
- **Data Params**

```
  {
    username: string,
    email: string,
    password: string
  }
```

- **Success Response:**
- **Code:** 200  
  **Content:**
  ```
  {
    status: "success",
    data: [<otp_code>]
    message:  "tautan verifikasi telah dikirim"
  }
  ```

## POST api/v1/users/otp

Verif OTP code .

- **URL Params**  
  None
- **Headers**  
  Content-Type: application/json
- **Data Params**

```
  {
    otpCode : number
  }
```

- **Success Response:**
- **Code:** 200  
  **Content:**
  ```
  {
    status: "success",
    data: [<user_object>]
    message:  "Register Berhasil"
  }
  ```
  **Error Response:**
  - **Code:** 404  
     **Content:**
    ```
    {
    status: "failed",
    message: "Maaf, kode otp salah"
    }
    ```

## **PATCH api/v1/users/:id**

Updates fields on the specified user and returns the updated object.

- **URL Params**  
  _Required:_ `id=[integer]`
- **Data Params**

```
  {
    username: string,
    email: string,
    password: string
  }
```

- **Headers**  
  Content-Type: application/json  
  Authorization: Bearer `<OAuth Token>`
- **Success Response:**
- **Code:** 200  
  **Content:** `{ <user_object> }`
- **Error Response:**
  - **Code:** 404  
     **Content:**
    ```
    {
    status: "failed",
    message: "User doesn't exist"
    }
    ```
    OR
  - **Code:** 401  
     **Content:**
    ```
    {
    status: "failed",
    message: "You are unauthorized to make this request."
    }
    ```

## **DELETE api/v1/users/:id**

---

Deletes the specified user.

- **URL Params**  
  _Required:_ `id=[integer]`
- **Data Params**  
  None
- **Headers**  
  Content-Type: application/json  
  Authorization: Bearer `<OAuth Token>`
- **Success Response:**
  - **Code:** 204
- **Error Response:**
  - **Code:** 404  
    **Content:**
    ```
    {
    status: "failed",
    message: "User doesn't exist"
    }
    ```
    OR
  - **Code:** 401  
    **Content:**
    ```
    {
    status: "failed",
    message: "You are unauthorized to make this request."
    }
    ```

---

# Reset Password

## **POST api/v1/users/resetpassword/:id**

Reset password user

- **URL Params**  
  _Required:_ `id=[integer]`
- **Data Params**
  ```
  {
    newPassword: string
  }
  ```
- **Headers**  
  Content-Type: application/json  
  Authorization: Bearer `<OAuth Token>`
- **Success Response:**
  - **Code:** 200  
    **Content:**
    ```
    {
    status: "Success",
    message: "Reset Password Berhasil"
    }
    ```

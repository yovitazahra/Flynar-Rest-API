# Users

- User object

```
{
  id: integer PRIMARY KEY
  username: string
  email: string
  created_at: datetime(iso 8601)
  updated_at: datetime(iso 8601)
}
```

## **GET /users**

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
  users: [
           {<user_object>},
           {<user_object>},
           {<user_object>}
         ]
}
```

## **GET /users/:id**

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

## **POST /users**

Creates a new User and returns the new object.

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
  **Content:** `{ <user_object> }`

## **PATCH /users/:id**

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

## **DELETE /users/:id**

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

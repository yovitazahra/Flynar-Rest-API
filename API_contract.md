# Fligts

- Flights object

```
{
  id: integer PRIMARY KEY
  price: integer
  passenger: integer
  seat: string
  airline: string
  departureLocation: string
  returnLocation: string
  dateAvailable: date
  created_at: datetime(iso 8601)
  updated_at: datetime(iso 8601)
}
```

## **GET /flights**

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
  flights: [
           {<flight_object>},
           {<flight_object>},
           {<flight_object>}
         ]
}
```

## **GET /flights/:id**

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
  **Content:** `{ <flight_object> }`
- **Error Response:**
  - **Code:** 404  
    **Content:**
  ```
    {
    status: "failed",
    message: "Flight doesn't exist"
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

  # Login

## **POST /login**

Creates a new User and returns the new object.

- **URL Params**  
  None
- **Headers**  
  Content-Type: application/json
- **Data Params**

```
  {
    username: string,
    password: string
  }
```

- **Success Response:**
- **Code:** 200  
  **Content:** `{ <user_object> }`

## **PATCH /login/:id**

Updates fields on the specified user and returns the updated object.

- **URL Params**  
  _Required:_ `id=[integer]`
- **Data Params**

```
  {
    username: string,
    password: string
  }
```

- **Headers**  
  Content-Type: application/json  
- **Success Response:**
- **Code:** 200  
  **Content:** `{ <user_object> }`
  Authorization: Bearer `<OAuth Token>`
```
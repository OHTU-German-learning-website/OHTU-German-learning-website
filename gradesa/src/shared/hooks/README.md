# Hooks Documentation

These are some simple request hooks that help with making network requests to API routes.

They are very simple, no caching etc. I highly recommend you refactor gradesa to use a proper fetching library like react-query. The first team was pretty inexperienced with JS so we used this to limit the amount of new stuff we had to learn.

## useQuery

`useQuery` is a data fetching hook for making GET requests to the API with built-in error handling, loading states, and retries.

### Features

- Automatic GET requests with query string parameter handling
- Loading state management
- Basic error handling
- Automatic retries with exponential backoff
- Request cancellation on component unmount
- very simplistic Session ID tracking

### Usage

```jsx
import useQuery from "@/shared/hooks/useQuery";

function MyComponent() {
  const { data, error, isLoading, refetch } = useQuery(
    "/endpoint",
    {
      param1: "value1",
      param2: "value2",
    },
    {
      enabled: true,
      refetchBackoffMax: 10000,
      refetchBackoff: 1000,
      refetchBackoffExponent: 1.5,
      refetchBackoffMaxAttempts: 3,
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh Data</button>
      {/* Render data */}
    </div>
  );
}
```

### Parameters

- `url` (string): The API endpoint to fetch data from
- `params` (object, optional): Query parameters to send with the request
- `config` (object, optional): Configuration options:
  - `enabled` (boolean): Whether the query should automatically run (default: `true`)
  - `refetchBackoff` (number): Initial backoff time in ms (default: `1000`)
  - `refetchBackoffMax` (number): Maximum backoff time in ms (default: `10000`)
  - `refetchBackoffExponent` (number): Backoff exponential factor (default: `1.5`)
  - `refetchBackoffMaxAttempts` (number): Maximum retry attempts (default: `3`)

### Return Values

- `data`: The response data (null until loaded)
- `error`: Any error that occurred during fetching (null if no error)
- `isLoading`: Boolean indicating if the request is in progress
- `refetch`: Function to manually trigger the request again

## useRequest

`useRequest` is a flexible hook for making non-GET HTTP requests (POST, PUT, DELETE, etc.) to the API.

### Features

- Support for all HTTP methods
- Customizable request configuration
- Error handling
- Session ID tracking

### Usage

```jsx
import { useRequest } from "@/shared/hooks/useRequest";

function MyComponent() {
  const makeRequest = useRequest();

  const handleSubmit = async (formData) => {
    try {
      const response = await makeRequest("/endpoint", formData, {
        method: "POST",
        headers: {
          "Custom-Header": "value",
        },
      });

      // Handle successful response
      console.log(response.data);
    } catch (error) {
      // Handle error
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form inputs */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Parameters

- The hook returns a `makeRequest` function that accepts:
  - `url` (string): The API endpoint
  - `body` (object, optional): The request body/payload
  - `config` (object, optional): Axios request configuration
    - `method` (string): HTTP method (default: 'POST')
    - `headers` (object): Custom request headers
    - Any other valid Axios request options

### Return Values

- The function returns a Promise that resolves to the Axios response object

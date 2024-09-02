# igdb-bearer-token-playground

Trying to figure out a solution for Bearer Token management with NextJs.

# Installation

To run and test this locally:

- Clone the repo
- Make an `.env.local` file
- You'll need these in your `.env.local`: `TWITCH_TV_ID` and `TWITCH_TV_SECRET`. [Get them from following these instructions](https://api-docs.igdb.com/#getting-started)
- `npm install` all the things
- `npm run dev`

# What?

Weird things happen.
The server and client components are handling fetches mostly separate from each other.

Currently, the `FetchToken.js` module initialises a variable to store the Bearer Token, and has a bunch of functions within, mainly for:

- Fetching a new token _(and assigning it to the variable)_
- Getting the current token _(from the stored variable)_
- Validating the current token _(from the stored variable)_

On the 'Home' page.jsx within the `src` folder, look at this:

```jsx
export default async function Home() {
    console.log("Here's the home page doing some stuff:");
    const tokenRespose = await fetchNewToken();
    console.log("logging token response in home: ", tokenRespose);
    const tokenValidation = await validateToken();
    console.log("logging validation response in home: ", tokenValidation);
```

and this, in the return:

```jsx
<p>Server-side getToken result: {tokenRespose ? tokenRespose : "nothing"}</p>
```

Then run the page and see that the `<p>` tag probably has a result. As expected. The server has run `fetchNewToken()` and `validateToken()`.
Clicking the `Check token exists` button _(a client component)_ may or may not show you the same stored token (but it should do).

---

Now try this:

- Fetch New Token button (should get you a new token, and you'd expect that it overwrites the stored variable.)
- Check Token button (should show you the new token, as expected.)
- Go to a different page, Page 1 or 2 and check the new token shows.
- Refresh the page, click Check Token, and see what happens: Nothing in stored cache? Old server-token is in the stored variable instead?
- Switch to the other page, check it, switch back, check it. For me, it's a bit unreliable, (possibly due to if the server has made the token "available" to the client components or not?).
- The newly Fetched Token didn't overwrite/save or store in the module. And sometimes it's just a bit janky - it might take a couple of clicks to show the token.

Overall, not an ideal way for the client components to interact with the server-stored token.
In addition, if you shut down the server, and restart with `npm run dev` you'll probably see the same Bearer Token has been 'fetched' by the server, probably due to how Next caches fetch requests.

# What we need then

As per the Home pages definition, the solution we want has to:

- Check if a token is already stored.
- Validate it, if it is.
- Fetch one, if it isnt.
- Store a token once fetched.
- Make sure the app isnt fetching 500 bearer tokens all day everyday...

Implementing storage and fetching from a database is one way to get a win here, as the main app already uses a database in its functionality.
Considerations are latency (it's slow!), potential abuse of database calls, and another 'step' in the process, but perhaps at the gain of robustness and simplicity.

Other potential solutions:

- Spend many more hours learning about a proper client/server relationship
- Implement Redis
- Use Vercel Edge functions

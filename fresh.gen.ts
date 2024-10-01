// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_protected_middleware from "./routes/(protected)/_middleware.ts";
import * as $_protected_greeting from "./routes/(protected)/greeting.tsx";
import * as $_404 from "./routes/_404.tsx";
import * as $_500 from "./routes/_500.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $api_auth_callback_500 from "./routes/api/auth/callback/_500.tsx";
import * as $api_auth_callback_microsoft_entra_id from "./routes/api/auth/callback/microsoft-entra-id.tsx";
import * as $index from "./routes/index.tsx";
import * as $login from "./routes/login.tsx";
import * as $protected from "./routes/protected.tsx";
import * as $test_data from "./routes/test/data.tsx";
import * as $test_jwt from "./routes/test/jwt.tsx";
import * as $Counter from "./islands/Counter.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/(protected)/_middleware.ts": $_protected_middleware,
    "./routes/(protected)/greeting.tsx": $_protected_greeting,
    "./routes/_404.tsx": $_404,
    "./routes/_500.tsx": $_500,
    "./routes/_app.tsx": $_app,
    "./routes/_middleware.ts": $_middleware,
    "./routes/api/auth/callback/_500.tsx": $api_auth_callback_500,
    "./routes/api/auth/callback/microsoft-entra-id.tsx":
      $api_auth_callback_microsoft_entra_id,
    "./routes/index.tsx": $index,
    "./routes/login.tsx": $login,
    "./routes/protected.tsx": $protected,
    "./routes/test/data.tsx": $test_data,
    "./routes/test/jwt.tsx": $test_jwt,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;

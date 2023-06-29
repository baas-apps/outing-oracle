<!-- /+layout.svelte -->
<script lang="ts">
  import "../app.css";
  import { app, user } from '$lib/stores';
  import { dev } from '$app/environment';
  import * as Realm from "realm-web";

  $user = $app ? $app.currentUser: null

  let redirectUrl = ""
  if (dev) {
    redirectUrl = "http://localhost:5173/auth"
  } else {
    redirectUrl = "http://outing-oracle-hqdxg.mongodbstitch.com/auth"
  }
</script>

<div class="navbar bg-base-100">
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl">OutingOracle</a>
  </div>
  <div class="flex-none gap-2">
    <button class="btn btn-primary" on:click={$app.logIn(Realm.Credentials.google({redirectUrl}))}>Google Login</button>
  </div>
</div>

<slot></slot>
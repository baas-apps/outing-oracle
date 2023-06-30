<!-- /+layout.svelte -->
<script lang="ts">
  import "../app.css";
  import { app, user } from '$lib/stores';
  import { dev } from '$app/environment';
  import * as Realm from "realm-web";

  $user = $app ? $app.currentUser: null

  async function login(){
    if ($app){
      if (dev) {
        await $app.logIn(Realm.Credentials.google({redirectUrl: "http://localhost:5173/auth"}))
      } else {
        await $app.logIn(Realm.Credentials.google({redirectUrl: "http://outing-oracle-hqdxg.mongodbstitch.com/auth"}))
      }

      $user = $user // Trigger reactivity
    }
  }

  async function logout(){
    if ($user){
      await $user.logOut();
      $user = $user // Trigger reactivity
    }
  }

</script>

<div class="navbar bg-base-100">
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl" href="/">OutingOracle</a>
  </div>
  <div class="flex-none gap-2">
    {#if $user?.isLoggedIn}
    <details class="dropdown dropdown-bottom dropdown-end">
      <summary tabindex="0" class="m-1 avatar">
        <div class="avatar w-12 mask mask-squircle">
          <img alt="User Profile Image" src={$user?.profile.pictureUrl}>
        </div>
      </summary>

      <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <button class="btn btn-primary" on:click={logout}>
          Logout
        </button>
      </ul>
    </details>
    {:else}
      <button class="btn btn-primary" on:click={login} >Google Login</button>
    {/if}

  </div>
</div>

<slot></slot>
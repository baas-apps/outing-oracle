<!-- /+layout.svelte -->
<script lang="ts">
  import "../app.css";
  import { app, user } from '$lib/stores';
  import { dev } from '$app/environment';
  import { page } from '$app/stores';
  import * as Realm from "realm-web";
	import { getRoute } from "$lib/util";

  async function login(redirectUrl:string){
    if ($app){
      await $app.logIn(Realm.Credentials.google({redirectUrl})).then((usr) => {
        return usr.callFunction("findOrInsertUser", {"_id": usr.id, "name": usr.profile.name, "email": usr.profile.email})
      })

      $app = $app

      $user = $app.currentUser
    }
  }

  async function logout(){
    if ($user){
        await $user.logOut();
        $app = $app
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
      <summary class="m-1 avatar">
        <div class="avatar w-12 mask mask-squircle">
          <img alt="User Profile" src={$user?.profile.pictureUrl}>
        </div>
      </summary>

      <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <button class="btn btn-primary" on:click={logout}>
          Logout
        </button>
      </ul>
    </details>
    {:else}
      <button class="btn btn-primary" on:click={() => {login(getRoute("auth", dev))}} >Google Login</button>
    {/if}
  </div>
</div>

<slot></slot>
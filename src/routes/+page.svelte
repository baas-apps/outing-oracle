<!-- /+layout.svelte -->

<script lang="ts">
  import baas from '$lib/assets/baas-beer.png';
  import { app, user } from '$lib/stores';
  import * as Realm from "realm-web";
  import { dev } from '$app/environment';
	import { getRoute } from "$lib/util";

  async function login(redirectUrl:string){
    if ($app){
      await $app.logIn(Realm.Credentials.google({redirectUrl}))
      $app = $app
    }
  }
</script>

<div class="hero min-h-screen ">
  <div class="hero-content flex-col lg:flex-row">
    <img src={baas} class="max-w-sm rounded-lg mr-5" />
    <div>
      <h1 class="text-5xl font-bold">Plan Our Next Team Outing</h1>
      <p class="py-6">Elevate your team's outings with OutingOracle. Streamline the planning process, coordinate effortlessly, and create unforgettable experiences. Propose ideas, gather feedback, and find the perfect time that works for everyone.</p>
      {#if $user?.isLoggedIn}
        <button class="btn btn-primary"><a href="/create-poll">Start Planning</a></button>
      {:else}
        <button class="btn btn-primary" on:click={() => {login(getRoute("auth", dev))}}>Google Login</button>
      {/if}
    </div>
  </div>
</div>
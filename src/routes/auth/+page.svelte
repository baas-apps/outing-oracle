<script lang="ts">
  import * as Realm from "realm-web";
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment'; 
  import { user } from '$lib/stores'

  if (browser){
    Realm.handleAuthRedirect()
    goto('/')
  }
</script>


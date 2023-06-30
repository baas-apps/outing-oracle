<script lang="ts">
    import * as Realm from "realm-web";
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment'; 
    import { page } from '$app/stores'

    if (browser){
        Realm.handleAuthRedirect()
    }
</script>


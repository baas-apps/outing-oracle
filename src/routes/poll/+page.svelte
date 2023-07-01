<!-- poll/+page.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import { user } from '$lib/stores'
    import * as Realm from "realm-web";
    
    enum Vote {
        None = 0,
        Yes,
        Neutral,
        No,
    }

    type Event = {
        name: string,
        location: string;
        vote: Vote,
    };

    // TODO: For dev speed I just made everything a global reactive varaible but this can definitely be cleaned up
    let locationData:Event[] = []
    $: locationData

    // The event that won the poll if there is one
    let WinningEvent:Event
    $: WinningEvent

    // TODO: This is very unsafe :)
    let moderatorID:string = ""
    $: moderatorID

    let submitted:boolean = false
    $: submitted

    let pollActive:boolean = true
    $: pollActive

    let pollID = $page.url.searchParams.get('id');

    async function populatePoll() {
        if (pollID && $user){
            let _id = new Realm.BSON.ObjectID(pollID)
            let res:any = await $user.callFunction("GetPoll", {_id})

            moderatorID = res.result.moderator_id
            pollActive = res.result.poll_active

            let options = res.result.options
            for(let idx in options){
                if(options[idx].wonPoll){
                    WinningEvent = {
                        name: options[idx].name,
                        location: options[idx].address,
                        vote: Vote.None,
                    };
                    locationData = []
                    break;
                }
                // TODO: Could check if vote already exists here and pre-populate the vote that you've already filled out
                locationData.push({
                    name: options[idx].name,
                    location: options[idx].address,
                    vote: Vote.Neutral, // TODO: This should be Vote.None and we should implement a check that the vote is filled out
                })
            }

            locationData = locationData
        }
    }

    async function vote(idx:number, vote:Vote){
        if(idx >= locationData.length){return}
        submitted = false
        locationData[idx].vote = vote
    }

    async function submitVotes(){
        if (!pollID || !$user?.isLoggedIn){return}

        let votes = {
            _id: new Realm.BSON.ObjectID(pollID),
            userID: $user?.id,
            voteArr: new Array(),
        }
        for(let idx in locationData){
            votes.voteArr.push(locationData[idx].vote.valueOf())
        }
        console.log(votes)
        await $user.callFunction("SubmitVote", votes)
        submitted = true
    }

    async function endPoll(){
        // TODO: We should be doing this validation server side, but this was easier :)
        if (pollID && $user && $user.id == moderatorID){
            await $user?.callFunction("EndPoll", {"_id": new Realm.BSON.ObjectID(pollID)})
            location.reload()
        }
    }

    populatePoll()

  </script>
  

{#if !$user?.isLoggedIn}
    <div class="flex flex-col space-y-5">
        <h1>Please Login To See This Poll</h1>
        <button class="btn btn-primary max-w-24">Google Login</button>
    </div>
{:else if !pollActive}
    <h1 class="text-center text-2xl">Winning Location</h1>
    <h3 class="text-center text-xl text-primary">
        {WinningEvent.name}
    </h3>
{:else}
<div class="flex flex-row justify-center w-full space-x-10 mt-5">
    <div class="flex flex-col overflow-x-auto">
        <table class="table">
        <!-- head -->
        <thead>
            <tr>
            <th>Name</th>
            <th>Location</th>
            </tr>
        </thead>
        <tbody>
            {#each locationData as location, idx}
                <tr class="hover bg-base-200">
                    <td>{location.name}</td>
                    <td>{location.location}</td>
                    <td>
                        <div class="flex flex-row space-x-2">
                            <button class="btn {location.vote == Vote.Yes? "":"btn-outline"} btn-success" on:click={() => {vote(idx, Vote.Yes)}}>️✓</button>
                            <button class="btn {location.vote == Vote.Neutral ? "":"btn-outline"} btn-warning" on:click={() => {vote(idx, Vote.Neutral)}}>o</button>
                            <button class="btn {location.vote == Vote.No ? "":"btn-outline"} btn-error" on:click={() => {vote(idx, Vote.No)}}>x</button>
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
        </table>
        {#if moderatorID == $user.id.toString()}
            <button class="btn btn-error my-3" on:click={endPoll}>End Poll</button>
        {/if}

        <button class="btn btn-success my-3" on:click={submitVotes}>Submit Vote</button>

        {#if submitted}
            <h1 class="text-center text-xl mt-3">Vote Submitted!</h1>
        {/if}
    </div>
</div>
{/if}
  
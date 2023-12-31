<!-- create-poll/+page.svelte -->
<script lang="ts">
  import { browser } from '$app/environment'; 
  import { user } from '$lib/stores'
  import { goto } from '$app/navigation';
  import type { LocationOption } from '../../types/location-option.type';
  import small0 from '$lib/assets/small_0.png';
  import small1 from '$lib/assets/small_1.png';
  import small1_5 from '$lib/assets/small_1_half.png';
  import small2 from '$lib/assets/small_2.png';
  import small2_5 from '$lib/assets/small_2_half.png';
  import small3 from '$lib/assets/small_3.png';
  import small3_5 from '$lib/assets/small_3_half.png';
  import small4 from '$lib/assets/small_4.png';
  import small4_5 from '$lib/assets/small_4_half.png';
  import small5 from '$lib/assets/small_5.png';
  
  const ratingsToImage: [number: any] = {
    0: small0,
    1: small1,
    1.5: small1_5,
    2: small2,
    2.5: small2_5,
    3: small3,
    3.5: small3_5,
    4: small4,
    4.5: small4_5,
    5: small1_5,
  }
  
  const METERS_PER_MILE = 1609.344
  let customOptionName = '';
  let customOptionLocation = '';

  let possibleOptions: LocationOption[] = [];
  let locationOptions: LocationOption[] = [];
  let historyOptions: LocationOption[] = [];

  let isModalOpen = true

  let numOptionsToQuery = 20
  let numOptionsQueried = 0

  let eventTitle = '';
  let startingLocation = {lat: 0, long: 0};
  let radiusInMiles = 2;
  let searchTerm = '';

  if (browser && !($user?.isLoggedIn)){
    goto('/')
  }

  async function populatePossibleOptions() {
    if (!$user) {
      return
    }
    const yelpResult: any = await $user.callFunction("search_places", {latitude: startingLocation.lat, longitude: startingLocation.long, radius: Math.floor(radiusInMiles * 1609.34), term: searchTerm, limit: numOptionsToQuery, offset: numOptionsQueried});
    if (yelpResult.hasOwnProperty("error")) {
      return
    }
    numOptionsQueried = numOptionsQueried + numOptionsToQuery
    const businesses: any[] = yelpResult.businesses
    businesses.forEach(business => {
      possibleOptions.push({
        name: business.name,
        location: business.location.address1,
        imageUrl: business.image_url,
        distance: business.distance,
        rating: business.rating,
        price: business.price,
      })
    });
  }

  async function populateVisitedPlaces() {
    if (!$user) {
      return;
    }
    const visitedPlaces: any[] = await $user.callFunction("findVisitedPlaces");
    visitedPlaces.forEach(visitedPlace => {
      historyOptions.push({
        name: visitedPlace.name,
        location: visitedPlace.address,
      })
    })
  }

  async function closeStartingModal() {
    isModalOpen = false;
  
    await populateVisitedPlaces();
    historyOptions = historyOptions;

    await populatePossibleOptions();
    for (let i = 0; i < 3; i++ ) {
      const option = possibleOptions.shift()
      if (option) {
        locationOptions = [...locationOptions, option]
      }
    }
  }

  async function addRandomOption() {
    if (possibleOptions.length == 0) {
      await populatePossibleOptions()
    }
    var newOption = possibleOptions.shift()
    if (!newOption) {
      return
    }
    locationOptions = [...locationOptions, newOption]
  }

  async function shuffleOption(idx: number) {
    if (possibleOptions.length == 0) {
      await populatePossibleOptions()
    }
    var newOption = possibleOptions.shift()
    if (!newOption) {
      return
    }
    locationOptions[idx] = newOption
  }
  
  function addCustomLocationOption() {
    locationOptions = [...locationOptions, {name: customOptionName, location: customOptionLocation}];
	  customOptionName = '';
    customOptionLocation = '';
  }

  function addPastLocationOption(historyOption: LocationOption, idx: number) {
    locationOptions = [...locationOptions, historyOption];
    historyOptions.splice(idx, 1);
    historyOptions = historyOptions;
  }

  function removeLocationOption(idx: number) {
    locationOptions.splice(idx, 1)
	  locationOptions = locationOptions;
  }

  async function createEventDocument() {
    if (!$user) {
      return
    }
    const insertEventResult: any = await $user.callFunction("insertEvent", locationOptions);
    if (insertEventResult.hasOwnProperty("error")) {
      return
    }
    const id = insertEventResult.result
    goto(`/poll?id=${id}`)
  }
</script>

<style>
  .location-thumbnail {
    max-width: 100px;
  }
  .location-ctrl {
    font-size: 34px;
  }
</style>

<div class="modal" class:modal-open={isModalOpen}>
  <div class="modal-box">
  <div class="form-control">
    <label class="input-group input-group-vertical">
      <span>Event Title</span>
      <input bind:value={eventTitle} type="text" placeholder="Team Drinks" class="input input-bordered" />
    </label>
  </div>
  <div class="form-control">
    <span>Starting Location</span>
    <label class="label cursor-pointer">
      <span class="label-text">NYC Office</span>
      <input type="radio" bind:group={startingLocation} value={{lat: 40.76272920191958, long: -73.98491030739083}} class="radio input" checked />
    </label>
    <label class="label cursor-pointer">
      <span class="label-text">Austin Office</span>
      <input type="radio" bind:group={startingLocation} value={{lat: 30.24648868551071, long: -97.80456787726763}} class="radio input" checked />
    </label>
  </div>
  <div class="form-control">
    <label class="input-group input-group-vertical">
      <span>Radius (in miles)</span>
      <input bind:value={radiusInMiles} type="number" class="input" min=0 />
    </label>
  </div>
  <div class="form-control">
    <label class="input-group input-group-vertical">
      <span>Search Term</span>
      <input bind:value={searchTerm} type="text" placeholder="Bar" class="input input-bordered" />
    </label>
  </div>
    <div class="modal-action">
      <button class="btn" on:click={closeStartingModal}>Start event</button>
    </div>
  </div>
</div>
<div class="flex flex-row justify-center w-full space-x-10 mt-5">
    <div class="flex flex-col overflow-x-auto">
        <table class="table">
        <!-- head -->
        <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Location</th>
            </tr>
        </thead>
        <tbody>
            {#each locationOptions as location, idx}
                <tr class="hover bg-base-200">
                    <td>
                        <img src={location.imageUrl} class="location-thumbnail"/>
                    </td>
                    <td>
                      <strong>{location.name}</strong>
                      <div><img src={ratingsToImage[location.rating]}/></div>
                      <div><strong>{location.price || ''}</strong></div>
                    </td>
                    <td>
                      {location.location || ''}
                      <div>
                      {location.distance ? `${(location.distance / METERS_PER_MILE).toFixed(2)} miles away` : ''}
                      </div>
                    </td>
                    <td>
                        <div class="flex flex-row space-x-2">
                            <button on:click={() => shuffleOption(idx)} class="btn btn-outline btn-primary location-ctrl">🎲</button>
                            <button on:click={() => removeLocationOption(idx) } class="btn btn-outline btn-error location-ctrl">➖</button>
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
        </table>

        <button class="btn btn-success my-3" onclick="custom_event_modal.showModal()">Add Option</button>
        <dialog id="custom_event_modal" class="modal">
        <form method="dialog" class="modal-box">
            <div class="flex flex-col justify-center form-control w-full space-y-3">
                <button on:click={addRandomOption} class="btn btn-success my-3">Add Random Option</button>

                <div class="divider"> OR </div> 

                <div>
                    <label class="label">
                    <span class="label-text">Name</span>
                    </label>
                    <input bind:value={customOptionName} type="text" placeholder="Type here" class="input input-bordered w-full" />
                </div>

                <div>
                <label class="label">
                    <span class="label-text">Location</span>
                </label>
                <input bind:value={customOptionLocation} type="text" placeholder="Type here" class="input input-bordered w-full" />
                </div>

                <button on:click={addCustomLocationOption} class="btn btn-success my-3">Add Custom Option</button>
            </div>
        </form>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
        </dialog>

        {#if historyOptions.length > 0}
        <div>
        <b class=" text-lg text-teal-500">Want to add a past location winner?</b>
        <div class="flex flex-col overflow-x-auto">
          <table class="text-left w-full">
            <thead>
              <tr class="flex w-full mb-4 text-zinc-400 text-xs">
                <th class="p-4 w-1/3 ">Name</th>
                <th class="p-4 w-1/3">Location</th>
              </tr>
            </thead>
            <tbody class="bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full" style="height: 20vh;">
              {#each historyOptions as historyOption, idx}
                <tr class="hover bg-base-200 flex w-full mb-4">
                  <td class="p-4 w-1/3">
                    <strong>{historyOption.name}</strong>
                  </td>
                  <td class="p-4 w-1/3">
                    {historyOption.location || ''}
                  </td>
                  <td class="p-4 w-1/3">
                    <div class="flex flex-row space-x-2">
                        <button on:click={() => addPastLocationOption(historyOption, idx)} class="btn btn-outline btn-primary location-ctrl">➕</button>
                    </div>
                </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
      {/if}
        <div class="divider"></div> 
        <button on:click={createEventDocument} class="btn btn-primary">Create Poll</button>
    </div>
</div>
<div class="flex items-center mt-10">
</div>


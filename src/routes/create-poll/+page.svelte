<!-- create-poll/+page.svelte -->
<script lang="ts">
  import map from '$lib/assets/map.jpg';
  import type { LocationOption } from '../../types/location_option.type';
  
  let customOptionName = '';
  let customOptionLocation = '';

  let locationOptions: LocationOption[] = [];
  
  function addCustomLocationOption() {
    locationOptions = [...locationOptions, {name: customOptionName, location: customOptionLocation}];
	customOptionName = '';
    customOptionLocation = '';
  }

  function removeLocationOption(idx: number) {
    locationOptions.splice(idx, 1)
	locationOptions = locationOptions;
  }
</script>

<div class="flex flex-row justify-center w-full space-x-10 mt-5">
    <div class="flex flex-col overflow-x-auto justify-center">
        <img src={map} class="max-w-sm rounded-lg shadow-l aspect-square mb-5 w-80">
    </div>
    <div class="flex flex-col overflow-x-auto">
        <div class="form-control">
            <label class="input-group input-group-vertical">
              <span>Event Title</span>
              <input type="text" placeholder="Team Drinks" class="input input-bordered" />
            </label>
          </div>
        <table class="table">
        <!-- head -->
        <thead>
            <tr>
            <th>Name</th>
            <th>Location</th>
            </tr>
        </thead>
        <tbody>
            {#each locationOptions as location, idx}
                <tr class="hover bg-base-200">
                    <td>{location.name}</td>
                    <td>{location.location}</td>
                    <td>
                        <div class="flex flex-row space-x-2">
                            <button class="btn btn-outline btn-primary">🎲</button>
                            <button on:click={() => removeLocationOption(idx) } class="btn btn-outline btn-error">➖</button>
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
                <button class="btn btn-success my-3">Add Random Option</button>

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

        <div class="divider"></div> 
        <button class="btn btn-primary">Create Event</button>
    </div>
</div>
<div class="flex justify-center items-center mt-10">
</div>

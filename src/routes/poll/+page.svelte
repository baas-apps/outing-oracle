<!-- poll/+page.svelte -->
<script lang="ts">

    const Vote = {
        None: 0,
        Yes: 1,
        Neutral: 2,
        No: 3,
    }
  
    let locationData = [
      {
          name: "bar1",
          location: "midtown",
          description: "a bar",
          vote: Vote.Yes
      },
      {
          name: "bar2",
          location: "soho",
          description: "a bar 2",
          vote: Vote.No
      },
      {
          name: "bar3",
          location: "hells kitchen",
          description: "a bar 3",
          vote: Vote.Neutral
      },
    ]
  </script>
  
  <div class="flex flex-row justify-center w-full space-x-10 mt-5">
      <div class="flex flex-col overflow-x-auto">
          <table class="table">
          <!-- head -->
          <thead>
              <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Description</th>
              </tr>
          </thead>
          <tbody>
              {#each locationData as location, idx}
                  <tr class="hover bg-base-200">
                      <td>{location.name}</td>
                      <td>{location.location}</td>
                      <td>{location.description}</td>
                      <td>
                          <div class="flex flex-row space-x-2">
                              <button class="btn {location.vote == Vote.Yes? "":"btn-outline"} btn-success">️✓</button>
                              <button class="btn {location.vote == Vote.Neutral ? "":"btn-outline"} btn-warning">o</button>
                              <button class="btn {location.vote == Vote.No ? "":"btn-outline"} btn-error">x</button>
                          </div>
                      </td>
                  </tr>
              {/each}
          </tbody>
          </table>
          <button class="btn btn-success my-3">Submit Vote</button>
      </div>
  </div>
  <div class="flex justify-center items-center mt-10">
  </div>
  
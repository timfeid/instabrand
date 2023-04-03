<script lang="ts">
  import { createEventDispatcher, type SvelteComponent } from "svelte";

  type Tab = {
    name: string
    component: typeof SvelteComponent
  }

  const dispatch = createEventDispatcher()

  const setTab = (index: number) => {
    tabIndex = index
    dispatch('change', index)
  }

  export let tabs: Tab[]
  export let tabIndex = 0
</script>

<div>
  <nav class="border-b">
    <ul class="flex">
      {#each tabs as tab, index}
        <li>
          <button class:bg-gray-200={tabIndex === index} class="py-2 px-4 border" on:click={() => setTab(index)}>{tab.name}</button>
        </li>
      {/each}
    </ul>
  </nav>
  <div class="mt-6">
    <svelte:component this={tabs[tabIndex].component}></svelte:component>
  </div>
</div>

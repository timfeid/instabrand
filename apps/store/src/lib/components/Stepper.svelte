<script lang="ts">
import type { SvelteComponent } from "svelte";
import Step from "./Step.svelte";


  type Step = {
    titleComponent: string
    bodyComponent: typeof SvelteComponent
    closedComponent?: typeof SvelteComponent
    isComplete: boolean
    isOpen: boolean
  }

  export let steps: Step[]
</script>

{#each steps as step, index}
  <div class="border-b pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
    <Step {index} isComplete={step.isComplete} isOpen={step.isOpen}>
      <div slot="title">{step.titleComponent}</div>
      <svelte:component this={step.bodyComponent} />
      <div slot="closed">
        {#if step.closedComponent}
          <svelte:component this={step.closedComponent} />
        {/if}
      </div>
    </Step>
  </div>
{/each}

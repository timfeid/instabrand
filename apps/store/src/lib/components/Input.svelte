<script lang="ts">
  export let id: string
  export let label: string
  export let error = ''
</script>

<div class="input-block" class:error={error}>
  <label for={id}>{label}</label>
  <slot></slot>
  {#if error}
    <div class="mt-2 text-sm text-red-900">{label} {error.substring(error.indexOf(' '))}</div>
  {/if}
</div>

<style lang="scss">
  .input-block {
    margin-bottom: 1rem;
    font-size: 1.025rem;
    :global(input[type=text]) {
      color: black;
      font-size: 1rem;
      margin-top: .5rem;
      border-bottom: 1px solid #eaeaea;
      display: block;
      padding: .25rem .5rem;
      width: 100%;
    }

    &.error {
      :global(input[type=text]) {
        outline: none;
        box-shadow: 0 0 2px #990000;
      }
    }
  }
</style>

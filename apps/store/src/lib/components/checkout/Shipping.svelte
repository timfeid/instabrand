<script lang="ts">
	import { nextStep } from "../../stores/checkout";
import Address from "./AddressForm.svelte";


let validate = async () => false

const submit = async () => {
  if (await validate()) {
    nextStep()
  }
}

</script>

<div>
  <form on:submit|preventDefault={submit}>
    <Address bind:validate={validate}></Address>

    <button class="bg-brand-primary px-6 py-2 text-black rounded">Continue</button>
  </form>
</div>

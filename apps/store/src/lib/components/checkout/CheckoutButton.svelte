<script lang="ts">
	import { gql } from "@apollo/client";
	import { client } from "../../request";
	import { brand } from "../../stores";
	import { cart, defaultCart } from "../../stores/cart";
	import { checkout } from "$lib/stores/checkout";


  const submitPayment = async () => {
    checkout.update(data => ({
      ...data,
      state: 'loading',
    }))

    try {

      const response = await client.mutate({
        mutation: gql`mutation checkout($data: CheckoutInput!, $providerId: String!) {
        checkout(data: $data, providerId: $providerId)
      }`,
        variables: {
          brandId: $brand.id,
          data: {
            address: $checkout.address,
            customer: $checkout.customer,
          },
        },
      })

      checkout.update(data => ({
        ...data,
        state: 'success',
      }))

      cart.set({...defaultCart, sync: false})
    } catch (e) {
      console.log(e)
      checkout.update(data => ({
        ...data,
        state: 'idle',
      }))
    }
  }

</script>

<form on:submit|preventDefault={submitPayment}>
	<button
		disabled={$checkout.currentStep !== 3}
		class="bg-brand-primary text-black px-4 py-2 tracking-2 rounded disabled:opacity-40"
		>Confirm</button
	>
</form>

<script lang="ts">
  import { cart } from "$lib/stores/cart";
  import CartItems from "../cart/CartItems.svelte";
	import CheckoutButton from "./CheckoutButton.svelte";
</script>

<div>
  <CartItems items={$cart.lineItems} editable={false} />
</div>

<div class="hidden md:block mt-6">
  <CheckoutButton />
</div>

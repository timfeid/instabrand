<script lang="ts">
	import CartItems from "../../../lib/components/cart/CartItems.svelte";
	import CartSummary from "../../../lib/components/cart/CartSummary.svelte";
  import { cart } from "../../../lib/stores/cart";
</script>

{#if $cart.lineItems.length > 0}
  <div class="flex flex-col-reverse lg:flex-row">

    <div class="bg-white mt-6 md:mt-0 md:p-4 rounded w-full lg:w-2/3 h-min">
      <CartItems items={$cart.lineItems} />
    </div>
    <div class="bg-white md:p-4 rounded w-full mb-4 lg:mb-0 lg:w-1/3 lg:ml-8 flex items-center">
      <div class="w-full md:shadow md:p-4 static">

        <CartSummary cart={$cart}>
          <div class="mt-6">
            <a href="/checkout" class="text-center block bg-brand-primary text-black rounded w-full py-2">Proceed to checkout</a>
          </div>
        </CartSummary>
      </div>
    </div>
  </div>
{:else}
  Your cart is empty
{/if}

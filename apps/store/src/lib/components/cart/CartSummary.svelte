<script lang="ts">
  import { cart } from '$lib/stores/cart'
</script>

<div class="font-normal mb-4">
  Summary
</div>
<div class="flex">
  <div>Subtotal</div>
  <div class="ml-auto">{$cart.subtotal}</div>
</div>
<div class="flex">
  <div>Service fee</div>
  <div class="ml-auto">FREE</div>
</div>
<div class="flex border-t pt-4 mt-4">
  <div class="font-normal">Total</div>
  <div class="ml-auto font-normal">{$cart.total}</div>
</div>
<slot></slot>

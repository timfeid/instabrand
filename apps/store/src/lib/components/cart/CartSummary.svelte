<script lang="ts">
  import { cart } from '$lib/stores/cart'

  const formatter = Intl.NumberFormat(undefined, {
    currency: 'USD',
    style: 'currency',
  })

</script>

<div class="font-normal mb-4">
  Summary
</div>
<div class="flex">
  <div>Subtotal</div>
  <div class="ml-auto">{formatter.format($cart.subtotal_cents / 100)}</div>
</div>
<div class="flex">
  <div>Service fee</div>
  <div class="ml-auto">FREE</div>
</div>
<div class="flex border-t pt-4 mt-4">
  <div class="font-normal">Total</div>
  <div class="ml-auto font-normal">{formatter.format($cart.total_cents / 100)}</div>
</div>
<slot></slot>

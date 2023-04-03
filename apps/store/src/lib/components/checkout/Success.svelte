<script lang="ts">
  import { browser } from '$app/environment';
  // @ts-ignore
  import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
</script>

<div class="flex flex-col items-center mt-12 h-96">

  <div class="text-5xl">Thank you!</div>
  <div class="mt-4">Your order has been processed.</div>
  {#if browser}
    <LottiePlayer style="width: 500px; height: 500px;" src="/payment-success.json" height={300} loop={false} autoplay={true} />
  {/if}
</div>

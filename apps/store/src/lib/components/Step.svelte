<script lang="ts">
	import Success from '$lib/icons/ui/Success.svg?component';
	// @ts-ignore
	export let isOpen: boolean;
	export let isComplete: boolean;
	export let index: number;
</script>

<div class="flex">
	<div class="mr-4">
		<div class="rounded-full border px-2 font-thin text-sm" style="width: 25px; height: 25px;">
			{#if isComplete}
				<Success class="relative -left-[6px] top-[1px]" width={20} height={20} />
			{:else}
				{index + 1}
			{/if}
		</div>
	</div>
	<div class="flex-grow">
		<div class="font-normal">
			<slot name="title" />
		</div>
		<div class="mt-4">
			{#if isOpen}
				<slot />
			{/if}
			{#if !isOpen}
				<slot name="closed" />
			{/if}
		</div>
	</div>
</div>

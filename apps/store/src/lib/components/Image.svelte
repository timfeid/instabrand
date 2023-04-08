<script lang="ts">
	import type { Image } from '../bindings';

	export let image: Image;
</script>

<picture>
	{#each image.picture_sources as source}
		<source srcset={source.srcset} media={source.media} />
	{/each}
	<img src={image.src} alt={image.alt} loading="lazy" />
</picture>

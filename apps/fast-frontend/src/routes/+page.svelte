<script lang="ts">
	import { browser } from "$app/environment";
	import { client } from "../lib/client";
	import type { PageData } from "./$types";

  export let data: PageData

	const product = data.product

</script>

<pre>
	{JSON.stringify(product || "false", null, 2)}
</pre>

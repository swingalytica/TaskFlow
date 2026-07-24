<script lang="ts">
	import SidebarLeft from '$lib/components/sidebar-left.svelte';
	import { toast } from 'svelte-sonner';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	$effect(() => {
		if (form) {
			console.log('Form data:', form);
			if (form.error) {
				toast.error(form.error, { duration: 5000 });
			}
		}
	});
</script>

<svelte:head>
	<title>{data.organization.name} - Kanlo</title>
</svelte:head>

<div class="flex h-screen">
	<SidebarLeft {data} />
</div>

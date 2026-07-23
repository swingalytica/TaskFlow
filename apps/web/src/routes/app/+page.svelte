<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let name = $state('');
	let logo_url = $state('');

	function generateLogoFallback(name: string): string | null {
		if (name.trim() === '') {
			return null;
		}

		const initials = name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase();
		return initials;
	}
</script>

<svelte:head>
	<title>Your Organisations - Kanlo</title>
</svelte:head>

{#if data.memberships && data.memberships.length == 0}
	<div class="flex h-full flex-col items-center justify-center gap-8 p-6">
		<div class="flex flex-col items-center gap-2 text-center">
			<h1 class="text-2xl font-semibold tracking-tight text-foreground">
				Set up your organisation
			</h1>
			<p class="max-w-sm text-sm text-muted-foreground">
				This is the home for your team's boards. You can invite others once it's created.
			</p>
		</div>

		<form
			method="POST"
			action="?/create_organisation"
			class="flex w-full max-w-sm flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm"
		>
			<div class="flex flex-col items-center gap-3">
				<Avatar.Root class="h-16 w-16 rounded-2xl ring-2 ring-primary/20">
					<Avatar.Image src={logo_url} alt={name} class="rounded-2xl" />
					<Avatar.Fallback
						class="rounded-2xl bg-primary text-lg font-semibold text-primary-foreground"
					>
						{generateLogoFallback(name) ?? 'AC'}
					</Avatar.Fallback>
				</Avatar.Root>
				<span class="text-xs text-muted-foreground">Preview updates as you type</span>
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="name" class="text-sm font-medium text-foreground">Name</Label>
				<Input
					id="name"
					name="name"
					type="text"
					bind:value={name}
					required
					placeholder="Acme Inc."
				/>
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="logo_url" class="text-sm font-medium text-foreground">Logo URL</Label>
				<Input
					id="logo_url"
					name="logo_url"
					type="url"
					bind:value={logo_url}
					placeholder="https://example.com/logo.png"
				/>
			</div>

			<Button type="submit" class="mt-1">Create organisation</Button>
		</form>
	</div>
{:else}
	<div class="p-6">
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-xl font-semibold tracking-tight text-foreground">Your organisations</h1>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.memberships as membership (membership._id)}
				<a
					href="/app/{membership.organization._id}"
					class="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
				>
					{#if membership.organization.icon}
						<img
							src={membership.organization.icon}
							alt={membership.organization.name}
							class="h-12 w-12 rounded-xl object-cover"
						/>
					{:else}
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
						>
							{generateLogoFallback(membership.organization.name)}
						</div>
					{/if}

					<div class="flex flex-col gap-1">
						<span class="font-medium text-foreground">{membership.organization.name}</span>
						<Badge variant="secondary" class="w-fit text-xs font-normal capitalize">
							{membership.role.toLowerCase()}
						</Badge>
					</div>
				</a>
			{/each}
		</div>
	</div>
{/if}

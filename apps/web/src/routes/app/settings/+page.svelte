<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { shorten_user_name } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let name = $state('');
	let avatar = $state('');
	let email = $state('');
	let password_dialog_open = $state(false);

	$effect(() => {
		name = data?.user?.name ?? '';
		avatar = data?.user?.avatar ?? '';
		email = data?.user?.email ?? '';

		console.log(form);

		if (form?.error) {
			toast.error(form.error, {
				duration: 4000
			});
		} else if (form?.message) {
			toast.success('Profile updated successfully!', {
				duration: 4000
			});
		}
	});
</script>

<div class="mx-auto flex w-full max-w-3xl flex-col gap-8 p-6">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Settings</h1>
		<p class="text-sm text-muted-foreground">Manage your account preferences.</p>
	</div>

	<!-- Profile -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Profile</Card.Title>
			<Card.Description>Update your personal information.</Card.Description>
		</Card.Header>

		<Card.Content>
			<form method="POST" action="?/update_profile" class="flex flex-col gap-5" use:enhance>
				<div class="flex flex-col gap-2">
					<Label for="name">Name</Label>
					<Input id="name" name="name" bind:value={name} placeholder="Your name" />
				</div>

				<div class="flex flex-col gap-2">
					<Label for="email">Email</Label>
					<Input id="email" name="email" value={email} disabled />
					<p class="text-xs text-muted-foreground">Email changes are managed separately.</p>
				</div>

				<div class="flex flex-col gap-2">
					<Label for="avatar">Avatar URL</Label>
					<div class="flex items-center gap-3">
						<Avatar.Root class="h-12 w-12">
							<Avatar.Image src={avatar} alt="User Avatar" />
							<Avatar.Fallback>{shorten_user_name(name)}</Avatar.Fallback>
						</Avatar.Root>
						<Input
							id="avatar"
							name="avatar"
							bind:value={avatar}
							placeholder="https://example.com/avatar.png"
						/>
					</div>
				</div>

				<Button type="submit" class="w-fit">Save changes</Button>
			</form>
		</Card.Content>
	</Card.Root>

	<!-- Security -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Security</Card.Title>
			<Card.Description>Manage your account security.</Card.Description>
		</Card.Header>

		<Card.Content>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium">Password</p>
					<p class="text-sm text-muted-foreground">
						Update your password to keep your account secure.
					</p>
				</div>

				<Dialog.Root bind:open={password_dialog_open}>
					<Dialog.Trigger>
						<Button variant="outline">Change password</Button>
					</Dialog.Trigger>

					<Dialog.Content class="sm:max-w-md">
						<Dialog.Header>
							<Dialog.Title>Change password</Dialog.Title>
							<Dialog.Description>
								Enter your current password and choose a new one.
							</Dialog.Description>
						</Dialog.Header>

						<form method="POST" action="?/change_password" class="flex flex-col gap-4">
							<div class="flex flex-col gap-2">
								<Label for="current_password">Current password</Label>

								<Input id="current_password" name="current_password" type="password" required />
							</div>

							<div class="flex flex-col gap-2">
								<Label for="new_password">New password</Label>

								<Input id="new_password" name="new_password" type="password" required />
							</div>

							<div class="flex flex-col gap-2">
								<Label for="confirm_password">Confirm new password</Label>

								<Input id="confirm_password" name="confirm_password" type="password" required />
							</div>

							<Dialog.Footer>
								<Button type="submit">Update password</Button>
							</Dialog.Footer>
						</form>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</Card.Content>
	</Card.Root>
</div>

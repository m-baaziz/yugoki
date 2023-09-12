<script lang="ts">
	import '../app.css';

	let menuOpen: boolean = false;
</script>

<div class="min-h-full">
	<nav
		class="mx-auto flex flex-col items-center max-w-screen-uw border-b border-gray-200 bg-white"
		aria-label="Global"
	>
		<div class="mx-auto flex w-full items-center justify-between gap-x-6 p-6 lg:px-8">
			<div class="flex lg:flex-1">
				<a href="/" class="-m-1.5 p-1.5">
					<span class="sr-only">Limz.io</span>
					<img class="h-8 w-auto" src="/logo.png" alt="" />
				</a>
			</div>
			<div class="hidden sm:flex">
				<div class="mt-2 flex w-96 rounded-md shadow-sm">
					<div class="relative flex flex-grow items-stretch focus-within:z-10">
						<input
							type="search"
							name="search"
							id="search"
							class="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							placeholder="Anywhere ..."
						/>
					</div>
					<button
						type="button"
						class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
					>
						<svg
							class="h-5 w-5 text-gray-400"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								d="M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z"
							/>
						</svg>
						<!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>crosshairs</title><path d="M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z" /></svg> -->
					</button>
				</div>
			</div>
			<div class="flex flex-1 items-center justify-end gap-x-6">
				<a
					href="/"
					class="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900"
					>Log in</a
				>
				<a
					href="/"
					class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>Sign up</a
				>
			</div>
			<div class="flex lg:hidden">
				<button
					type="button"
					class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
					on:click={() => {
						menuOpen = true;
					}}
				>
					<span class="sr-only">Open main menu</span>
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				</button>
			</div>
		</div>
		<div class="flex sm:hidden px-8">
			<div class="mt-2 flex w-full rounded-md shadow-sm">
				<div class="relative flex flex-grow items-stretch focus-within:z-10">
					<input
						type="search"
						name="search"
						id="search"
						class="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						placeholder="Anywhere ..."
					/>
				</div>
				<button
					type="button"
					class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
				>
					<svg
						class="h-5 w-5 text-gray-400"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							d="M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z"
						/>
					</svg>
					<!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>crosshairs</title><path d="M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z" /></svg> -->
				</button>
			</div>
		</div>
	</nav>
	<!-- Mobile menu, show/hide based on menu open state. -->
	<div class="lg:hidden" class:hidden={!menuOpen} role="dialog" aria-modal="true">
		<!-- Background backdrop, show/hide based on slide-over state. -->
		<div class="fixed inset-0 z-10" />
		<div
			class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
		>
			<div class="flex items-center gap-x-6">
				<a href="/" class="-m-1.5 p-1.5">
					<span class="sr-only">Limz.io</span>
					<img class="h-8 w-auto" src="/logo.png" alt="" />
				</a>
				<a
					href="/"
					class="ml-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>Sign up</a
				>
				<button
					type="button"
					class="-m-2.5 rounded-md p-2.5 text-gray-700"
					on:click={() => {
						menuOpen = false;
					}}
				>
					<span class="sr-only">Close menu</span>
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="mt-6 flow-root">
				<div class="-my-6 divide-y divide-gray-500/10">
					<div class="space-y-2 py-6">
						<a
							href="/"
							class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
							>Product</a
						>
						<a
							href="/"
							class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
							>Features</a
						>
						<a
							href="/"
							class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
							>Marketplace</a
						>
						<a
							href="/"
							class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
							>Company</a
						>
					</div>
					<div class="py-6">
						<a
							href="/"
							class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
							>Log in</a
						>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="py-10">
		<main>
			<div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
				<slot />
			</div>
		</main>
	</div>
</div>

<style>
	.max-w-screen-uw {
		max-width: 2520px;
	}
</style>

import { createRootRoute, Outlet } from "@tanstack/react-router";
import * as React from "react";
import Icon from "../components/icon";
import { useTheme } from "../providers/theme-providers";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const { theme, toggleTheme } = useTheme();

	return (
		<React.Fragment>
			<main className="h-full flex flex-col">
				<header className="h-[10%] z-100 fixed top-0 left-0 w-full  p-4 md:p-8 max-h-[200px] element shadow-lg">
					<div className="h-full w-full flex items-center justify-between gap-4 max-w-7xl mx-auto">
						<h1 className="font-[700] text-xl md:text-2xl">
							Where in the world?
						</h1>

						<button
							type="button"
							onClick={toggleTheme}
							className="flex text-sm font-[600] items-center gap-1"
						>
							<Icon theme={theme} />
							<p>{theme} Mode</p>
						</button>
					</div>
				</header>
				<section className="mt-20 md:mt-40 py-6 flex-1">
					<Outlet />
				</section>
			</main>
		</React.Fragment>
	);
}

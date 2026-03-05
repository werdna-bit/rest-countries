import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Icon from "./components/icon";
import SearchIcon from "./components/search-icon";
import { useTheme } from "./providers/theme-providers";

interface Country {
	flags: {
		png: string;
		svg: string;
		alt?: string;
	};
	name: {
		common: string;
		official: string;
		nativeName?: {
			[key: string]: {
				official: string;
				common: string;
			};
		};
	};
	capital: string[];
	region: string;
	population: number;
}

const fetchCountries = async (search: string) => {
	let url: string;

	if (search.length > 0) {
		url = `https://restcountries.com/v3.1/name/${encodeURIComponent(search)}`;
	} else {
		url =
			"https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital";
	}

	const res = await fetch(url);

	if (!res.ok) {
		if (res.status === 404) {
			throw new Error("No countries found");
		}
		throw new Error(`Error: ${res.status} - ${res.statusText}`);
	}

	const data: Country[] = await res.json();
	return data;
};

export default function App() {
	const [search, setSearch] = useState("");

	const { data, isLoading, error } = useQuery({
		queryKey: ["countries", search],
		queryFn: () => fetchCountries(search),
		staleTime: 5 * 60 * 1000,
	});

	if (error) return "Error";

	return (
		<main className="w-full h-full p-4 max-w-7xl mx-auto">
			<section className="h-full">
				<div className="grid gap-4 w-full md:grid-cols-2">
					<div className="w-full h-15 relative">
						<input
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search for a country..."
							className="w-full h-full px-6 element transition-all duration-100 ease-in-out rounded-lg pl-15 shadow-lg outline-none focus:shadow-[0px_0px_3px]"
						/>
						<div className="absolute top-1/2 left-6 -translate-y-1/2">
							<SearchIcon />
						</div>
					</div>
				</div>
				{isLoading ? (
					" loading"
				) : (
					<div className="grid md:grid-cols-3 gap-8 mt-8">
						{data && data.length > 0 ? (
							<>
								{data.map((country) => (
									<Link
										to="/country/$name"
										params={{
											name: country.name.official
												.trim()
												.replace(/\s/g, "-")
												.toLowerCase(),
										}}
										key={country.name.official}
										className="flex flex-col max-w-[400px] hover:scale-102 transition-all duration-200 ease-in-out cursor-pointer w-[80%] overflow-hidden element shadow-lg rounded-2xl mx-auto"
									>
										<div className="aspect-[3/4] overflow-hidden h-[20vh] relative">
											<img
												src={country.flags.svg}
												alt={country.flags.alt}
												className="object-cover w-full h-full"
											/>
										</div>
										<div className="flex-1 p-8">
											<h1 className="text-xl font-[700]">
												{country.name.common}
											</h1>
											<div className="mt-3 space-y-1">
												<p className="font-[500]">
													Population:{" "}
													<span className="font-light">
														{country.population}
													</span>
												</p>

												<p className="font-[500]">
													Region:{" "}
													<span className="font-light">{country.region}</span>
												</p>

												<p className="font-[500]">
													Capital:
													<span className="font-light">{country.capital}</span>
												</p>
											</div>
										</div>
									</Link>
								))}
							</>
						) : (
							"empty"
						)}
					</div>
				)}
			</section>
		</main>
	);
}

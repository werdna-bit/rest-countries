import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Chevron } from "./components/chevron";
import SearchIcon from "./components/search-icon";
import { Spinner } from "./components/spinner";

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

const regions = ["Africa", "America", "Europe", "Asia", "Oceania"];
type RegionType = (typeof regions)[number];

const fetchCountries = async ({
	region,
	search,
}: {
	region: RegionType | null;
	search: string;
}) => {
	let url: string;
	if (region) {
		url = `https://restcountries.com/v3.1/region/${region}`;
	} else if (search.length > 0) {
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
	const [region, setRegion] = useState<RegionType | null>(null);
	const [open, setOpen] = useState(false);
	const popupRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				popupRef.current &&
				buttonRef.current &&
				!popupRef.current.contains(event.target as Node) &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	const { data, isLoading, error } = useQuery({
		queryKey: ["countries", search, region],
		queryFn: () => fetchCountries({ search, region }),
		staleTime: 5 * 60 * 1000,
	});

	if (error) return "Error";

	return (
		<main className="w-full h-full p-4 max-w-7xl mx-auto">
			<section className="h-full">
				<div className="grid gap-4 w-full md:flex md:items-center md:justify-between">
					<div className="w-full h-15 relative md:max-w-[400px]">
						<input
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search for a country..."
							className="w-full h-full px-6 element transition-all duration-100 ease-in-out rounded-lg pl-15 shadow-lg outline-none focus:shadow-[0px_0px_3px]"
						/>
						<div className="absolute top-1/2 left-6 -translate-y-1/2">
							<SearchIcon />
						</div>
					</div>
					<div className="w-full h-15 relative md:max-w-[300px]">
						<button
							ref={buttonRef}
							onClick={() => setOpen((prev) => !prev)}
							type="button"
							className="w-full cursor-pointer h-full px-6 element transition-all duration-100 ease-in-out rounded-lg  shadow-lg outline-none focus:scale-99 flex items-center "
						>
							Filter By Region
						</button>
						<div className="absolute top-1/2 right-6 -translate-y-1/2">
							<Chevron />
						</div>
						<div
							ref={popupRef}
							className={` ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"} transition-all duration-300 ease-in-out absolute top-full mt-2 z-105 shadow-lg left-0 w-full p-4 rounded-lg element`}
						>
							<button
								key="all"
								className="w-full text-left hover:text-blue-800 cursor-pointer text-lg"
								onClick={() => {
									setRegion(null);
									setOpen(false);
								}}
								type="button"
							>
								All
							</button>
							{regions.map((region: RegionType) => (
								<button
									key={region}
									className="w-full text-left  hover:text-blue-800 cursor-pointer text-lg"
									onClick={() => {
										setRegion(region);
										setOpen(false);
									}}
									type="button"
								>
									{region}
								</button>
							))}
						</div>
					</div>
				</div>
				{isLoading ? (
					<div className="w-full h-[90%] flex items-center justify-center">
						<Spinner />
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[30px] mt-8">
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
										className="flex flex-col max-w-[400px] hover:scale-102 transition-all duration-200 ease-in-out cursor-pointer w-full overflow-hidden element shadow-lg rounded-2xl mx-auto"
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

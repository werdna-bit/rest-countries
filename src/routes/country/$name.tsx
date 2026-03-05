import { createFileRoute, Link } from "@tanstack/react-router";

interface Country {
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
	population: number;
	region: string;
	subregion?: string;
	capital: string[];
	tld?: string[];
	currencies?: {
		[key: string]: {
			name: string;
			symbol: string;
		};
	};
	languages?: {
		[key: string]: string;
	};
	borders?: string[];
	flags: {
		png: string;
		svg: string;
		alt?: string;
	};
}

const fetchCountries = async ({ name }: { name: string }) => {
	const res = await fetch(
		`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`,
	);
	if (!res.ok) {
		if (res.status === 404) {
			throw new Error("No country found");
		}
		throw new Error(`Error: ${res.status} - ${res.statusText}`);
	}
	const data: Country[] = await res.json();
	return data[0];
};

const fetchBorderCountries = async (codes: string[]) => {
	const res = await fetch(
		`https://restcountries.com/v3.1/alpha?codes=${codes.join(",")}&fields=name,cca3`,
	);
	if (!res.ok) {
		throw new Error("Failed to fetch border countries");
	}
	const data: Array<{ name: { common: string }; cca3: string }> =
		await res.json();
	return data;
};

export const Route = createFileRoute("/country/$name")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const country = await fetchCountries({
			name: params.name.replace(/-/g, " "),
		});

		let borderCountries: Array<{ name: { common: string }; cca3: string }> = [];
		if (country.borders && country.borders.length > 0) {
			borderCountries = await fetchBorderCountries(country.borders);
		}

		return { country, borderCountries };
	},
});

function RouteComponent() {
	const { country, borderCountries } = Route.useLoaderData();

	const nativeName = country.name.nativeName
		? Object.values(country.name.nativeName)[0]?.common
		: null;

	return (
		<div className="h-full flex flex-col items-center gap-8 p-4 px-8 md:p-8">
			<div className="w-full">
				<Link
					to="/"
					className="element flex items-center justify-center w-fit h-8 shadow-[0px_0px_7px] shadow-black/50 cursor-pointer px-8"
				>
					<p>Back</p>
				</Link>
			</div>
			<div className="w-full  max-w-[500px]">
				<img src={country.flags.svg} alt={country.flags.alt} />
			</div>
			<div className=" w-full">
				<h1 className="font-[700] text-xl">{country.name.official}</h1>
				<p className=" font-[700]  mt-6">
					Native Name: <span className="font-light">{nativeName}</span>{" "}
				</p>
				<p className=" font-[700]">
					Population: <span className="font-light">
						{country.population}
					</span>{" "}
				</p>
				<p className=" font-[700]">
					Region: <span className="font-light">{country.region}</span>{" "}
				</p>
				<p className=" font-[700]">
					Sub Region: <span className="font-light">
						{country.subregion}
					</span>{" "}
				</p>
				<p className=" font-[700]">
					Capital: <span className="font-light">{country.capital}</span>{" "}
				</p>
				<p className=" font-[700] mt-8">
					Top Level Domain: <span className="font-light">
						{country.tld}
					</span>{" "}
				</p>
				<p className=" font-[700]">
					Currencies:{" "}
					{country.currencies && (
						<span className="font-light">
							{Object.values(country.currencies)
								.map((currency) => currency.name)
								.join(", ")}
						</span>
					)}
				</p>
				<p className=" font-[700]">
					Languages:{" "}
					{country.languages && (
						<span className="font-light">
							{Object.values(country.languages)
								.map((l) => l)
								.join(", ")}
						</span>
					)}
				</p>
				<div className="mt-8 w-full">
					<h2 className="font-[700] text-lg">Border Countries</h2>
					<div className="w-full mt-4 flex items-center flex-wrap gap-4">
						{borderCountries.length > 0 ? (
							borderCountries.map((borderCountry) => (
								<Link
									key={borderCountry.cca3}
									to="/country/$name"
									params={{
										name: borderCountry.name.common
											.toLowerCase()
											.replace(/\s+/g, "-"),
									}}
									className="font-light element px-6 py-1 shadow-md"
								>
									{borderCountry.name.common}
								</Link>
							))
						) : (
							<span className="font-light">No border countries</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

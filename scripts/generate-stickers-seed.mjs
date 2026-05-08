import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const INPUT_PATH = resolve(ROOT, "data/listado-figuritad.txt");
const OUTPUT_SQL_PATH = resolve(ROOT, "supabase/seeds/2026_stickers_inserts.sql");
const OUTPUT_COUNTRIES_PATH = resolve(ROOT, "data/paises.txt");
const ALBUM_ID = "00000000-0000-4000-8000-000000000001";

const COUNTRY_TO_ES = {
  Algeria: "Argelia",
  Argentina: "Argentina",
  Australia: "Australia",
  Austria: "Austria",
  Belgium: "Bélgica",
  "Bosnia and Herzegovina": "Bosnia y Herzegovina",
  Brazil: "Brasil",
  Canada: "Canadá",
  "Cape Verde": "Cabo Verde",
  Colombia: "Colombia",
  "Congo DR": "Congo RD",
  Croatia: "Croacia",
  Curaçao: "Curazao",
  Czechia: "Chequia",
  Ecuador: "Ecuador",
  Egypt: "Egipto",
  England: "Inglaterra",
  France: "Francia",
  Germany: "Alemania",
  Ghana: "Ghana",
  Haiti: "Haití",
  Iran: "Irán",
  Iraq: "Irak",
  "Ivory Coast": "Costa de Marfil",
  Japan: "Japón",
  Jordan: "Jordania",
  Mexico: "México",
  Morocco: "Marruecos",
  Netherlands: "Países Bajos",
  "New Zealand": "Nueva Zelanda",
  Norway: "Noruega",
  Panama: "Panamá",
  Paraguay: "Paraguay",
  Portugal: "Portugal",
  Qatar: "Catar",
  "Saudi Arabia": "Arabia Saudita",
  Scotland: "Escocia",
  Senegal: "Senegal",
  "South Africa": "Sudáfrica",
  "South Korea": "Corea del Sur",
  Spain: "España",
  Sweden: "Suecia",
  Switzerland: "Suiza",
  Tunisia: "Túnez",
  Türkiye: "Turquía",
  Uruguay: "Uruguay",
  USA: "Estados Unidos",
  Uzbekistan: "Uzbekistán",
};

function sqlEscape(value) {
  return value.replaceAll("'", "''");
}

function normalizeCode(code) {
  return code.replace(/^(.+?)(\d+)([a-z]*)$/i, (_match, prefix, rawNumber, suffix) => {
    const normalizedNumber = String(Number.parseInt(rawNumber, 10));
    return `${prefix}${normalizedNumber}${suffix}`;
  });
}

function parseLine(line, knownCountries) {
  const parts = line.split(" - ").map((p) => p.trim());
  if (parts.length < 3) {
    throw new Error(`Formato inválido en línea: ${line}`);
  }

  const code = normalizeCode(parts[0]);
  const type = parts.at(-1);
  const middle = parts.slice(1, -1);

  let country = null;
  let name = middle.join(" - ");

  if (middle.length >= 2 && knownCountries.has(middle.at(-1))) {
    const sourceCountry = middle.at(-1);
    country = COUNTRY_TO_ES[sourceCountry] ?? sourceCountry;
    name = middle.slice(0, -1).join(" - ");
  }

  return { code, name, country, type };
}

function shouldIncludeSticker(type) {
  const normalizedType = type.trim().toLowerCase();
  if (normalizedType.includes("mcdonald")) return false;
  if (normalizedType.startsWith("extra")) return false;
  if (normalizedType.includes("silver")) return false;
  if (normalizedType.includes("gold")) return false;
  if (normalizedType.includes("bronze")) return false;
  return true;
}

function main() {
  const raw = readFileSync(INPUT_PATH, "utf8");
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const knownCountries = new Set();
  for (const line of lines) {
    const parts = line.split(" - ").map((p) => p.trim());
    const middle = parts.slice(1, -1);
    if (middle.length >= 2 && middle[0] === "Emblem") {
      knownCountries.add(middle.at(-1));
    }
  }

  const rows = lines
    .map((line) => parseLine(line, knownCountries))
    .filter((row) => shouldIncludeSticker(row.type));
  const countries = [...new Set(rows.map((row) => row.country).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );

  const valuesSql = rows
    .map((row) => {
      const name = sqlEscape(row.name);
      const type = sqlEscape(row.type);
      const country = row.country ? `'${sqlEscape(row.country)}'` : "NULL";
      return `  ('${ALBUM_ID}'::uuid, '${sqlEscape(row.code)}', '${name}', ${country}, '${type}')`;
    })
    .join(",\n");

  const sql = `-- Generated file. Do not edit manually.
-- Source: data/listado-figuritad.txt
-- Rows: ${rows.length}

DELETE FROM public.stickers
WHERE album_id = '${ALBUM_ID}'::uuid;

INSERT INTO public.stickers (album_id, code, name, country, type) VALUES
${valuesSql};
`;

  writeFileSync(OUTPUT_SQL_PATH, sql, "utf8");
  writeFileSync(OUTPUT_COUNTRIES_PATH, countries.join("\n") + "\n", "utf8");

  console.log(
    `Seed SQL generado (${rows.length} figuritas) en ${OUTPUT_SQL_PATH}. Países: ${countries.length} en ${OUTPUT_COUNTRIES_PATH}.`
  );
}

main();

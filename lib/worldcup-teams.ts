import teamsMeta from "@/data/worldcup.teams_meta.json";

type TeamMeta = {
  name: string;
  name_normalised?: string;
  fifa_code: string;
  flag_icon: string;
};

const UNKNOWN_FLAG = "🏳️";
const UNKNOWN_TEAM_NAME_ES = "Equipo";
const FLAG_NAME_ALIASES: Record<string, string> = {
  Chequia: "Czech Republic",
  "República Checa": "Czech Republic",
  "Congo RD": "DR Congo",
  "Congo R.D.": "DR Congo",
  "República Democrática del Congo": "DR Congo",
};

const TEAM_NAME_ES_BY_EN: Record<string, string> = {
  Mexico: "México",
  "South Africa": "Sudáfrica",
  "South Korea": "Corea del Sur",
  "Czech Republic": "República Checa",
  Canada: "Canadá",
  "Bosnia & Herzegovina": "Bosnia y Herzegovina",
  Qatar: "Catar",
  Switzerland: "Suiza",
  Brazil: "Brasil",
  Morocco: "Marruecos",
  Haiti: "Haití",
  Scotland: "Escocia",
  USA: "Estados Unidos",
  Paraguay: "Paraguay",
  Australia: "Australia",
  Turkey: "Turquía",
  Germany: "Alemania",
  "Curaçao": "Curazao",
  "Ivory Coast": "Costa de Marfil",
  Ecuador: "Ecuador",
  Netherlands: "Países Bajos",
  Japan: "Japón",
  Sweden: "Suecia",
  Tunisia: "Túnez",
  Belgium: "Bélgica",
  Egypt: "Egipto",
  Iran: "Irán",
  "New Zealand": "Nueva Zelanda",
  Spain: "España",
  "Cape Verde": "Cabo Verde",
  "Saudi Arabia": "Arabia Saudita",
  Uruguay: "Uruguay",
  France: "Francia",
  Senegal: "Senegal",
  Iraq: "Irak",
  Norway: "Noruega",
  Argentina: "Argentina",
  Algeria: "Argelia",
  Austria: "Austria",
  Jordan: "Jordania",
  Portugal: "Portugal",
  "DR Congo": "República Democrática del Congo",
  Uzbekistan: "Uzbekistán",
  Colombia: "Colombia",
  England: "Inglaterra",
  Croatia: "Croacia",
  Ghana: "Ghana",
  Panama: "Panamá",
};

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const flagByName = (() => {
  const map = new Map<string, string>();
  const rows = teamsMeta as TeamMeta[];
  for (const team of rows) {
    map.set(normalizeName(team.name), team.flag_icon);
    map.set(normalizeName(team.fifa_code), team.flag_icon);
    if (team.name_normalised) {
      map.set(normalizeName(team.name_normalised), team.flag_icon);
    }
  }
  for (const [englishName, spanishName] of Object.entries(TEAM_NAME_ES_BY_EN)) {
    const flag = map.get(normalizeName(englishName));
    if (flag) {
      map.set(normalizeName(spanishName), flag);
    }
  }
  for (const [alias, canonicalName] of Object.entries(FLAG_NAME_ALIASES)) {
    const flag = map.get(normalizeName(canonicalName));
    if (flag) {
      map.set(normalizeName(alias), flag);
    }
  }
  return map;
})();

export function getFlagByTeamName(teamName: string) {
  const key = normalizeName(teamName);
  return flagByName.get(key) ?? UNKNOWN_FLAG;
}

const spanishNameByAnyName = (() => {
  const map = new Map<string, string>();
  const rows = teamsMeta as TeamMeta[];
  for (const team of rows) {
    const spanishName = TEAM_NAME_ES_BY_EN[team.name] ?? team.name;
    map.set(normalizeName(team.name), spanishName);
    map.set(normalizeName(team.fifa_code), spanishName);
    if (team.name_normalised) {
      map.set(normalizeName(team.name_normalised), spanishName);
    }
    map.set(normalizeName(spanishName), spanishName);
  }
  return map;
})();

export function getTeamNameEs(teamName: string) {
  const key = normalizeName(teamName);
  return spanishNameByAnyName.get(key) ?? teamName ?? UNKNOWN_TEAM_NAME_ES;
}

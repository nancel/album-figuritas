export type Sticker = {
  id: string;
  code: string;
  playerName: string;
  country: string;
  countryCode: string;
  quantity: number;
  position: string;
};

export const TOTAL_STICKERS = 60;

export const mockStickers: Sticker[] = [
  // Argentina
  { id: "1",  code: "ARG-01", playerName: "Lionel Messi",       country: "Argentina",    countryCode: "ARG", quantity: 2, position: "Forward"    },
  { id: "2",  code: "ARG-02", playerName: "Ángel Di María",      country: "Argentina",    countryCode: "ARG", quantity: 1, position: "Winger"     },
  { id: "3",  code: "ARG-03", playerName: "Julián Álvarez",      country: "Argentina",    countryCode: "ARG", quantity: 0, position: "Forward"    },
  { id: "4",  code: "ARG-04", playerName: "Emiliano Martínez",   country: "Argentina",    countryCode: "ARG", quantity: 1, position: "Goalkeeper" },
  { id: "5",  code: "ARG-05", playerName: "Rodrigo De Paul",     country: "Argentina",    countryCode: "ARG", quantity: 3, position: "Midfielder" },
  // Brazil
  { id: "6",  code: "BRA-01", playerName: "Vinicius Jr.",        country: "Brazil",       countryCode: "BRA", quantity: 1, position: "Winger"     },
  { id: "7",  code: "BRA-02", playerName: "Rodrygo",             country: "Brazil",       countryCode: "BRA", quantity: 0, position: "Winger"     },
  { id: "8",  code: "BRA-03", playerName: "Casemiro",            country: "Brazil",       countryCode: "BRA", quantity: 2, position: "Midfielder" },
  { id: "9",  code: "BRA-04", playerName: "Marquinhos",          country: "Brazil",       countryCode: "BRA", quantity: 1, position: "Defender"   },
  { id: "10", code: "BRA-05", playerName: "Alisson Becker",      country: "Brazil",       countryCode: "BRA", quantity: 0, position: "Goalkeeper" },
  // France
  { id: "11", code: "FRA-01", playerName: "Kylian Mbappé",       country: "France",       countryCode: "FRA", quantity: 1, position: "Forward"    },
  { id: "12", code: "FRA-02", playerName: "Antoine Griezmann",   country: "France",       countryCode: "FRA", quantity: 2, position: "Forward"    },
  { id: "13", code: "FRA-03", playerName: "Aurélien Tchouaméni", country: "France",       countryCode: "FRA", quantity: 0, position: "Midfielder" },
  { id: "14", code: "FRA-04", playerName: "William Saliba",      country: "France",       countryCode: "FRA", quantity: 1, position: "Defender"   },
  { id: "15", code: "FRA-05", playerName: "Mike Maignan",        country: "France",       countryCode: "FRA", quantity: 0, position: "Goalkeeper" },
  // England
  { id: "16", code: "ENG-01", playerName: "Harry Kane",          country: "England",      countryCode: "ENG", quantity: 2, position: "Forward"    },
  { id: "17", code: "ENG-02", playerName: "Jude Bellingham",     country: "England",      countryCode: "ENG", quantity: 1, position: "Midfielder" },
  { id: "18", code: "ENG-03", playerName: "Phil Foden",          country: "England",      countryCode: "ENG", quantity: 0, position: "Midfielder" },
  { id: "19", code: "ENG-04", playerName: "Bukayo Saka",         country: "England",      countryCode: "ENG", quantity: 1, position: "Winger"     },
  { id: "20", code: "ENG-05", playerName: "Jordan Pickford",     country: "England",      countryCode: "ENG", quantity: 3, position: "Goalkeeper" },
  // Germany
  { id: "21", code: "GER-01", playerName: "Florian Wirtz",       country: "Germany",      countryCode: "GER", quantity: 1, position: "Midfielder" },
  { id: "22", code: "GER-02", playerName: "Jamal Musiala",       country: "Germany",      countryCode: "GER", quantity: 0, position: "Midfielder" },
  { id: "23", code: "GER-03", playerName: "Joshua Kimmich",      country: "Germany",      countryCode: "GER", quantity: 2, position: "Midfielder" },
  { id: "24", code: "GER-04", playerName: "Antonio Rüdiger",     country: "Germany",      countryCode: "GER", quantity: 1, position: "Defender"   },
  { id: "25", code: "GER-05", playerName: "Manuel Neuer",        country: "Germany",      countryCode: "GER", quantity: 0, position: "Goalkeeper" },
  // Spain
  { id: "26", code: "ESP-01", playerName: "Pedri",               country: "Spain",        countryCode: "ESP", quantity: 1, position: "Midfielder" },
  { id: "27", code: "ESP-02", playerName: "Lamine Yamal",        country: "Spain",        countryCode: "ESP", quantity: 2, position: "Winger"     },
  { id: "28", code: "ESP-03", playerName: "Álvaro Morata",       country: "Spain",        countryCode: "ESP", quantity: 0, position: "Forward"    },
  { id: "29", code: "ESP-04", playerName: "Rodri",               country: "Spain",        countryCode: "ESP", quantity: 1, position: "Midfielder" },
  { id: "30", code: "ESP-05", playerName: "Unai Simón",          country: "Spain",        countryCode: "ESP", quantity: 0, position: "Goalkeeper" },
  // Portugal
  { id: "31", code: "POR-01", playerName: "Cristiano Ronaldo",   country: "Portugal",     countryCode: "POR", quantity: 3, position: "Forward"    },
  { id: "32", code: "POR-02", playerName: "Bruno Fernandes",     country: "Portugal",     countryCode: "POR", quantity: 1, position: "Midfielder" },
  { id: "33", code: "POR-03", playerName: "Rafael Leão",         country: "Portugal",     countryCode: "POR", quantity: 0, position: "Winger"     },
  { id: "34", code: "POR-04", playerName: "Rúben Dias",          country: "Portugal",     countryCode: "POR", quantity: 1, position: "Defender"   },
  { id: "35", code: "POR-05", playerName: "Diogo Costa",         country: "Portugal",     countryCode: "POR", quantity: 0, position: "Goalkeeper" },
  // Netherlands
  { id: "36", code: "NED-01", playerName: "Virgil van Dijk",     country: "Netherlands",  countryCode: "NED", quantity: 1, position: "Defender"   },
  { id: "37", code: "NED-02", playerName: "Xavi Simons",         country: "Netherlands",  countryCode: "NED", quantity: 2, position: "Midfielder" },
  { id: "38", code: "NED-03", playerName: "Cody Gakpo",          country: "Netherlands",  countryCode: "NED", quantity: 0, position: "Forward"    },
  { id: "39", code: "NED-04", playerName: "Frenkie de Jong",     country: "Netherlands",  countryCode: "NED", quantity: 1, position: "Midfielder" },
  { id: "40", code: "NED-05", playerName: "Bart Verbruggen",     country: "Netherlands",  countryCode: "NED", quantity: 0, position: "Goalkeeper" },
  // Italy
  { id: "41", code: "ITA-01", playerName: "Federico Chiesa",     country: "Italy",        countryCode: "ITA", quantity: 1, position: "Winger"     },
  { id: "42", code: "ITA-02", playerName: "Sandro Tonali",       country: "Italy",        countryCode: "ITA", quantity: 0, position: "Midfielder" },
  { id: "43", code: "ITA-03", playerName: "Ciro Immobile",       country: "Italy",        countryCode: "ITA", quantity: 2, position: "Forward"    },
  { id: "44", code: "ITA-04", playerName: "Alessandro Bastoni",  country: "Italy",        countryCode: "ITA", quantity: 1, position: "Defender"   },
  { id: "45", code: "ITA-05", playerName: "Gianluigi Donnarumma",country: "Italy",        countryCode: "ITA", quantity: 0, position: "Goalkeeper" },
  // Morocco
  { id: "46", code: "MAR-01", playerName: "Achraf Hakimi",       country: "Morocco",      countryCode: "MAR", quantity: 1, position: "Defender"   },
  { id: "47", code: "MAR-02", playerName: "Hakim Ziyech",        country: "Morocco",      countryCode: "MAR", quantity: 2, position: "Winger"     },
  { id: "48", code: "MAR-03", playerName: "Sofiane Boufal",      country: "Morocco",      countryCode: "MAR", quantity: 0, position: "Winger"     },
  { id: "49", code: "MAR-04", playerName: "Nayef Aguerd",        country: "Morocco",      countryCode: "MAR", quantity: 1, position: "Defender"   },
  { id: "50", code: "MAR-05", playerName: "Yassine Bounou",      country: "Morocco",      countryCode: "MAR", quantity: 0, position: "Goalkeeper" },
  // USA
  { id: "51", code: "USA-01", playerName: "Christian Pulisic",   country: "USA",          countryCode: "USA", quantity: 2, position: "Winger"     },
  { id: "52", code: "USA-02", playerName: "Tyler Adams",         country: "USA",          countryCode: "USA", quantity: 1, position: "Midfielder" },
  { id: "53", code: "USA-03", playerName: "Gio Reyna",           country: "USA",          countryCode: "USA", quantity: 0, position: "Midfielder" },
  { id: "54", code: "USA-04", playerName: "Weston McKennie",     country: "USA",          countryCode: "USA", quantity: 1, position: "Midfielder" },
  { id: "55", code: "USA-05", playerName: "Matt Turner",         country: "USA",          countryCode: "USA", quantity: 0, position: "Goalkeeper" },
  // Japan
  { id: "56", code: "JPN-01", playerName: "Takumi Minamino",     country: "Japan",        countryCode: "JPN", quantity: 1, position: "Forward"    },
  { id: "57", code: "JPN-02", playerName: "Daichi Kamada",       country: "Japan",        countryCode: "JPN", quantity: 0, position: "Midfielder" },
  { id: "58", code: "JPN-03", playerName: "Wataru Endo",         country: "Japan",        countryCode: "JPN", quantity: 2, position: "Midfielder" },
  { id: "59", code: "JPN-04", playerName: "Hiroki Sakai",        country: "Japan",        countryCode: "JPN", quantity: 1, position: "Defender"   },
  { id: "60", code: "JPN-05", playerName: "Shuichi Gonda",       country: "Japan",        countryCode: "JPN", quantity: 0, position: "Goalkeeper" },
];

export const countryFlags: Record<string, string> = {
  ARG: "🇦🇷", BRA: "🇧🇷", FRA: "🇫🇷", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", GER: "🇩🇪",
  ESP: "🇪🇸", POR: "🇵🇹", NED: "🇳🇱", ITA: "🇮🇹", MAR: "🇲🇦",
  USA: "🇺🇸", JPN: "🇯🇵",
};

export const countryColors: Record<string, { bg: string; text: string }> = {
  ARG: { bg: "bg-sky-100",    text: "text-sky-800"    },
  BRA: { bg: "bg-yellow-100", text: "text-yellow-800" },
  FRA: { bg: "bg-blue-100",   text: "text-blue-800"   },
  ENG: { bg: "bg-red-100",    text: "text-red-800"    },
  GER: { bg: "bg-gray-100",   text: "text-gray-800"   },
  ESP: { bg: "bg-orange-100", text: "text-orange-800" },
  POR: { bg: "bg-green-100",  text: "text-green-800"  },
  NED: { bg: "bg-orange-100", text: "text-orange-700" },
  ITA: { bg: "bg-indigo-100", text: "text-indigo-800" },
  MAR: { bg: "bg-red-100",    text: "text-red-700"    },
  USA: { bg: "bg-blue-100",   text: "text-blue-700"   },
  JPN: { bg: "bg-red-100",    text: "text-red-700"    },
};

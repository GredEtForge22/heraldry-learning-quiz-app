export type GlossaryGroup = "emaux" | "ecu" | "partitions" | "pieces" | "meubles" | "general";

export const GROUP_LABELS: Record<GlossaryGroup, string> = {
  emaux: "Émaux",
  ecu: "L'écu",
  partitions: "Partitions & motifs",
  pieces: "Pièces honorables",
  meubles: "Meubles & attitudes",
  general: "Notions générales",
};

export interface GlossaryEntry {
  term: string;
  def: string;
  group: GlossaryGroup;
}

export const GLOSSARY: GlossaryEntry[] = [
  // émaux
  { term: "Or", def: "Le métal jaune, représenté par du jaune ou de l'or.", group: "emaux" },
  { term: "Argent", def: "Le métal blanc, représenté par du blanc ou de l'argent.", group: "emaux" },
  { term: "Azur", def: "L'émail bleu.", group: "emaux" },
  { term: "Gueules", def: "L'émail rouge.", group: "emaux" },
  { term: "Sable", def: "L'émail noir.", group: "emaux" },
  { term: "Sinople", def: "L'émail vert.", group: "emaux" },
  { term: "Pourpre", def: "L'émail violet, rare en héraldique.", group: "emaux" },
  { term: "Hermine", def: "Une fourrure : champ blanc moucheté de petites queues noires.", group: "emaux" },
  { term: "Vair", def: "Une fourrure : rangées de petites cloches alternativement bleues et blanches.", group: "emaux" },
  { term: "Règle de contrariété", def: "Principe selon lequel on ne pose pas métal sur métal, ni couleur sur couleur.", group: "emaux" },
  // écu
  { term: "Champ", def: "La surface de l'écu, le fond sur lequel on place pièces et meubles.", group: "ecu" },
  { term: "Dextre", def: "Le côté droit du porteur de l'écu, qui est à gauche pour celui qui le regarde.", group: "ecu" },
  { term: "Senestre", def: "Le côté gauche du porteur de l'écu, qui est à droite pour celui qui le regarde.", group: "ecu" },
  { term: "Chef", def: "La partie haute de l'écu (ou la pièce qui l'occupe).", group: "ecu" },
  { term: "Pointe", def: "La partie basse de l'écu.", group: "ecu" },
  { term: "Abîme (ou cœur)", def: "Le centre de l'écu.", group: "ecu" },
  { term: "Écu", def: "Le bouclier sur lequel on porte les armoiries.", group: "ecu" },
  // partitions
  { term: "Parti", def: "Écu divisé en deux par une ligne verticale.", group: "partitions" },
  { term: "Coupé", def: "Écu divisé en deux par une ligne horizontale.", group: "partitions" },
  { term: "Tranché", def: "Écu divisé en deux par une diagonale allant du chef dextre à la pointe senestre.", group: "partitions" },
  { term: "Taillé", def: "Écu divisé en deux par une diagonale allant du chef senestre à la pointe dextre.", group: "partitions" },
  { term: "Écartelé", def: "Écu divisé en quatre quartiers par une croix de lignes (parti et coupé).", group: "partitions" },
  { term: "Fascé / Burelé", def: "Écu divisé en bandes horizontales alternées (fascé : pièces larges, burelé : plus de dix).", group: "partitions" },
  { term: "Palé", def: "Écu divisé en bandes verticales alternées.", group: "partitions" },
  { term: "Bandé", def: "Écu divisé en bandes diagonales alternées, du chef dextre à la pointe senestre.", group: "partitions" },
  { term: "Échiqueté", def: "Écu couvert de carrés alternés, comme un échiquier.", group: "partitions" },
  { term: "Fuselé / Losangé", def: "Écu couvert de losanges juxtaposés de deux émaux.", group: "partitions" },
  { term: "Semé", def: "Champ couvert de petits meubles répétés, tronqués par les bords.", group: "partitions" },
  // pièces
  { term: "Croix", def: "Pièce formée d'une bande verticale et d'une bande horizontale qui se croisent au centre et touchent les bords.", group: "pieces" },
  { term: "Sautoir", def: "Pièce en forme de X, formée par la réunion d'une bande et d'une barre.", group: "pieces" },
  { term: "Fasce", def: "Bande horizontale occupant le tiers central de l'écu.", group: "pieces" },
  { term: "Pal", def: "Bande verticale occupant le tiers central de l'écu.", group: "pieces" },
  { term: "Bande", def: "Pièce diagonale qui va du chef dextre à la pointe senestre.", group: "pieces" },
  { term: "Chevron", def: "Pièce formée de deux bandes en V renversé, comme un toit.", group: "pieces" },
  { term: "Bordure", def: "Pièce qui borde l'écu sur tout son pourtour.", group: "pieces" },
  { term: "Canton", def: "Petit carré placé dans un angle de l'écu, le plus souvent au chef dextre.", group: "pieces" },
  { term: "Franc-quartier", def: "Un canton plus grand, qui occupe le quart de l'écu.", group: "pieces" },
  { term: "Lambel", def: "Pièce en chef munie de pendants, qui signale le fils aîné de la maison, sur les armes du père.", group: "pieces" },
  { term: "Trescheur", def: "Filet étroit qui suit le bord de l'écu, souvent doublé (armes d'Écosse).", group: "pieces" },
  // meubles
  { term: "Rampant", def: "Se dit d'un animal dressé sur ses pattes de derrière, comme le lion typique.", group: "meubles" },
  { term: "Passant", def: "Se dit d'un animal qui marche, une patte avant levée.", group: "meubles" },
  { term: "Léopardé", def: "Se dit d'un lion passant dont la tête est de face (comme les « léopards » d'Angleterre).", group: "meubles" },
  { term: "Éployé", def: "Se dit d'un aigle aux ailes déployées de chaque côté.", group: "meubles" },
  { term: "Armé", def: "Se dit d'un animal dont les griffes (ou les dents) sont d'un autre émail.", group: "meubles" },
  { term: "Lampassé", def: "Se dit d'un animal dont la langue est d'un autre émail.", group: "meubles" },
  { term: "Becqué", def: "Se dit d'un oiseau dont le bec est d'un autre émail que le corps.", group: "meubles" },
  { term: "Alérion", def: "Petit aigle représenté sans bec ni pattes, ailes déployées.", group: "meubles" },
  { term: "Tourteau", def: "Disque de couleur (par opposition au besant, disque de métal).", group: "meubles" },
  { term: "Besant", def: "Disque de métal (or ou argent), souvenir de la monnaie byzantine.", group: "meubles" },
  { term: "Macle", def: "Losange évidé, qui laisse voir le champ à travers.", group: "meubles" },
  { term: "Billette", def: "Petit rectangle posé verticalement.", group: "meubles" },
  { term: "Nef", def: "Un navire, comme celui des armes de Paris.", group: "meubles" },
  // général
  { term: "Blasonner", def: "Décrire des armoiries avec le vocabulaire et l'ordre de l'héraldique.", group: "general" },
  { term: "Armes parlantes", def: "Armoiries qui évoquent par un jeu de mots le nom de leur titulaire.", group: "general" },
  { term: "Armes à enquérir", def: "Armoiries qui enfreignent volontairement la règle de contrariété, pour inciter à s'informer.", group: "general" },
  { term: "Brisure", def: "Modification apportée aux armes de la famille pour distinguer un cadet.", group: "general" },
  { term: "Héraut d'armes", def: "Officier chargé des cérémonies, des tournois et de la connaissance des armoiries.", group: "general" },
  { term: "Cimier", def: "Ornement placé au-dessus du heaume, au sommet de l'écu.", group: "general" },
  { term: "Devise", def: "Courte formule ou cri de guerre associé aux armoiries.", group: "general" },
  { term: "Armorial", def: "Recueil de blasons classés d'une région, d'une époque ou d'une famille.", group: "general" },
  { term: "Vair", def: "Fourrure formée de cloches (ou « pots ») alternativement d'azur et d'argent.", group: "emaux" },
  { term: "Contre-hermine", def: "Inverse de l'hermine : champ de sable moucheté d'argent.", group: "emaux" },
  { term: "Cotice", def: "Bande très étroite, souvent doublant une bande principale.", group: "pieces" },
  { term: "Pairle", def: "Pièce en forme de Y, qui joint le chef aux deux flancs.", group: "pieces" },
  { term: "Componé", def: "Se dit d'une pièce (surtout bordure) divisée en segments alternés de deux émaux.", group: "pieces" },
  { term: "Engrêlé", def: "Bordure ou pièce dont le contour est découpé en petites dents arrondies vers l'extérieur.", group: "pieces" },
  { term: "Brochant", def: "Posé par-dessus les autres éléments de l'écu.", group: "general" },
  { term: "Cousu", def: "Se dit d'un chef (ou autre) de couleur sur couleur, toléré par fiction héraldique.", group: "general" },
  { term: "Coquille", def: "Coquille Saint-Jacques, meuble des pèlerins.", group: "meubles" },
  { term: "Harpe", def: "Instrument à cordes, meuble des armes d'Irlande.", group: "meubles" },
  { term: "Rose", def: "Fleur héraldique à cinq pétales, célèbre chez Lancastre et York.", group: "meubles" },
  { term: "Ours", def: "Plantigrade rampant, armes parlantes de Berne.", group: "meubles" },
];

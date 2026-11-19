import type { Charge, FieldSpec, Ordinary, ShieldSpec, Tincture } from "./types";

const P = (t: Tincture): FieldSpec => ({ k: "plain", t });
const sh = (field: FieldSpec, ordinaries?: Ordinary[], charges?: Charge[]): ShieldSpec => ({
  field,
  ordinaries,
  charges,
});

export interface LessonExample {
  spec: ShieldSpec;
  label: string;
  blazon?: string;
}

export interface LessonSection {
  title: string;
  paragraphs: string[];
  examples?: LessonExample[];
  special?: "hachures" | "points" | "tinctureList";
}

export interface Lesson {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  minutes: number;
  intro: string;
  sections: LessonSection[];
  takeaways: string[];
}

const lionC = (t: Tincture): Charge => ({ type: "lion", t, at: [[50, 60]], s: 66 });

export const LESSONS: Lesson[] = [
  {
    slug: "les-emaux",
    title: "Les émaux",
    subtitle: "Métaux, couleurs et fourrures : la palette du héraut",
    icon: "🎨",
    minutes: 5,
    intro:
      "L'héraldique n'utilise pas toutes les couleurs, seulement quelques émaux, aux noms hérités du vieux français. Cette palette réduite avait un but pratique : un blason doit se reconnaître de loin, sur un champ de bataille ou un tournoi.",
    sections: [
      {
        title: "Deux métaux, cinq couleurs, des fourrures",
        paragraphs: [
          "Les émaux se répartissent en trois familles. Les métaux sont l'or (jaune) et l'argent (blanc). Les couleurs sont l'azur (bleu), les gueules (rouge), le sable (noir), le sinople (vert) et le pourpre (violet). Les fourrures sont l'hermine (blanche mouchetée de noir) et le vair (cloches bleues et blanches).",
          "Dans la pratique, les trois émaux les plus fréquents au Moyen Âge sont le gueules, l'azur et l'or. Le pourpre, introduit plus tard, reste très rare.",
        ],
        special: "tinctureList",
      },
      {
        title: "La règle de contrariété",
        paragraphs: [
          "Règle d'or de l'héraldique : on ne met pas métal sur métal, ni couleur sur couleur. Un lion d'or se pose sur un champ de gueules, d'azur ou de sable, jamais sur de l'argent. Cette règle garantit un contraste visible de loin.",
          "Les exceptions sont très rares, et souvent volontaires : on les appelle « armes à enquérir », car elles incitent à demander pourquoi. Les armes du royaume de Jérusalem, d'or sur argent, en sont l'exemple le plus célèbre.",
        ],
        examples: [
          { spec: sh(P("gueules"), undefined, [lionC("or")]), label: "Correct : métal sur couleur" },
          { spec: sh(P("argent"), undefined, [lionC("sable")]), label: "Correct : couleur sur métal" },
          {
            spec: sh(P("argent"), undefined, [
              { type: "crosspotent", t: "or", at: [[50, 48]], s: 54 },
              { type: "crosslet", t: "or", at: "4cantons", s: 22 },
            ]),
            label: "Exception : Jérusalem (armes à enquérir)",
          },
        ],
      },
      {
        title: "Les hachures : colorier sans couleurs",
        paragraphs: [
          "En 1638, le jésuite Silvestre Petra Sancta invente un système de hachures pour représenter les émaux en gravure noir et blanc. Il est encore utilisé dans les livres anciens et les armoriaux imprimés.",
        ],
        special: "hachures",
      },
    ],
    takeaways: [
      "Deux métaux : or et argent. Cinq couleurs : azur, gueules, sable, sinople, pourpre.",
      "Métal sur couleur, ou couleur sur métal, jamais deux de la même famille.",
      "Les fourrures (hermine, vair) sont à part et peuvent aller avec les deux.",
    ],
  },
  {
    slug: "l-ecu",
    title: "L'écu et ses points",
    subtitle: "Dextre, senestre, chef, pointe : s'orienter dans un blason",
    icon: "🛡️",
    minutes: 4,
    intro:
      "L'écu est le bouclier qui porte les armoiries. Avant de lire un blason, il faut apprendre à s'orienter, avec une règle déroutante : on décrit toujours l'écu du point de vue de celui qui le porte.",
    sections: [
      {
        title: "Dextre et senestre : le piège classique",
        paragraphs: [
          "Imaginez-vous derrière le bouclier. Votre côté droit est la dextre ; votre côté gauche est la senestre. Pour celui qui regarde le blason de face, c'est donc l'inverse : la dextre est à gauche de l'image, la senestre à droite.",
          "Le chef est la partie haute, la pointe est la partie basse, le centre s'appelle le cœur ou l'abîme.",
        ],
        special: "points",
      },
      {
        title: "Une forme qui change selon les époques",
        paragraphs: [
          "Au XIIe siècle, l'écu est triangulaire (« en amande » ou « en bouclier normand »). Puis vient l'écu « en cœur » ou « français moderne », arrondi en pointe. Ensuite la Renaissance introduit des formes ovales ou découpées. Peu importe : le blason se décrit de la même manière.",
        ],
      },
    ],
    takeaways: [
      "On décrit toujours l'écu du point de vue du porteur.",
      "Dextre = à gauche de l'image ; senestre = à droite.",
      "Chef = en haut ; pointe = en bas ; abîme = au centre.",
    ],
  },
  {
    slug: "partitions",
    title: "Partitions et motifs",
    subtitle: "Parti, coupé, tranché, taillé, écartelé… et les semés",
    icon: "✂️",
    minutes: 6,
    intro:
      "Avant de poser des figures, on peut diviser le champ. Les partitions servent à marier deux armes (par exemple lors d'une alliance), ou simplement à créer des motifs géométriques.",
    sections: [
      {
        title: "Les quatre divisions simples",
        paragraphs: [
          "Le parti est divisé par une ligne verticale, le coupé par une ligne horizontale. Le tranché est divisé par une diagonale du chef dextre vers la pointe senestre ; le taillé par la diagonale opposée. Astuce : « tranché » descend de la dextre à la senestre, comme un coup de sabre porté de droite à gauche.",
        ],
        examples: [
          { spec: sh({ k: "party", d: "pale", a: "argent", b: "sable" }), label: "Parti", blazon: "Parti d'argent et de sable" },
          { spec: sh({ k: "party", d: "fess", a: "or", b: "azur" }), label: "Coupé", blazon: "Coupé d'or et d'azur" },
          { spec: sh({ k: "party", d: "bend", a: "gueules", b: "argent" }), label: "Tranché", blazon: "Tranché de gueules et d'argent" },
          { spec: sh({ k: "party", d: "bendsin", a: "sinople", b: "or" }), label: "Taillé", blazon: "Taillé de sinople et d'or" },
        ],
      },
      {
        title: "L'écartelé",
        paragraphs: [
          "L'écartelé est divisé en quatre quartiers, numérotés dans l'ordre de lecture : 1 en haut à dextre, 2 en haut à senestre, 3 en bas à dextre, 4 en bas à senestre. C'est la façon classique de réunir les armes de plusieurs domaines : les rois d'Espagne, d'Angleterre ou de Prusse en ont fait un usage intensif.",
        ],
        examples: [
          {
            spec: {
              field: P("argent"),
              quarters: [sh(P("argent")), sh(P("sable")), sh(P("sable")), sh(P("argent"))],
            },
            label: "Hohenzollern",
            blazon: "Écartelé d'argent et de sable",
          },
        ],
      },
      {
        title: "Les champs à motifs",
        paragraphs: [
          "Quand le champ est répété en bandes, on utilise des adjectifs : fascé ou burelé (horizontal), palé (vertical), bandé (diagonal). Pour les carrés, échiqueté ; pour les losanges, losangé ou fuselé. Le nombre de pièces est précisé : « bandé d'or et d'azur de six pièces ».",
          "Le semé, enfin, est un champ couvert de petits meubles identiques, tronqués par les bords : c'est ainsi que les premiers rois capétiens portaient leurs fleurs de lys.",
        ],
        examples: [
          { spec: sh({ k: "pattern", p: "barry", a: "gueules", b: "argent", n: 8 }), label: "Fascé", blazon: "Fascé de gueules et d'argent de huit pièces" },
          { spec: sh({ k: "pattern", p: "paly", a: "or", b: "gueules", n: 9 }), label: "Palé", blazon: "Palé d'or et de gueules de neuf pièces" },
          { spec: sh({ k: "pattern", p: "bendy", a: "or", b: "azur", n: 6 }), label: "Bandé", blazon: "Bandé d'or et d'azur de six pièces" },
          { spec: sh({ k: "pattern", p: "chequy", a: "or", b: "azur", n: 6 }), label: "Échiqueté", blazon: "Échiqueté d'or et d'azur" },
          { spec: sh({ k: "pattern", p: "lozengy", a: "argent", b: "azur", n: 5 }), label: "Losangé", blazon: "Fuselé d'argent et d'azur" },
          { spec: sh(P("azur"), undefined, [{ type: "fleurdelis", t: "or", at: "semy", s: 15 }]), label: "Semé", blazon: "D'azur semé de fleurs de lys d'or" },
        ],
      },
    ],
    takeaways: [
      "Parti | vertical ; coupé — horizontal ; tranché ╲ ; taillé ╱.",
      "Écartelé = quatre quartiers numérotés 1-2 / 3-4.",
      "Fascé, palé, bandé, échiqueté, losangé : des champs à motifs.",
    ],
  },
  {
    slug: "pieces",
    title: "Les pièces honorables",
    subtitle: "Croix, bande, fasce, chevron… la charpente du blason",
    icon: "✚",
    minutes: 5,
    intro:
      "Les pièces honorables sont les grandes formes géométriques qui structurent un blason. Plus simples, plus anciennes et plus lisibles que les figures, elles dominent les armes du XIIe siècle.",
    sections: [
      {
        title: "Les pièces principales",
        paragraphs: [
          "La croix touche les quatre bords de l'écu. Le sautoir, en X, la bande, la fasce et le pal sont des bandes de largeur d'environ un tiers de l'écu, respectivement diagonale, horizontale et verticale. Le chevron forme un V renversé.",
        ],
        examples: [
          { spec: sh(P("argent"), [{ k: "cross", t: "gueules" }]), label: "Croix", blazon: "D'argent à la croix de gueules" },
          { spec: sh(P("or"), [{ k: "saltire", t: "azur" }]), label: "Sautoir", blazon: "D'or au sautoir d'azur" },
          { spec: sh(P("gueules"), [{ k: "fess", t: "argent" }]), label: "Fasce", blazon: "De gueules à la fasce d'argent" },
          { spec: sh(P("or"), [{ k: "pale", t: "sable" }]), label: "Pal", blazon: "D'or au pal de sable" },
          { spec: sh(P("azur"), [{ k: "bend", t: "or" }]), label: "Bande", blazon: "D'azur à la bande d'or" },
          { spec: sh(P("sable"), [{ k: "chevron", t: "argent" }]), label: "Chevron", blazon: "De sable au chevron d'argent" },
        ],
      },
      {
        title: "Les pièces de bord",
        paragraphs: [
          "Le chef occupe la partie haute de l'écu. La bordure en fait le tour, le canton s'installe dans un angle (et devient franc-quartier s'il est plus grand). Le lambel, enfin, est la marque du fils aîné et se pose au chef.",
          "On en fait souvent des brisures : le duc d'Anjou, cadet de la maison de France, ajoute une bordure de gueules aux armes de son aîné.",
        ],
        examples: [
          { spec: sh(P("azur"), [{ k: "chief", t: "or" }]), label: "Chef", blazon: "D'azur au chef d'or" },
          { spec: sh(P("argent"), [{ k: "bordure", t: "sable" }]), label: "Bordure", blazon: "D'argent à la bordure de sable" },
          { spec: sh(P("sinople"), [{ k: "canton", t: "or" }]), label: "Canton", blazon: "De sinople au canton d'or" },
          {
            spec: sh(P("azur"), [{ k: "label", t: "argent" }], [
              { type: "fleurdelis", t: "or", at: [[28, 52], [72, 52], [50, 92]], s: 36 },
            ]),
            label: "Lambel",
            blazon: "D'azur à trois fleurs de lys d'or, au lambel d'argent",
          },
        ],
      },
    ],
    takeaways: [
      "Croix, sautoir, fasce, pal, bande, chevron : les pièces principales.",
      "Chef, bordure, canton, lambel : les pièces de bord.",
      "La bande va de la dextre du chef vers la senestre de la pointe.",
    ],
  },
  {
    slug: "meubles",
    title: "Les meubles et leurs attitudes",
    subtitle: "Lions, aigles, fleurs de lys : le bestiaire héraldique",
    icon: "🦁",
    minutes: 6,
    intro:
      "Les meubles sont toutes les figures posées sur le champ : animaux, plantes, objets, formes géométriques. Ils sont décrits avec leur attitude (rampant, passant) et leurs détails (armé, lampassé, couronné).",
    sections: [
      {
        title: "Le lion, roi du bestiaire",
        paragraphs: [
          "Le lion rampant est dressé sur ses pattes arrière, la gueule ouverte, la queue relevée. Il symbolise la force et le courage. Le lion léopardé, de profil mais avec la tête de face, marche : c'est celui d'Angleterre et de Normandie. Un lion « armé » a les griffes d'un autre émail, « lampassé » signifie que sa langue est d'un autre émail.",
        ],
        examples: [
          { spec: sh(P("or"), undefined, [lionC("sable")]), label: "Lion rampant", blazon: "D'or au lion de sable" },
          { spec: sh(P("gueules"), undefined, [{ type: "leopard", t: "or", at: "2pal", s: 46 }]), label: "Lions léopardés", blazon: "De gueules à deux léopards d'or" },
        ],
      },
      {
        title: "L'aigle et les oiseaux",
        paragraphs: [
          "L'aigle est « éployé » quand il étend ses ailes ; il est le symbole de l'Empire. À deux têtes, c'est l'aigle bicéphale. Les alérions sont de petits aigles sans bec ni pattes, que l'on trouve en nombre dans les armes de Lorraine ou de Montmorency.",
        ],
        examples: [
          { spec: sh(P("gueules"), undefined, [{ type: "eagle", t: "argent", at: [[50, 56]], s: 72 }]), label: "Aigle éployé", blazon: "De gueules à l'aigle d'argent" },
          { spec: sh(P("or"), undefined, [{ type: "eagle2", t: "sable", at: [[50, 58]], s: 74 }]), label: "Aigle bicéphale", blazon: "D'or à l'aigle bicéphale de sable" },
          {
            spec: sh(P("or"), [{ k: "bend", t: "gueules" }], [{ type: "alerion", t: "argent", at: [[28, 32], [50, 58], [72, 84]], s: 24 }]),
            label: "Alérions",
            blazon: "D'or à la bande de gueules chargée de trois alérions d'argent",
          },
        ],
      },
      {
        title: "Fleurs, disques et autres figures",
        paragraphs: [
          "La fleur de lys est l'emblème de la monarchie française. Le tourteau est un disque de couleur, le besant un disque de métal. La macle est un losange évidé, la billette un petit rectangle. Le croissant, l'étoile ou la couronne complètent un répertoire quasi infini.",
          "Les armes parlantes évoquent le nom du porteur : Castille porte un château, Dauphiné un dauphin.",
        ],
        examples: [
          { spec: sh(P("azur"), undefined, [{ type: "fleurdelis", t: "or", at: "2-1" }]), label: "Fleurs de lys", blazon: "D'azur à trois fleurs de lys d'or" },
          { spec: sh(P("or"), undefined, [{ type: "roundel", t: "gueules", at: "2-1", s: 34 }]), label: "Tourteaux", blazon: "D'or à trois tourteaux de gueules" },
          { spec: sh(P("gueules"), undefined, [{ type: "mascle", t: "or", at: "3x3", s: 25 }]), label: "Macles", blazon: "De gueules à neuf macles d'or" },
          { spec: sh(P("gueules"), undefined, [{ type: "castle", t: "or", at: [[50, 54]], s: 68 }]), label: "Armes parlantes", blazon: "De gueules au château d'or (Castille)" },
        ],
      },
    ],
    takeaways: [
      "Rampant = debout ; passant = en marche ; éployé = ailes déployées.",
      "Armé, lampassé, becqué : on précise l'émail des griffes, de la langue, du bec.",
      "Tourteau = disque de couleur ; besant = disque de métal.",
    ],
  },
  {
    slug: "blasonner",
    title: "Lire et écrire un blasonnement",
    subtitle: "Du dessin au texte : la grammaire du blason",
    icon: "📜",
    minutes: 6,
    intro:
      "Blasonner, c'est décrire un blason avec des mots, de façon assez précise pour qu'un héraut puisse le dessiner sans l'avoir vu. La phrase obéit à un ordre rigoureux, toujours le même.",
    sections: [
      {
        title: "L'ordre de la phrase",
        paragraphs: [
          "On commence par le champ (« d'azur »), puis la pièce principale (« à la bande d'or »), puis les meubles du champ, enfin les détails et les ajouts (bordure, chef, brisure). On ne répète jamais un émail : si une pièce a le même émail qu'une autre, on dit « du même ».",
          "Les nombres s'écrivent en toutes lettres, et on indique la disposition quand elle n'est pas évidente : « deux et un » signifie deux meubles en chef et un en pointe.",
        ],
        examples: [
          {
            spec: sh(P("azur"), undefined, [{ type: "fleurdelis", t: "or", at: "2-1" }]),
            label: "France moderne",
            blazon: "D'azur à trois fleurs de lys d'or, deux et une",
          },
        ],
      },
      {
        title: "Un exemple pas à pas",
        paragraphs: [
          "Prenons l'écu de Lyon. Le champ est rouge : « De gueules ». Le meuble principal est un lion blanc : « au lion d'argent ». Le haut de l'écu est une bande bleue : « au chef d'azur ». Dessus, trois fleurs de lys jaunes : « chargé de trois fleurs de lys d'or ».",
          "Au total : « De gueules au lion d'argent, au chef d'azur chargé de trois fleurs de lys d'or. »",
        ],
        examples: [
          {
            spec: sh(
              P("gueules"),
              [{ k: "chief", t: "azur", w: 28 }],
              [
                { type: "lion", t: "argent", at: [[50, 70]], s: 56 },
                { type: "fleurdelis", t: "or", at: [[24, 15], [50, 15], [76, 15]], s: 20 },
              ],
            ),
            label: "Lyon",
            blazon: "De gueules au lion d'argent, au chef d'azur chargé de trois fleurs de lys d'or",
          },
        ],
      },
      {
        title: "Quelques conventions utiles",
        paragraphs: [
          "Le sens se lit en regardant depuis le porteur : un lion tourné vers la dextre regarde donc vers la gauche du dessin. Un animal sans précision est supposé rampant ou passant, tourné à dextre. Un « brochant sur le tout » est une pièce posée sur toutes les autres, comme la bande de gueules de Bourbon ou de Du Guesclin.",
        ],
      },
    ],
    takeaways: [
      "Ordre : champ → pièce principale → meubles → détails et brisures.",
      "On n'écrit jamais deux fois le même émail : on dit « du même ».",
      "« Brochant » = posé par-dessus les autres éléments.",
    ],
  },
  {
    slug: "histoire",
    title: "Histoire et usages",
    subtitle: "Des champs de bataille aux boulangeries",
    icon: "🏰",
    minutes: 5,
    intro:
      "Les armoiries apparaissent en Europe occidentale vers 1120-1150. Les chevaliers, entièrement casqués, avaient besoin d'un signe pour se reconnaître au combat et dans les tournois.",
    sections: [
      {
        title: "D'un signe de reconnaissance à un emblème de famille",
        paragraphs: [
          "Au début, les armes sont personnelles. Mais dès la deuxième génération, elles deviennent héréditaires : le fils reprend le blason de son père. Elles se répandent chez les nobles, puis dans le clergé, les villes, les corporations, et même les bourgeois et les paysans aisés.",
          "Les croisades (1096-1291) contribuent à fixer les codes : des chevaliers de toute l'Europe s'y côtoient et comparent leurs signes.",
        ],
      },
      {
        title: "Les hérauts d'armes",
        paragraphs: [
          "Les hérauts d'armes, chargés de proclamer les tournois, deviennent les spécialistes de la reconnaissance des armoiries. Ils créent le vocabulaire (mélange de vieux français et de normand) et rédigent les premiers armoriaux, comme le Rôle de Zurich (vers 1340) ou celui de Gelre (vers 1380).",
        ],
      },
      {
        title: "Brisures, alliances et armes parlantes",
        paragraphs: [
          "Pour distinguer les membres d'une même famille, on ajoute une brisure : lambel, bordure, bâton. Les alliances donnent des armes parties ou écartelées. Les armes parlantes jouent sur le nom : Castille (château), Lorraine (les alérions, dont le nom évoque celui de la Lorraine).",
          "Aujourd'hui encore, les villes, régions, entreprises, clubs de football et même les États fédérés conservent des blasons directement issus de cette tradition médiévale.",
        ],
        examples: [
          {
            spec: sh(P("azur"), [{ k: "bordure", t: "gueules" }], [{ type: "fleurdelis", t: "or", at: "semy", s: 15, under: true }]),
            label: "Anjou : France brisée d'une bordure",
            blazon: "D'azur semé de fleurs de lys d'or, à la bordure de gueules",
          },
        ],
      },
    ],
    takeaways: [
      "Les armoiries naissent vers 1120-1150, sur les champs de bataille.",
      "Elles deviennent vite héréditaires, puis s'étendent à toute la société.",
      "Hérauts, armoriaux et brisures structurent le système.",
    ],
  },
];

export const LESSON_BY_SLUG: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.slug, l]));

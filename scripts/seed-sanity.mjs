import { createClient } from "@sanity/client";
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { color, loadLocalEnv, printBlockingSeedEnvironmentError, validateSeedEnvironment } from "./seed-env.mjs";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const seedDir = join(rootDir, "sanity", "seed");
const dataDir = join(seedDir, "data");
const mediaDir = join(seedDir, "media");
const generatedDir = join(seedDir, "generated");
const DEFAULT_PET_COUNT = 50;
const args = parseArgs(process.argv.slice(2));
const isConfirmed = args.flags.has("confirm");
const isPreview = args.flags.has("preview");
const shouldPurge = args.flags.has("purge");
const isPurgeOnly = args.flags.has("purge-only");
const shouldSkipMediaUpload = args.flags.has("skip-media-upload");
const petCount = parsePetCount(args.values.get("pet-count") ?? args.values.get("pets"));
const mediaScope = parseMediaScope(args.values.get("media-scope"));
const onlyTarget = parseOnlyTarget(args.values.get("only") ?? args.values.get("only-page"));
const documentMutationChunkSize = 25;
const deleteMutationChunkSize = 50;
const listingPlans = [
  { value: "porch", label: "Porch Listing", basePayout: 20 },
  { value: "spotlight", label: "Neighbourhood Spotlight", basePayout: 28 },
  { value: "couchRecovery", label: "Couch Recovery Campaign", basePayout: 38 }
];
const payoutUnits = ["day", "day", "day", "stay", "weekend"];

loadLocalEnv(rootDir);

let sanityClient;

const keyCounters = new Map();

const petTypeCategories = {
  commonHouseholdPets: [
    ["petType-dog", "Dog", "Dogs", "dog", "Loyal, loud, and legally considered furniture damage with feelings."],
    ["petType-cat", "Cat", "Cats", "cat", "A compact roommate with sharp opinions about your furniture and schedule."],
    ["petType-rabbit", "Rabbit", "Rabbits", "rabbit", "Compact, judgmental, and faster than your lease agreement."],
    ["petType-ferret", "Ferret", "Ferrets", "rat", "A sock-shaped investigator with flexible morals."],
    ["petType-guinea-pig", "Guinea Pig", "Guinea pigs", "circle", "Small, squeaky, and somehow already disappointed in the produce."],
    ["petType-hamster", "Hamster", "Hamsters", "circle", "Tiny night-shift tenant with impressive wheel mileage."],
    ["petType-gerbil", "Gerbil", "Gerbils", "circle", "Small tunnel architect with excellent meeting avoidance."],
    ["petType-mouse", "Mouse", "Mice", "mouse", "Pocket-sized roommate with strong opinions about corners."],
    ["petType-rat", "Rat", "Rats", "rat", "Smart, snack-aware, and already testing the latch."],
    ["petType-chinchilla", "Chinchilla", "Chinchillas", "cloud", "Soft, fast, and dust-bath adjacent."],
    ["petType-hedgehog", "Hedgehog", "Hedgehogs", "badge", "Portable footnote with tiny opinions."]
  ],
  birds: [
    ["petType-parrot", "Parrot", "Parrots", "bird", "A colorful witness who remembers exactly what you said."],
    ["petType-cockatiel", "Cockatiel", "Cockatiels", "bird", "A tiny whistling roommate with dramatic hair."],
    ["petType-budgie", "Budgie", "Budgies", "bird", "Small feathered broadcaster with a busy calendar."],
    ["petType-canary", "Canary", "Canaries", "music", "A tiny vocalist with strict lighting preferences."],
    ["petType-finch", "Finch", "Finches", "bird", "Fast, social, and built for tiny committee work."],
    ["petType-lovebird", "Lovebird", "Lovebirds", "heart", "Compact relationship expert with a beak."],
    ["petType-dove", "Dove", "Doves", "bird", "Soft-spoken peace ambassador with seed requirements."],
    ["petType-chicken", "Chicken", "Chickens", "egg", "Backyard supervisor and breakfast-adjacent consultant."],
    ["petType-duck", "Duck", "Ducks", "waves", "Waterproof comedian with strong puddle instincts."]
  ],
  aquaticPets: [
    ["petType-goldfish", "Goldfish", "Goldfish", "fish", "Low-cuddle, high-judgment, excellent at staring."],
    ["petType-betta", "Betta Fish", "Betta fish", "fish", "A desk monarch with very specific lighting needs."],
    ["petType-guppy", "Guppy", "Guppies", "fish", "Tiny color burst with group-chat energy."],
    ["petType-tetra", "Tetra", "Tetras", "fish", "Small schooling fish with synchronized errands."],
    ["petType-koi", "Koi", "Koi", "fish", "Outdoor pond aristocrat with graceful snack timing."],
    ["petType-angelfish", "Angelfish", "Angelfish", "fish", "Elegant tank resident with architectural fins."],
    ["petType-shrimp", "Freshwater Shrimp", "Freshwater shrimp", "waves", "Tiny cleanup crew with surprising stage presence."],
    ["petType-snail", "Aquatic Snail", "Aquatic snails", "shell", "Slow glass inspector and algae minimalist."]
  ],
  reptilesAndAmphibians: [
    ["petType-lizard", "Lizard", "Lizards", "bean", "A tiny landlord for warm rocks."],
    ["petType-snake", "Snake", "Snakes", "worm", "Quiet, elegant, and fully committed to the draft under the door."],
    ["petType-turtle", "Turtle", "Turtles", "circle", "Slow-moving proof that boundaries can have architecture."],
    ["petType-frog", "Frog", "Frogs", "badge", "A damp philosopher with excellent spring mechanics."],
    ["petType-tortoise", "Tortoise", "Tortoises", "circle", "Land-based patience with shell-backed authority."],
    ["petType-gecko", "Gecko", "Geckos", "bean", "Wall-adjacent charm with sticky credentials."],
    ["petType-chameleon", "Chameleon", "Chameleons", "eye", "Color-shifting branch manager."],
    ["petType-iguana", "Iguana", "Iguanas", "leaf", "Leafy lounge expert with a dramatic profile."],
    ["petType-axolotl", "Axolotl", "Axolotls", "waves", "Smiling aquatic mystery with external gills."],
    ["petType-salamander", "Salamander", "Salamanders", "flame", "Moist woodland diplomat with quiet charisma."],
    ["petType-newt", "Newt", "Newts", "droplets", "Tiny amphibious negotiator."]
  ],
  farmAndOutdoorCompanions: [
    ["petType-goat", "Goat", "Goats", "mountain", "A landscaping consultant with no respect for paperwork."],
    ["petType-pig", "Pig", "Pigs", "badge", "Brilliant, snack-aware, and suspiciously good at doors."],
    ["petType-mini-horse", "Mini Horse", "Mini horses", "horse", "A compact executive with full-sized opinions."],
    ["petType-pony", "Pony", "Ponies", "horse", "Small equine with large scheduling needs."],
    ["petType-donkey", "Donkey", "Donkeys", "badge", "Thoughtful outdoor companion with excellent boundary work."],
    ["petType-alpaca", "Alpaca", "Alpacas", "mountain", "Fluffy outdoor aristocrat with a suspicious neck advantage."],
    ["petType-sheep", "Sheep", "Sheep", "cloud", "Woolly lawn presence with soft committee energy."],
    ["petType-rabbit-outdoor", "Outdoor Rabbit", "Outdoor rabbits", "rabbit", "Garden-adjacent rabbit with extra paperwork."]
  ],
  invertebrates: [
    ["petType-tarantula", "Tarantula", "Tarantulas", "bug", "Eight legs, zero rent, surprisingly calm about your panic."],
    ["petType-hermit-crab", "Hermit Crab", "Hermit crabs", "shell", "A tiny vacationer who brings the apartment."],
    ["petType-scorpion", "Scorpion", "Scorpions", "bug", "Desert-adjacent roommate with a strict no-cuddles policy."],
    ["petType-millipede", "Millipede", "Millipedes", "bug", "Many legs, low drama, slow commute."],
    ["petType-praying-mantis", "Praying Mantis", "Praying mantises", "bug", "Tiny philosopher with excellent posture."],
    ["petType-land-snail", "Land Snail", "Land snails", "shell", "Slow terrarium resident with quiet executive presence."]
  ]
};

const ownerSeeds = [
  {
    seedKey: "owner-brother-maynard",
    name: "Brother Maynard",
    tagline: "Caretaker of small problems with large warning labels.",
    location: "Hamilton, ON",
    memberSince: "2020-04-18"
  },
  {
    seedKey: "owner-dana-muffins",
    name: "Dana Muffins",
    tagline: "Professional lint roller user and part-time couch negotiator.",
    location: "Kitchener, ON",
    memberSince: "2021-09-07"
  },
  {
    seedKey: "owner-gale-sprocket",
    name: "Gale Sprocket",
    tagline: "Keeps emergency towels in alphabetical order.",
    location: "Kingston, ON",
    memberSince: "2019-11-23"
  },
  {
    seedKey: "owner-vincent-biscuit",
    name: "Vincent Biscuit",
    tagline: "Believes every pet deserves a monogrammed apology note.",
    location: "Guelph, ON",
    memberSince: "2022-02-14"
  },
  {
    seedKey: "owner-marta-loop",
    name: "Marta Loop",
    tagline: "Weekend sitter, weekday incident archivist.",
    location: "London, ON",
    memberSince: "2018-07-30"
  },
  {
    seedKey: "owner-cedric-pail",
    name: "Cedric Pail",
    tagline: "Outdoor companion specialist and retired fence negotiator.",
    location: "Niagara-on-the-Lake, ON",
    memberSince: "2020-12-05"
  },
  {
    seedKey: "owner-nora-switch",
    name: "Nora Switch",
    tagline: "Maintains a strict lights-out policy nobody respects.",
    location: "Ottawa, ON",
    memberSince: "2023-03-19"
  },
  {
    seedKey: "owner-oscar-tangle",
    name: "Oscar Tangle",
    tagline: "Collector of leashes, forms, and improbable excuses.",
    location: "Brampton, ON",
    memberSince: "2021-06-12"
  },
  {
    seedKey: "owner-priya-socks",
    name: "Priya Socks",
    tagline: "Can identify a missing sock by emotional residue.",
    location: "Mississauga, ON",
    memberSince: "2019-05-26"
  },
  {
    seedKey: "owner-hugo-moss",
    name: "Hugo Moss",
    tagline: "Rock warmer, terrarium whisperer, occasional witness.",
    location: "Burlington, ON",
    memberSince: "2022-10-03"
  },
  {
    seedKey: "owner-tessa-quill",
    name: "Tessa Quill",
    tagline: "Bird-adjacent composer of apology jingles.",
    location: "Toronto, ON",
    memberSince: "2020-01-09"
  },
  {
    seedKey: "owner-lenora-crumb",
    name: "Lenora Crumb",
    tagline: "Snack diplomat and tiny contract enthusiast.",
    location: "Waterloo, ON",
    memberSince: "2023-08-22"
  }
];

const ownersBySeedKey = new Map(ownerSeeds.map((ownerSeed) => [ownerSeed.seedKey, ownerSeed]));

const petNameSeeds = [
  ["pet-sir-nibbles", "Sir Nibbles", "petType-rabbit", "owner-brother-maynard", "Small rabbit. Large waiver.", "regal", "withinSevenDays", "consentRequired", 2.5, 4.5, 3],
  ["pet-muffin", "Muffin", "petType-dog", "owner-dana-muffins", "Recently washed. Emotionally available.", "friendly", "anytime", "openEnrollment", 3.5, 3, 4],
  ["pet-pip-after-midnight", "Pip After Midnight", "petType-cat", "owner-dana-muffins", "Cute. Rule-bound. Do not improvise.", "suspicious", "appointmentOnly", "consentRequired", 2, 5, 2.5],
  ["pet-professor-waffles", "Professor Waffles", "petType-cat", "owner-gale-sprocket", "Accepts tenure, rejects boundaries.", "independent", "appointmentOnly", "lookDoNotCuddle", 2, 3.5, 2],
  ["pet-captain-toast", "Captain Toast", "petType-dog", "owner-vincent-biscuit", "Brave until the vacuum enters.", "dramatic", "withinSevenDays", "openEnrollment", 3, 4, 4.5],
  ["pet-lady-snoot", "Lady Snoot", "petType-mini-horse", "owner-cedric-pail", "A formal pony with meeting notes.", "regal", "appointmentOnly", "consentRequired", 2.5, 3, 3],
  ["pet-beans-of-doom", "Beans of Doom", "petType-ferret", "owner-priya-socks", "Long body. Short attention span.", "suspicious", "immediately", "afterSnacksOnly", 4, 4.5, 5],
  ["pet-gary-the-witness", "Gary the Witness", "petType-parrot", "owner-tessa-quill", "Repeats only inconvenient truths.", "dramatic", "withinSevenDays", "lookDoNotCuddle", 2, 4, 3],
  ["pet-madame-bubbles", "Madame Bubbles", "petType-goldfish", "owner-marta-loop", "Low maintenance, high eye contact.", "independent", "anytime", "lookDoNotCuddle", 0.5, 1, 1],
  ["pet-sir-rockington", "Sir Rockington", "petType-lizard", "owner-hugo-moss", "Requires one warm rock and several compliments.", "regal", "appointmentOnly", "lookDoNotCuddle", 1, 2, 2],
  ["pet-pickle-patrol", "Pickle Patrol", "petType-guinea-pig", "owner-lenora-crumb", "Squeaks like a tiny municipal alert.", "friendly", "withinSevenDays", "afterSnacksOnly", 2, 3, 3],
  ["pet-dame-flapjack", "Dame Flapjack", "petType-cockatiel", "owner-tessa-quill", "Whistles jingles nobody commissioned.", "friendly", "anytime", "consentRequired", 1.5, 3, 3.5],
  ["pet-noodle", "Noodle", "petType-snake", "owner-hugo-moss", "Elegant draft inspector, zero small talk.", "independent", "appointmentOnly", "lookDoNotCuddle", 1, 2.5, 1.5],
  ["pet-turnip", "Turnip", "petType-goat", "owner-cedric-pail", "Will audit your landscaping.", "dramatic", "immediately", "consentRequired", 4.5, 4, 4],
  ["pet-baron-von-oink", "Baron von Oink", "petType-pig", "owner-oscar-tangle", "A snack strategist with door opinions.", "regal", "withinSevenDays", "afterSnacksOnly", 3, 3.5, 3],
  ["pet-miss-shellby", "Miss Shellby", "petType-turtle", "owner-nora-switch", "Carries home, schedule, and judgment.", "independent", "anytime", "lookDoNotCuddle", 1, 1.5, 1],
  ["pet-jumpin-jolene", "Jumpin Jolene", "petType-frog", "owner-marta-loop", "Small spring-loaded weather report.", "friendly", "appointmentOnly", "lookDoNotCuddle", 1.5, 3, 3],
  ["pet-velvet-accounting", "Velvet Accounting", "petType-tarantula", "owner-gale-sprocket", "Eight legs, impeccable bookkeeping.", "suspicious", "appointmentOnly", "lookDoNotCuddle", 1, 2, 1],
  ["pet-mr-suitcase", "Mr. Suitcase", "petType-hermit-crab", "owner-nora-switch", "Brings his own room to every appointment.", "independent", "anytime", "lookDoNotCuddle", 1, 1.5, 1],
  ["pet-prince-ripple", "Prince Ripple", "petType-betta", "owner-lenora-crumb", "Desk monarch, bubble architect.", "regal", "withinSevenDays", "lookDoNotCuddle", 0.5, 1.5, 1]
];

const generatedPetNames = [
  "Tiny Pudding",
  "Major Buttons",
  "Deputy Crouton",
  "Agent Wiggle",
  "Doctor Pickles",
  "Count Soup",
  "Princess Pancake",
  "Mister Velcro",
  "Captain Noodle",
  "Grandma Mittens",
  "Baron Biscuit",
  "Duchess Sprinkle",
  "Inspector Waffles",
  "Professor Loaf",
  "Coach Tater",
  "Marmalade Jones",
  "Pickle Von Zoom",
  "Lady Breadcrumb",
  "Sir Snackwell",
  "Marshal Pipsqueak",
  "Clementine Fog",
  "Beanie McDoorbell",
  "Toast Malone",
  "Juniper Sniff",
  "Warden Flop",
  "Mochi Thunder",
  "Pancetta Whistle",
  "Biscuit Taxform",
  "Noodle Committee",
  "Chairman Pebble"
];

const generatedPetNamePrefixes = [
  "Tiny",
  "Major",
  "Deputy",
  "Agent",
  "Doctor",
  "Count",
  "Princess",
  "Mister",
  "Captain",
  "Grandma",
  "Baron",
  "Duchess",
  "Inspector",
  "Professor",
  "Coach",
  "Marshal",
  "Clementine",
  "Beanie",
  "Juniper",
  "Warden"
];

const generatedPetNameNouns = [
  "Pudding",
  "Buttons",
  "Crouton",
  "Wiggle",
  "Pickles",
  "Soup",
  "Pancake",
  "Velcro",
  "Noodle",
  "Mittens",
  "Biscuit",
  "Sprinkle",
  "Waffles",
  "Loaf",
  "Tater",
  "Pipsqueak",
  "Fog",
  "Doorbell",
  "Sniff",
  "Pebble"
];

const generatedPetNameSuffixes = [
  "",
  "North",
  "Orchard",
  "Parade",
  "Station",
  "Annex",
  "Harbor",
  "Commons",
  "Yard",
  "Depot",
  "Meadow",
  "Porch"
];

const visualPrimaryColors = [
  "warm cream",
  "soft charcoal",
  "golden tan",
  "snow white",
  "cinnamon brown",
  "smoky gray",
  "deep black",
  "honey beige",
  "rust orange",
  "silver gray",
  "chocolate brown",
  "pale fawn"
];

const visualSecondaryColors = [
  "white chest",
  "darker ears",
  "cream muzzle",
  "soft gray belly",
  "tan paws",
  "black-tipped ears",
  "pale face blaze",
  "subtle speckling",
  "lighter underside",
  "darker tail",
  "white socks",
  "warm brown markings"
];

const visualMarkings = [
  "a small off-center forehead patch",
  "one slightly darker ear",
  "a clean white chest mark",
  "a faint stripe along the nose",
  "two lighter front paws",
  "a darker patch near the left shoulder",
  "a tiny lighter chin mark",
  "subtle mottling along the back",
  "a soft ring of lighter fur around the eyes",
  "a distinctive dark tail tip"
];

const visualEyeColors = [
  "dark brown eyes",
  "warm amber eyes",
  "soft hazel eyes",
  "deep black eyes",
  "greenish hazel eyes",
  "golden brown eyes"
];

const temporaryHostNames = [
  "Nina Blanket",
  "Rowan Kibble",
  "Eli Slippers",
  "Maya Towel",
  "Jonas Lint",
  "Avery Cushion",
  "Theo Crate",
  "Lena Biscuit",
  "Marco Leash",
  "Sasha Doormat",
  "Priya Fence",
  "Caleb Squeaker",
  "Rina Pantry",
  "Owen Rug",
  "Mira Window",
  "Felix Laundry",
  "Talia Scooper",
  "Noah Blanket"
];

const breedOptionsByPetType = {
  "petType-dog": ["Golden Retriever", "Beagle", "Border Collie", "Miniature Schnauzer", "Cavalier King Charles Spaniel"],
  "petType-cat": ["Domestic Shorthair", "Maine Coon", "Siamese", "Ragdoll", "British Shorthair"],
  "petType-rabbit": ["Holland Lop", "Netherland Dwarf", "Mini Rex", "Lionhead", "Flemish Giant"],
  "petType-ferret": ["Sable ferret", "Albino ferret", "Chocolate ferret", "Cinnamon ferret"],
  "petType-guinea-pig": ["American guinea pig", "Abyssinian guinea pig", "Peruvian guinea pig", "Teddy guinea pig"],
  "petType-hamster": ["Syrian hamster", "Roborovski dwarf hamster", "Winter White dwarf hamster", "Chinese hamster"],
  "petType-gerbil": ["Mongolian gerbil", "Fat-tailed gerbil", "Pallid gerbil"],
  "petType-mouse": ["Fancy mouse", "Satin mouse", "Long-haired fancy mouse"],
  "petType-rat": ["Fancy rat", "Dumbo rat", "Rex rat", "Hooded rat"],
  "petType-chinchilla": ["Standard grey chinchilla", "Beige chinchilla", "White mosaic chinchilla"],
  "petType-hedgehog": ["African pygmy hedgehog", "Algerian hedgehog"],
  "petType-parrot": ["African Grey parrot", "Green-cheeked conure", "Quaker parrot", "Indian Ringneck parakeet"],
  "petType-cockatiel": ["Grey cockatiel", "Lutino cockatiel", "Pearl cockatiel", "Pied cockatiel"],
  "petType-budgie": ["American budgie", "English budgie", "Opaline budgie", "Lutino budgie"],
  "petType-canary": ["American Singer canary", "Gloster canary", "Border canary", "Red Factor canary"],
  "petType-finch": ["Zebra finch", "Society finch", "Gouldian finch", "Java finch"],
  "petType-lovebird": ["Peach-faced lovebird", "Fischer's lovebird", "Masked lovebird"],
  "petType-dove": ["Ringneck dove", "Diamond dove", "Mourning dove"],
  "petType-chicken": ["Silkie chicken", "Plymouth Rock chicken", "Orpington chicken", "Easter Egger chicken"],
  "petType-duck": ["Call duck", "Indian Runner duck", "Khaki Campbell duck", "Pekin duck"],
  "petType-goldfish": ["Comet goldfish", "Fantail goldfish", "Oranda goldfish", "Ryukin goldfish"],
  "petType-betta": ["Halfmoon betta", "Crowntail betta", "Plakat betta", "Veiltail betta"],
  "petType-guppy": ["Fancy guppy", "Endler guppy", "Moscow guppy", "Cobra guppy"],
  "petType-tetra": ["Neon tetra", "Cardinal tetra", "Ember tetra", "Black skirt tetra"],
  "petType-koi": ["Kohaku koi", "Sanke koi", "Showa koi", "Butterfly koi"],
  "petType-angelfish": ["Silver angelfish", "Koi angelfish", "Marble angelfish", "Zebra angelfish"],
  "petType-shrimp": ["Cherry shrimp", "Amano shrimp", "Crystal Red shrimp", "Blue Dream shrimp"],
  "petType-snail": ["Nerite snail", "Mystery snail", "Ramshorn snail", "Rabbit snail"],
  "petType-lizard": ["Leopard gecko", "Bearded dragon", "Crested gecko", "Blue-tongued skink"],
  "petType-snake": ["Corn snake", "Ball python", "California kingsnake", "Rosy boa"],
  "petType-turtle": ["Eastern box turtle", "Red-eared slider", "Painted turtle", "Musk turtle"],
  "petType-frog": ["White's tree frog", "Pacman frog", "African dwarf frog", "Tomato frog"],
  "petType-tortoise": ["Russian tortoise", "Greek tortoise", "Hermann's tortoise", "Red-footed tortoise"],
  "petType-gecko": ["Leopard gecko", "Crested gecko", "Gargoyle gecko", "Day gecko"],
  "petType-chameleon": ["Veiled chameleon", "Panther chameleon", "Jackson's chameleon"],
  "petType-iguana": ["Green iguana", "Blue iguana", "Rhinoceros iguana"],
  "petType-axolotl": ["Wild type axolotl", "Leucistic axolotl", "Golden albino axolotl", "Melanoid axolotl"],
  "petType-salamander": ["Tiger salamander", "Fire salamander", "Spotted salamander"],
  "petType-newt": ["Eastern newt", "Fire belly newt", "Alpine newt"],
  "petType-goat": ["Nigerian Dwarf goat", "Pygmy goat", "Boer goat", "Alpine goat"],
  "petType-pig": ["Juliana pig", "Kunekune pig", "Vietnamese pot-bellied pig", "Ossabaw Island hog"],
  "petType-mini-horse": ["American Miniature Horse", "Shetland pony", "Falabella miniature horse"],
  "petType-pony": ["Shetland pony", "Welsh pony", "Connemara pony", "Dartmoor pony"],
  "petType-donkey": ["Miniature Mediterranean donkey", "Standard donkey", "Mammoth donkey"],
  "petType-alpaca": ["Huacaya alpaca", "Suri alpaca"],
  "petType-sheep": ["Babydoll Southdown sheep", "Shetland sheep", "Katahdin sheep", "Jacob sheep"],
  "petType-rabbit-outdoor": ["New Zealand rabbit", "Californian rabbit", "Silver Fox rabbit", "Rex rabbit"],
  "petType-tarantula": ["Chilean rose tarantula", "Mexican red-knee tarantula", "Pink toe tarantula"],
  "petType-hermit-crab": ["Caribbean hermit crab", "Ecuadorian hermit crab", "Strawberry hermit crab"],
  "petType-scorpion": ["Emperor scorpion", "Asian forest scorpion", "Desert hairy scorpion"],
  "petType-millipede": ["Giant African millipede", "Bumblebee millipede", "Ivory millipede"],
  "petType-praying-mantis": ["Giant Asian mantis", "Orchid mantis", "Carolina mantis"],
  "petType-land-snail": ["Garden snail", "Giant African land snail", "Roman snail"]
};

const listingSummaryOverrides = {
  "pet-sir-nibbles": "Brother Mynrd here: Sir Nibbles is tiny, white, smug, swift, soft, & weirdly keen on cords."
};

const detailDescriptionOverrides = {
  "pet-sir-nibbles": [
    "Brother Mynrd here: Sir Nibbles is tiny, white, smug, swift, soft, & weirdly keen on cords.",
    "Translation from the office: he chewed the A key, then sat beside the keyboard with the calm confidence of a rabbit who had improved the document. Please borrow him before the next warning label has to be handwritten."
  ]
};

const headlineTemplates = [
  (name) => `${name} is available before the next household memo.`,
  (name) => `${name} comes with charm, conditions, and a labeled snack pouch.`,
  (name) => `${name} needs a temporary audience with washable expectations.`,
  (name) => `${name} has excellent references from people who own towels.`,
  (name) => `${name} is ready for a short stay and a long explanation.`,
  (name) => `${name} may improve morale or reorganize the hallway.`,
  (name) => `${name} travels light, emotionally speaking.`,
  (name) => `${name} is technically manageable with the correct clipboard.`
];

const detailTemplates = [
  ({ name, headline }) => [
    `I am listing ${name} because "${headline.toLowerCase()}" stopped being a joke around Tuesday and started being the house mood. The cute part is still very real. The part where ${name} patrols the hallway like a volunteer security consultant is also real.`,
    `You do not need special experience, but you do need to respect the snack timing and send me one normal photo where nothing looks damp, tilted, or newly chewed. If ${name} stares at a corner, do not ask the corner follow-up questions.`
  ],
  ({ name }) => [
    `Quick profile update: ${name} is available for a short stay because I would like to drink one coffee while it is still legally coffee.`,
    `Pros: charming, surprisingly photogenic, understands the word "snack" in at least two emotional registers.`,
    `Cons: has a favorite object and will know if you moved it. I will include the object. Please do not improve the object.`
  ],
  ({ name }) => [
    `${name} is "pretty easy," which in this house means the instructions fit on one page if you use both sides and do not count the apology note. The main thing to know is that friendliness ends the moment procedure becomes optional.`,
    `Ideal temporary host: someone calm, punctual, and unoffended by being supervised by a pet who acts like the handoff is a meeting with minutes. ${name} does best when people narrate what they are doing, probably because it makes the whole thing feel official.`
  ],
  ({ name }) => [
    `I love ${name}. I also love having one uninterrupted evening where nobody tests whether a closed door is more of a suggestion.`,
    `${name} has a good heart and the decision-making confidence of a committee that has never paid rent. Bring patience. I will provide the supplies, the preferred phrase, and the thing you should absolutely not call "just a toy" in front of them.`
  ],
  ({ name }) => [
    `${name} is available because I have reached the stage of pet ownership where "maybe someone else would enjoy this for a weekend" sounds less like a cry for help and more like a community program.`,
    `Please expect normal pet behavior, plus one very specific habit that will seem made up until it happens in your kitchen.`,
    `Text me if the habit escalates into furniture. Otherwise, enjoy the company and pretend the waiver is mostly decorative.`
  ],
  ({ name }) => [
    `Borrow ${name} if you like pets with presence. The most useful description is "the one who makes guests lower their voices."`,
    `The first hour is usually observation. The second hour is negotiation. After that, ${name} either accepts you as temporary staff or begins a silent performance piece near the nearest soft surface. Both outcomes are normal enough.`
  ],
  ({ name }) => [
    `Honest note: ${name} is not bad. ${name} is simply running a small lifestyle brand inside my home and I need a break from the newsletter.`,
    `The travel bag has supplies, snacks, and instructions. Please follow those instructions without adding "fun little twists." Do not add twists. Twists are how we got the towel policy.`
  ],
  ({ name }) => [
    `Yes, ${name} is available. Before you ask: the listing photo was taken before the incident with the blanket basket, but the pet still looks like that most of the time.`,
    `${name} should be treated like a visiting roommate with no job, several preferences, and excellent hearing. If you return them with the same number of belongings and no new nicknames that stick, I will consider it a success.`
  ],
  ({ name }) => [
    `I am writing this after a long afternoon, so here is the short version: ${name} is lovable, available for a short stay, and currently too comfortable being the main character here.`,
    `Packing list: food, comfort item, instructions, and one warning that sounds dramatic until approximately minute nineteen.`,
    `Please take ${name} somewhere peaceful, send proof of life, and do not let them start a new household tradition unless you are prepared to keep it.`
  ],
  ({ name }) => [
    `${name} needs a temporary change of scenery. I need the kind of quiet where you can hear the fridge and not immediately wonder what the pet has learned.`,
    `Give them time, keep the routine boring, and resist the urge to negotiate with the eyes. The eyes have legal training, emotionally speaking.`
  ]
];

const traitOptions = [
  ["Snack negotiator", "snackNegotiator", "cookie", "playful"],
  ["Doorway analyst", "doorwayAnalyst", "doorOpen", "friendly"],
  ["Blanket loyalist", "blanketLoyalist", "bed", "friendly"],
  ["Tiny supervisor", "tinySupervisor", "clipboardList", "playful"],
  ["Emotionally aerodynamic", "emotionallyAerodynamic", "wind", "playful"],
  ["Suspicious of baskets", "basketSkeptic", "shoppingBasket", "warning"],
  ["Nap opportunist", "napOpportunist", "moon", "friendly"],
  ["Treat-motivated scholar", "treatScholar", "graduationCap", "friendly"],
  ["Drama adjacent", "dramaAdjacent", "theater", "warning"],
  ["Couch philosopher", "couchPhilosopher", "sofa", "playful"]
];

const careNoteOptions = [
  ["Snack calendar required", "Offer snacks on schedule or prepare for a short but pointed performance review.", "medium"],
  ["Respect the inspection route", "Allow a slow first lap around the room before attempting introductions.", "low"],
  ["Do not move the favorite object", "The chosen blanket, shell, perch, rock, or cushion is part of the management structure.", "medium"],
  ["Quiet handoff preferred", "Avoid dramatic entrances. This pet prefers onboarding, not theater.", "low"],
  ["Document unusual silence", "If the pet becomes unusually quiet, check the snack area, laundry pile, or nearest warm surface.", "medium"],
  ["Use the backup towel", "There is always a towel. If there is not a towel, become the person who finds one.", "low"],
  ["Confirm door policy", "Doors should be closed, watched, or spiritually negotiated depending on the species.", "high"]
];

const warningOptions = [
  ["May audit your furniture", "Expect intense interest in cushions, table legs, basking spots, or any object pretending not to be pet infrastructure.", "medium", "sofa"],
  ["Snack opinions are binding", "Treat offerings may be judged for timing, texture, and sincerity.", "low", "cookie"],
  ["Return window is not a suggestion", "This pet becomes harder to explain the longer it is in your home.", "high", "calendarClock"],
  ["May form a committee", "Household members could be reorganized into roles nobody applied for.", "medium", "users"],
  ["Do not freestyle the care plan", "Improvisation has historically produced emails with subject lines like 'quick question about the hallway'.", "high", "clipboardX"],
  ["Strong feelings about textiles", "Blankets, towels, rugs, and laundry may be reassigned without warning.", "medium", "shirt"],
  ["Looks easier than it is", "The listing photo is friendly. The operational reality includes footnotes.", "low", "fileWarning"]
];

const borrowTermOptions = [
  ["Return with original equipment", "Please return any blanket, perch, bowl, rock, tiny shell, or emotional support towel that arrived with the pet.", "packageCheck"],
  ["No surprise roommates", "Do not introduce new animals, cousins, neighbors, or motivational speakers during the borrowing period.", "userX"],
  ["Follow the snack clause", "Approved snacks are listed for a reason, usually because somebody learned something the loud way.", "clipboardCheck"],
  ["Keep the owner updated", "Send one cheerful check-in before the owner imagines the worst possible version of a quiet afternoon.", "messageCircle"],
  ["Respect the exit plan", "Pickup timing matters. Some pets become legally indistinguishable from household fixtures after day seven.", "calendarCheck"]
];

const vibeProfileOptions = [
  ["Cuddle probability", "Technically possible after the correct paperwork and snacks.", 3.5, "mint", "heartHandshake"],
  ["Rule flexibility", "Low enough that improvising becomes a household incident.", 1.5, "coral", "clipboardCheck"],
  ["Main-character energy", "Immediately finds the best lighting and emotional leverage.", 4.5, "blue", "sparkles"],
  ["Nap reliability", "Can become furniture if the room respects the vibe.", 4, "cream", "moon"],
  ["Snack diplomacy", "Negotiates like the treaty has already been breached.", 5, "mint", "cookie"],
  ["Doorway curiosity", "Interested in thresholds, exits, and everyone else's business.", 3, "coral", "doorOpen"]
];

const goodFitOptions = [
  "You like detailed instructions and consider labels a kindness.",
  "You can keep a routine boring without taking it personally.",
  "You enjoy quiet companionship with occasional formal inspection.",
  "You send reassuring updates before anyone has to ask twice.",
  "You understand that cute does not always mean uncomplicated."
];

const avoidFitOptions = [
  "You prefer to freestyle snacks, doors, or bedtime policy.",
  "You need a pet who loves surprise guests and loud entrances.",
  "You are offended by judgmental eye contact from a small animal.",
  "You cannot return borrowed items with their original emotional meaning.",
  "You think warnings are mostly decorative."
];

const scheduleOptions = [
  ["Morning", "Status inspection", "A slow room patrol followed by a pointed look at the breakfast area.", "cream"],
  ["Late morning", "Supervised lounging", "Ideal window for calm company, soft surfaces, and no sudden policy experiments.", "mint"],
  ["Afternoon", "Snack-adjacent diplomacy", "Offer approved treats only. This is where many households become too creative.", "coral"],
  ["Evening", "Debrief and reset", "Return toys, bowls, towels, and the household mood to their documented locations.", "blue"],
  ["Bedtime", "Quiet closing ceremony", "Low lights, familiar comfort item, and absolutely no bonus traditions.", "cream"]
];

const ownerBioOpeners = [
  ({ name }) => `${name} filled out this profile at 11:42 p.m. after deciding the pet situation had become "more of a community opportunity." Replies are usually fast unless someone is standing on the router.`,
  ({ name }) => `${name} uses Pet Share the way other people use a neighborhood group: a little too honestly, with several photos and one apology typed before breakfast.`,
  ({ name }) => `${name} describes themself as friendly, responsive, and only mildly haunted by previous handoffs. Profile updates happen whenever a pet does something that feels legally significant.`,
  ({ name }) => `${name} keeps this profile current because apparently "please borrow my pet for a bit" works better when strangers can see a photo, a city, and a reassuring sentence.`,
  ({ name }) => `${name} joined after a friend said the listing needed more context and fewer all-caps warnings. The all-caps warnings are now mostly in the care notes.`,
  ({ name }) => `${name} treats this profile like a tiny social media page for household logistics: casual, specific, and updated whenever the pet learns a new problem.`
];

const ownerBioDetails = [
  ({ location }) => `Pickup is arranged around ${location}. The owner appreciates a message before arrival and a respectful silence around whatever the pet is currently accusing.`,
  ({ location }) => `Based in ${location}. Exact handoff details are shared after the owner confirms you understand the care notes and the emotional tone of the carrier.`,
  ({ location }) => `Most handoffs happen somewhere convenient in ${location}, usually with a labeled bag, a nervous wave, and one final instruction that sounds optional but is not.`,
  ({ location }) => `Pickup area: ${location}. If replies slow down, someone is probably negotiating with a leash, carrier, or suspicious snack container.`,
  ({ location }) => `Located in ${location}. Visitors should expect normal neighbor energy, plus one pet-specific warning delivered with forced cheer.`,
  ({ location }) => `Handoffs usually happen in ${location}. The owner is polite, the instructions are searchable, and the pet has already formed an opinion.`
];

async function main() {
  const environment = validateSeedEnvironment({ requireWriteToken: isConfirmed });
  if (!environment.ok) {
    printBlockingSeedEnvironmentError(environment);
    process.exitCode = 1;
    return;
  }

  if (isPurgeOnly) {
    if (!isConfirmed) {
      console.log(color.warning("Purge-only mode was requested, but no documents were deleted because --confirm was not provided."));
      console.log(`Run ${color.path("pnpm seed:sanity -- --confirm --purge-only")} to delete seeded Sanity documents without writing replacements.`);
      return;
    }

    await purgeSeedDocuments();
    console.log(color.success("Seeded Sanity documents were purged without writing replacements."));
    return;
  }

  const seed = loadSeedData();
  const documents = buildDocuments(seed, { petCount });
  const selectedDocuments = onlyTarget ? selectDocumentsByTarget(documents, onlyTarget) : documents;

  if (isPreview) {
    writePreviewFiles(selectedDocuments, { petCount, mediaScope });
    return;
  }

  if (!isConfirmed) {
    console.log(`${color.heading("Dry run:")} prepared ${color.success(String(selectedDocuments.length))} documents${onlyTarget ? ` for target ${color.path(onlyTarget)}` : `, including ${color.success(String(petCount))} pets`}.`);
    console.log(`Run ${color.path("pnpm seed:sanity -- --preview")} to write local review files.`);
    console.log(`Run ${color.path("pnpm seed:sanity -- --preview --pet-count 25")} to preview a custom pet count.`);
    console.log(`Run ${color.path("pnpm seed:sanity -- --preview --only homePage")} to preview only the homepage document.`);
    console.log(`Run ${color.path("pnpm seed:sanity -- --preview --media-scope pets")} to preview all content with pet-only media prompts.`);
    console.log(`Run ${color.path("pnpm seed:sanity -- --confirm")} to write to Sanity.`);
    console.log(`Run ${color.path("pnpm seed:sanity -- --confirm --only homePage --skip-media-upload")} to write only the homepage while preserving existing page media.`);
    console.log(`Run ${color.path("pnpm seed:sanity -- --confirm --purge")} to purge existing seeded documents before writing.`);
    console.log(`Run ${color.path("pnpm seed:sanity -- --confirm --purge-only")} to purge existing seeded documents without writing replacements.`);
    console.log(`Run ${color.path("pnpm seed:sanity -- --confirm --skip-media-upload")} to write content without uploading local media.`);
    return;
  }

  if (shouldPurge && onlyTarget) {
    console.log(color.warning("Ignoring --purge for targeted page writes. Targeted writes patch only the selected document."));
  } else if (shouldPurge) {
    await purgeSeedDocuments();
  }

  if (shouldSkipMediaUpload) {
    console.log(color.warning("Skipping local media upload. Targeted page writes preserve existing page media where possible."));
  }

  const assetRefs = shouldSkipMediaUpload ? new Map() : await uploadKnownAssets();
  const context = { refsBySeedKey: new Map(), assetRefs, progress: createProgress("Sanity documents", selectedDocuments.length) };

  if (onlyTarget) {
    await hydrateAllSeedRefs(getClient(), context);
    await preserveExistingPageMedia(selectedDocuments);
  }

  await upsertBatch(selectedDocuments.filter((doc) => doc._type === "petType"), context);
  await upsertBatch(selectedDocuments.filter((doc) => doc._type === "owner"), context);
  await upsertBatch(selectedDocuments.filter((doc) => doc._type === "pet"), context);
  await upsertBatch(selectedDocuments.filter((doc) => doc._type === "testimonial"), context);
  await upsertBatch(selectedDocuments.filter((doc) => doc._type === "formDefinition"), context);
  await upsertBatch(selectedDocuments.filter((doc) => doc._type === "marketingPage"), context);
  await upsertSingletons(selectedDocuments.filter((doc) => ["siteSettings", "homePage", "petIndexPage", "systemPage"].includes(doc._type)), context);

  console.log(color.success(`Seeded ${selectedDocuments.length} document${selectedDocuments.length === 1 ? "" : "s"} into Sanity.`));
}

function parseArgs(input) {
  const flags = new Set();
  const values = new Map();

  for (let index = 0; index < input.length; index += 1) {
    const arg = input[index];
    if (!arg.startsWith("--")) continue;

    const [rawName, inlineValue] = arg.slice(2).split("=", 2);
    if (inlineValue !== undefined) {
      values.set(rawName, inlineValue);
      continue;
    }

    const next = input[index + 1];
    if (next && !next.startsWith("--")) {
      values.set(rawName, next);
      index += 1;
      continue;
    }

    flags.add(rawName);
  }

  return { flags, values };
}

function parsePetCount(value) {
  if (value === undefined) return DEFAULT_PET_COUNT;

  const count = Number(value);
  if (!Number.isInteger(count) || count < 1) {
    console.error(color.error(`Invalid pet count "${value}". Use a positive whole number, such as --pet-count 50.`));
    process.exit(1);
  }

  return count;
}

function parseMediaScope(value) {
  if (value === undefined) return "all";
  if (["all", "pets"].includes(value)) return value;

  console.error(color.error(`Invalid media scope "${value}". Use --media-scope all or --media-scope pets.`));
  process.exit(1);
}

function parseOnlyTarget(value) {
  if (value === undefined) return null;

  const target = value.trim();
  if (target) return target;

  console.error(color.error("Invalid empty --only target. Use a page target such as --only homePage or --only process."));
  process.exit(1);
}

function selectDocumentsByTarget(documents, target) {
  const normalizedTarget = target.toLowerCase();
  const singletonAliases = new Map([
    ["home", "homePage"],
    ["homepage", "homePage"],
    ["home-page", "homePage"],
    ["homepage", "homePage"],
    ["homePage".toLowerCase(), "homePage"],
    ["pets", "petIndexPage"],
    ["pet-index", "petIndexPage"],
    ["petindex", "petIndexPage"],
    ["petindexpage", "petIndexPage"],
    ["settings", "siteSettings"],
    ["site-settings", "siteSettings"],
    ["sitesettings", "siteSettings"]
  ]);
  const singletonId = singletonAliases.get(normalizedTarget);

  const selected = documents.filter((doc) => {
    if (singletonId) return doc._id === singletonId;
    if (doc._id === target) return true;
    if (doc._type === "marketingPage") return doc.slug?.current?.toLowerCase() === normalizedTarget;
    if (doc._type === "systemPage") return doc.pageType?.toLowerCase() === normalizedTarget || doc._id?.toLowerCase() === normalizedTarget;
    return false;
  });

  if (selected.length > 0) return selected;

  console.error(color.error(`No seed document matched --only ${target}. Try homePage, petIndexPage, siteSettings, a marketing page slug such as process, or a system page type such as notFound.`));
  process.exit(1);
}

function getClient() {
  if (!sanityClient) {
    sanityClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false
    });
  }

  return sanityClient;
}

function loadJson(name) {
  return JSON.parse(readFileSync(join(dataDir, name), "utf8"));
}

function loadSeedData() {
  return {
    pages: loadJson("pages.json"),
    forms: loadJson("forms.json"),
    testimonials: loadJson("testimonials.json")
  };
}

function key(prefix) {
  const next = (keyCounters.get(prefix) ?? 0) + 1;
  keyCounters.set(prefix, next);
  return `${prefix}-${next}`;
}

function block(text, style = "normal") {
  return {
    _key: key("block"),
    _type: "block",
    style,
    children: [{ _key: key("span"), _type: "span", text, marks: [] }],
    markDefs: []
  };
}

function buildListingSummary(detailParagraphs) {
  const summary = detailParagraphs[0] ?? "";
  const maxLength = 250;

  if (summary.length <= maxLength) {
    return summary;
  }

  const clipped = summary.slice(0, maxLength);
  const lastWordBreak = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastWordBreak > 0 ? lastWordBreak : maxLength)}...`;
}

function link(input) {
  if (!input) return null;

  return {
    _type: "link",
    label: input.label ?? "",
    type: input.type ?? "internalPath",
    path: input.path ?? null,
    url: input.url ?? null,
    action: input.action ?? null,
    openInNewTab: input.openInNewTab ?? false
  };
}

function cta(input) {
  if (!input) return null;
  return {
    _type: "cta",
    label: input.label,
    style: input.style ?? "primary",
    icon: input.icon ?? null,
    link: link({ label: input.label, ...(input.link ?? { type: "internalPath", path: "/" }) })
  };
}

function ctaGroup(input) {
  if (!input) return null;
  return {
    _type: "ctaGroup",
    primary: cta(input.primary),
    secondary: cta(input.secondary),
    alignment: input.alignment ?? "left"
  };
}

function imageWithAlt(assetKey, alt, caption = null, assetRefs = new Map()) {
  const assetRef = assetRefs.get(assetKey);
  const value = {
    _type: "imageWithAlt",
    image: assetRef
      ? { _type: "image", asset: { _type: "reference", _ref: assetRef } }
      : { _type: "image" },
    alt: alt ?? "Pet Share image pending review.",
    caption
  };

  if (assetKey) {
    value.seedAssetKey = assetKey;
  }

  return value;
}

function seo(input, fallbackTitle, fallbackDescription) {
  const value = {
    _type: "seo",
    title: input?.title ?? fallbackTitle,
    description: input?.description ?? fallbackDescription,
    noIndex: input?.noIndex ?? false
  };

  if (input?.openGraphImageAssetKey) {
    value.openGraphImage = imageWithAlt(input.openGraphImageAssetKey, `${fallbackTitle} social image.`);
  }

  return value;
}

function ref(seedKey, context) {
  const id = context.refsBySeedKey.get(seedKey);
  if (!id) return undefined;
  return { _type: "reference", _ref: id };
}

function buildDocuments(seed, options = {}) {
  const petTypes = buildPetTypes();
  const owners = buildOwners();
  const pets = buildPets(options.petCount ?? DEFAULT_PET_COUNT);
  const testimonials = buildTestimonials(seed.testimonials.items, pets, owners);
  const forms = seed.forms.items.map(transformForm);
  const pages = buildPages(seed.pages, pets, owners, testimonials);

  return [...petTypes, ...owners, ...pets, ...testimonials, ...forms, ...pages];
}

function buildPetTypes() {
  const docs = [];
  const customIconSeedKeys = new Set(["petType-dog", "petType-cat", "petType-rabbit"]);
  for (const [category, items] of Object.entries(petTypeCategories)) {
    items.forEach(([seedKey, name, pluralName, icon, summary], index) => {
      const petTypeDoc = {
        _type: "petType",
        seedKey,
        name,
        slug: { _type: "slug", current: seedKey.replace("petType-", "") },
        pluralName,
        filterLabel: name,
        category,
        icon,
        summary,
        description: [block(`${pluralName} are available for temporary hosts with clear expectations and washable plans.`)],
        sortOrder: docs.length * 10 + index,
        featured: docs.length < 6,
        seo: seo(null, `${pluralName} | Pet Share`, `Browse ${pluralName.toLowerCase()} available through Pet Share.`)
      };

      if (customIconSeedKeys.has(seedKey)) {
        petTypeDoc.customIconAssetKey = `${seedKey}-icon`;
      }

      docs.push(petTypeDoc);
    });
  }
  return docs;
}

function buildOwners() {
  return ownerSeeds.map(({ seedKey, name, tagline, location, memberSince }, index) => ({
    _type: "owner",
    seedKey,
    name,
    slug: { _type: "slug", current: seedKey.replace("owner-", "") },
    portrait: imageWithAlt(`${seedKey}-portrait`, `${name} looking prepared for a very specific pet incident.`),
    tagline,
    bio: [
      block(pick(ownerBioOpeners, index)({ name })),
      block(pick(ownerBioDetails, index)({ location }))
    ],
    location,
    memberSince,
    contactCta: cta({ label: "Ask about this owner", link: { type: "action", action: "openOwnerContactDrawer" }, style: "primary" }),
    seo: seo(null, `${name} | Pet Share`, `${name} is a Pet Share owner with unusually specific care instructions.`)
  }));
}

function buildPets(targetCount = DEFAULT_PET_COUNT) {
  const seeds = [...petNameSeeds];
  const typeKeys = Object.values(petTypeCategories).flat().map(([seedKey]) => seedKey);

  while (seeds.length < targetCount) {
    const index = seeds.length;
    const title = getGeneratedPetName(index - petNameSeeds.length);
    const slug = slugify(title);
    seeds.push([
      `pet-${slug}`,
      title,
      typeKeys[index % typeKeys.length],
      ownerSeeds[index % ownerSeeds.length].seedKey,
      pick(headlineTemplates, index)(title),
      ["friendly", "dramatic", "independent", "regal", "suspicious"][index % 5],
      ["anytime", "withinSevenDays", "immediately", "appointmentOnly"][index % 4],
      ["openEnrollment", "consentRequired", "afterSnacksOnly", "lookDoNotCuddle"][index % 4],
      1 + (index % 5),
      1 + ((index + 2) % 5),
      1 + ((index + 3) % 5)
    ]);
  }

  return seeds.slice(0, targetCount).map(([seedKey, name, petTypeSeedKey, ownerSeedKey, headline, temperament, pickupUrgency, cuddlePolicy, messRisk, chaosLevel, energyLevel], index) => {
    const breed = pick(breedOptionsByPetType[petTypeSeedKey] ?? ["Mixed breed"], index);
    const owner = ownersBySeedKey.get(ownerSeedKey) ?? { name: "A very tired owner" };
    const petContentContext = { seedKey, name, breed, headline, ownerName: owner.name, petTypeSeedKey };
    const detailParagraphs = detailDescriptionOverrides[seedKey] ?? pick(detailTemplates, index)(petContentContext);
    const imageCount = imageCountForPetIndex(index);

    const visualIdentity = buildPetVisualIdentity(seedKey, index);
    const listingPlan = pick(listingPlans, index);
    const hostPayoutUnit = pick(payoutUnits, index);

    return {
      _type: "pet",
      seedKey,
      name,
      slug: { _type: "slug", current: seedKey.replace("pet-", "") },
      petTypeSeedKey,
      ownerSeedKey,
      submittedByOwnerSeedKey: ownerSeedKey,
      breed,
      visualIdentity,
      ageYears: (index % 14) + 1,
      submissionStatus: "approved",
      source: "userSubmitted",
      listingHeadline: headline,
      listingSummary: listingSummaryOverrides[seedKey] ?? buildListingSummary(detailParagraphs),
      availabilityStatus: ["available", "available", "temporarilyUnavailable", "pendingPickup"][index % 4],
      distanceKilometers: getSpoofDistanceKilometers(index),
      listingPlan: listingPlan.value,
      hostPayoutAmount: listingPlan.basePayout + ((index * 3) % 11),
      hostPayoutCurrency: "CAD",
      hostPayoutUnit,
      temperament,
      pickupUrgency,
      messRisk,
      chaosLevel,
      energyLevel,
      cuddlePolicy,
      cardMedia: {
        _type: "object",
        image: imageWithAlt(`${seedKey}-image-01`, `${name}, a ${breed}, in a candid owner phone snapshot.`)
      },
      heroImages: Array.from({ length: Math.max(imageCount - 1, 1) }, (_, heroIndex) => {
        const imageNumber = heroIndex + 2;
        return imageWithAlt(
          `${seedKey}-image-${String(imageNumber).padStart(2, "0")}`,
          `${name}, a ${breed}, in candid owner photo ${imageNumber}.`
        );
      }),
      description: detailParagraphs.map((paragraph) => block(paragraph)),
      personalityTraits: buildPetTraits(index),
      vibeProfile: buildVibeProfile(index),
      fitGuidance: buildFitGuidance(index),
      careNotes: buildCareNotes(index),
      availability: [
        { _key: key("availability"), _type: "availabilityWindow", startDate: "2026-07-01", endDate: "2026-12-31", note: pickAvailabilityNote(index), status: ["available", "available", "temporarilyUnavailable", "pendingPickup"][index % 4] }
      ],
      borrowTerms: buildBorrowTerms(index),
      stats: buildPetStats(index, chaosLevel, messRisk, energyLevel),
      warnings: buildWarnings(index),
      dailySchedule: buildDailySchedule(index),
      contactOwnerCta: cta({ label: "Ask about this pet", link: { type: "action", action: "openOwnerContactDrawer" }, style: "primary" }),
      seo: seo(null, `${name} | Pet Share`, `Borrow ${name}, a ${breed} with care notes, owner instructions, and a few practical warnings.`)
    };
  });
}

function getSpoofDistanceKilometers(index) {
  return Number((1.4 + ((index * 2.65) % 34)).toFixed(1));
}

function getGeneratedPetName(index) {
  if (generatedPetNames[index]) return generatedPetNames[index];

  const prefix = generatedPetNamePrefixes[index % generatedPetNamePrefixes.length];
  const noun = generatedPetNameNouns[Math.floor(index / generatedPetNamePrefixes.length) % generatedPetNameNouns.length];
  const suffixIndex = Math.floor(index / (generatedPetNamePrefixes.length * generatedPetNameNouns.length));
  const suffix = generatedPetNameSuffixes[suffixIndex % generatedPetNameSuffixes.length];

  return [prefix, noun, suffix].filter(Boolean).join(" ");
}

function imageCountForPetIndex(index) {
  return 5 + (index % 6);
}

function buildPetVisualIdentity(seedKey, index) {
  return {
    primaryColor: pick(visualPrimaryColors, index),
    secondaryColor: pick(visualSecondaryColors, stableNumber(seedKey) + index),
    markings: pick(visualMarkings, stableNumber(`${seedKey}-markings`) + index),
    eyeColor: pick(visualEyeColors, stableNumber(`${seedKey}-eyes`) + index)
  };
}

function buildPetTraits(index) {
  const count = 2 + (index % 3 === 0 ? 1 : 0);
  return Array.from({ length: count }, (_, offset) => {
    const [label, value, icon, tone] = pick(traitOptions, index + offset * 3);
    return { _key: key("trait"), _type: "petTrait", label, value, icon, tone };
  });
}

function buildVibeProfile(index) {
  const count = 2 + (index % 3 === 0 ? 1 : 0);
  return Array.from({ length: count }, (_, offset) => {
    const [label, descriptor, strength, tone, icon] = pick(vibeProfileOptions, index + offset * 2);
    return { _key: key("vibe"), _type: "petVibeItem", label, descriptor, strength, tone, icon };
  });
}

function buildFitGuidance(index) {
  return {
    _type: "petFitGuidance",
    goodFitTitle: "Good fit if...",
    goodFitItems: Array.from({ length: 3 }, (_, offset) => ({
      _key: key("goodFit"),
      _type: "petFitGuidanceItem",
      text: pick(goodFitOptions, index + offset),
      tone: "mint"
    })),
    avoidTitle: "Maybe avoid if...",
    avoidItems: Array.from({ length: 3 }, (_, offset) => ({
      _key: key("avoidFit"),
      _type: "petFitGuidanceItem",
      text: pick(avoidFitOptions, index + offset),
      tone: "coral"
    }))
  };
}

function buildDailySchedule(index) {
  const count = 3 + (index % 2);
  return Array.from({ length: count }, (_, offset) => {
    const [timeLabel, title, description, tone] = pick(scheduleOptions, index + offset);
    return { _key: key("schedule"), _type: "petScheduleItem", timeLabel, title, description, tone };
  });
}

function buildCareNotes(index) {
  const count = 1 + (index % 4 === 0 ? 1 : 0);
  return Array.from({ length: count }, (_, offset) => {
    const [title, description, severity] = pick(careNoteOptions, index + offset * 2);
    return { _key: key("care"), _type: "careNote", title, description, severity };
  });
}

function buildBorrowTerms(index) {
  const count = 1 + (index % 5 === 0 ? 1 : 0);
  return Array.from({ length: count }, (_, offset) => {
    const [title, description, icon] = pick(borrowTermOptions, index + offset * 2);
    return { _key: key("term"), _type: "borrowTerm", title, description, icon };
  });
}

function buildWarnings(index) {
  const count = 1 + (index % 6 === 0 ? 1 : 0);
  return Array.from({ length: count }, (_, offset) => {
    const [title, description, severity, icon] = pick(warningOptions, index + offset * 2);
    return { _key: key("warning"), _type: "petWarning", title, description, severity, icon };
  });
}

function buildPetStats(index, chaosLevel, messRisk, energyLevel) {
  const optionalStats = [
    ["Snack leverage", `${1 + ((index + 1) % 5)}/5`, "How quickly treats become policy.", "cookie"],
    ["Nap reliability", `${1 + ((index + 4) % 5)}/5`, "Likelihood of staying still long enough for optimism.", "moon"],
    ["Door curiosity", `${1 + ((index + 2) % 5)}/5`, "Interest in exits, entrances, and hallway politics.", "doorOpen"],
    ["Drama radius", `${1 + ((index + 3) % 5)}/5`, "How far the story travels after one ordinary incident.", "radar"]
  ];

  return [
    { _key: key("stat"), _type: "petStat", label: "Chaos", value: `${chaosLevel}/5`, description: "Measured by household folklore and recent furniture behavior.", icon: "gauge" },
    { _key: key("stat"), _type: "petStat", label: "Mess risk", value: `${messRisk}/5`, description: "A practical estimate for towels, lint rollers, and plausible denial.", icon: "sparkles" },
    { _key: key("stat"), _type: "petStat", label: "Energy", value: `${energyLevel}/5`, description: "Temporary companion velocity under normal snack conditions.", icon: "zap" },
    {
      _key: key("stat"),
      _type: "petStat",
      label: pick(optionalStats, index)[0],
      value: pick(optionalStats, index)[1],
      description: pick(optionalStats, index)[2],
      icon: pick(optionalStats, index)[3]
    }
  ];
}

function pickAvailabilityNote(index) {
  return pick([
    "Available after a calm handoff and one meaningful look at the snack shelf.",
    "Owner reserves the right to ask how the rug is doing.",
    "Best for temporary hosts who can pick up on time and return with a clean story.",
    "Availability may change after the next household incident report."
  ], index);
}

function buildTestimonials(seedTestimonials, pets, owners) {
  const seeded = seedTestimonials.map((item) => ({
    _type: "testimonial",
    seedKey: item.seedId,
    quote: item.quote,
    authorName: item.authorName,
    authorRole: item.authorRole,
    relatedPetSeedKey: item.relatedPetSeedId,
    relatedOwnerSeedKey: item.relatedOwnerSeedId,
    rating: item.rating,
    tone: item.tone,
    featured: item.featured
  }));

  const generated = pets.slice(0, 18).map((pet, index) => ({
    _type: "testimonial",
    seedKey: `testimonial-${pet.seedKey.replace("pet-", "")}`,
    quote: `${pet.name} stayed for one weekend and left behind better photos, one new household rule, and a strong case for reading care notes twice.`,
    authorName: temporaryHostNames[index],
    authorRole: "Temporary pet custodian",
    relatedPetSeedKey: pet.seedKey,
    relatedOwnerSeedKey: pet.ownerSeedKey,
    rating: 4 + (index % 3) * 0.5,
    tone: index % 4 === 0 ? "warning" : "playful",
    featured: index < 8
  }));

  return [...seeded, ...generated];
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function pick(items, index) {
  return items[index % items.length];
}

function stableNumber(value) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

function withArticle(value) {
  return `${/^[aeiou]/i.test(value) ? "an" : "a"} ${value}`;
}

function transformForm(form) {
  return {
    _type: "formDefinition",
    seedKey: form.seedId,
    title: form.title,
    slug: { _type: "slug", current: form.slug.current },
    description: form.description,
    successMessage: { _type: "formSuccessState", ...form.successMessage, cta: cta(form.successMessage.cta) },
    fields: form.fields.map((field) => ({
      _key: key("field"),
      _type: "formField",
      ...field,
      options: field.options?.map((option) => ({ _key: key("option"), _type: "formOption", ...option })) ?? []
    })),
    submitLabel: form.submitLabel,
    formType: form.formType
  };
}

function buildPages(seedPages, pets, owners, testimonials) {
  const { singletons, marketingPages } = seedPages;
  const testimonialSeedKeys = testimonials.filter((item) => item.featured).slice(0, 6).map((item) => item.seedKey);

  const pages = [
    { _id: "siteSettings", _type: "siteSettings", ...singletons.siteSettings },
    { _id: "homePage", _type: "homePage", ...singletons.homePage, testimonialSeedIds: testimonialSeedKeys },
    { _id: "petIndexPage", _type: "petIndexPage", ...singletons.petIndexPage },
    ...["systemPageNotFound", "systemPageServerError", "systemPageGenericError"].map((keyName) => ({
      _id: singletons[keyName].sanityId,
      _type: "systemPage",
      ...singletons[keyName]
    })),
    ...marketingPages.map((page) => ({ _type: "marketingPage", ...page }))
  ];

  return pages.map((page) => transformPage(page, pets, owners));
}

function transformPage(page, pets, owners) {
  const base = {
    _type: page._type,
    seedKey: page.seedId,
    title: page.title,
    slug: page.slug ? { _type: "slug", current: page.slug.current } : undefined,
    seo: seo(page.seo, page.title ?? "Pet Share", page.summary ?? "Temporary pet relief with unusually specific instructions.")
  };

  if (page._id) base._id = page._id;

  if (page._type === "siteSettings") {
    return {
      ...base,
      title: page.title,
      description: page.description,
      defaultSeo: seo(page.defaultSeo, "Pet Share", "Temporary pets, questionable peace of mind."),
      primaryNavigation: page.primaryNavigation.map(navItem),
      footerNavigation: page.footerNavigation.map(navItem),
      contactEmail: page.contactEmail,
      defaultCta: cta({ label: "Find a temporary pet", link: { type: "internalPath", path: "/pets" }, style: "primary" })
    };
  }

  if (page._type === "homePage") {
    return {
      ...base,
      heroCarousel: page.heroCarousel.map((slide) => transformSection(slide, { fallbackAssetKey: `${page._id}-hero` })),
      featuredPetsSeedKeys: page.featuredPetSeedIds ?? pets.slice(0, 6).map((pet) => pet.seedKey),
      featuredOwnersSeedKeys: page.featuredOwnerSeedIds ?? owners.slice(0, 4).map((owner) => owner.seedKey),
      testimonialSeedIds: page.testimonialSeedIds,
      processSummary: page.contentSections.filter((section) => section._type === "processStep").map(transformSection),
      statBlocks: [
        { _key: key("stat"), _type: "statBlock", value: "50", label: "Pets on standby", description: "Enough listings to make any quiet weekend feel negotiable.", icon: "paw" },
        { _key: key("stat"), _type: "statBlock", value: "0", label: "Apologies guaranteed", description: "We offer guidance, warning labels, and emotional support towels.", icon: "shield" }
      ],
      contentSections: [
        ...page.contentSections.map(transformSection)
      ],
      primaryCta: cta({ label: "Find a temporary pet", link: { type: "internalPath", path: "/pets" }, style: "primary" })
    };
  }

  if (page._type === "petIndexPage") {
    return {
      ...base,
      hero: transformSection(page.hero, { fallbackAssetKey: `${page._id}-hero` }),
      summary: page.summary ?? "Find temporary companions with permanent opinions.",
      filterIntro: page.filterIntro,
      emptyState: transformSection(page.emptyState),
      featuredPetsSeedKeys: page.featuredPetSeedIds,
      contentSections: page.contentSections.map(transformSection),
      primaryCta: cta({ label: "Find a temporary pet", link: { type: "internalPath", path: "/pets" }, style: "primary" })
    };
  }

  if (page._type === "systemPage") {
    return {
      ...base,
      title: page.title ?? page.headline,
      pageType: page.pageType,
      eyebrow: page.eyebrow,
      headline: page.headline,
      message: page.message,
      image: imageWithAlt(page.imageAssetKey ?? `${page._id}-hero`, `${page.headline} system illustration.`),
      primaryCta: cta(page.primaryCta),
      secondaryCta: cta(page.secondaryCta),
      supportCopy: page.supportCopy,
      contentSections: page.contentSections?.map(transformSection) ?? []
    };
  }

  const shouldUseDedicatedCtaSection = page.sections?.some((section) => section._type === "pricingCtaBand");

  return {
    ...base,
    title: page.title,
    sections: [
      transformSection(page.hero, { fallbackAssetKey: `${page.seedId}-hero` }),
      ...page.sections.map(transformSection),
      page.primaryCta && !shouldUseDedicatedCtaSection
        ? { _key: key("section"), _type: "ctaGroup", primary: cta(page.primaryCta), secondary: null, alignment: "center" }
        : null
    ].filter(Boolean),
    showContactForm: page.showContactForm ?? false
  };
}

function navItem(item) {
  return { _key: key("nav"), _type: "navigationItem", label: item.label, link: link({ label: item.label, ...item.link }) };
}

function transformSection(section, options = {}) {
  if (!section) return null;
  const imageAssetKey = section.imageAssetKey ?? (section.layoutHint === "centered" ? null : options.fallbackAssetKey);
  if (section._type === "hero") {
    return {
      _key: section._key ?? key("section"),
      _type: "hero",
      eyebrow: section.eyebrow ?? null,
      headline: section.headline,
      body: section.body ?? null,
      image: imageAssetKey ? imageWithAlt(imageAssetKey, `${section.headline} hero image.`) : null,
      ctaGroup: ctaGroup(section.ctaGroup),
      layoutHint: section.layoutHint ?? "mediaCard"
    };
  }
  if (section._type === "heroSlide") {
    return {
      _key: section._key ?? key("section"),
      _type: "heroSlide",
      headline: section.headline,
      body: section.body,
      image: imageWithAlt(imageAssetKey, `${section.headline} slide image.`),
      cta: cta(section.cta),
      featuredPet: null,
      featuredOwner: null
    };
  }
  if (section._type === "contentSection") {
    return {
      _key: section._key ?? key("section"),
      _type: "contentSection",
      header: { _type: "sectionHeader", headline: section.headline ?? section.header?.headline ?? "Content", body: section.header?.body ?? null, alignment: section.header?.alignment ?? "left" },
      body: Array.isArray(section.body) ? section.body : [block(section.body ?? "")],
      media: section.imageAssetKey ? imageWithAlt(section.imageAssetKey, `${section.headline ?? "Pet Share"} section image.`) : null,
      ctaGroup: ctaGroup(section.ctaGroup),
      layoutHint: section.layoutHint ?? "textOnly"
    };
  }
  if (section._type === "statBlock") {
    return { _key: section._key ?? key("section"), _type: "statBlock", value: section.value, label: section.label, description: section.description ?? section.supportingText ?? null, icon: section.icon ?? "star" };
  }
  if (section._type === "featureList") {
    return {
      _key: section._key ?? key("section"),
      _type: "featureList",
      header: section.header ?? null,
      iconStyle: section.iconStyle ?? "outline",
      items: section.items?.map((item) => ({
        _key: item._key ?? key("feature"),
        _type: "featureItem",
        title: item.title,
        description: item.description ?? null,
        icon: item.icon ?? null,
        link: link(item.link)
      })) ?? []
    };
  }
  if (section._type === "ctaGroup") {
    return { _key: section._key ?? key("section"), ...ctaGroup(section) };
  }
  if (section._type === "pricingValueSection") {
    return {
      _key: section._key ?? key("section"),
      _type: "pricingValueSection",
      valueItems: section.valueItems?.map((item) => ({
        _key: item._key ?? key("pricingValue"),
        _type: "pricingValueItem",
        title: item.title,
        body: item.body,
        icon: item.icon ?? null
      })) ?? []
    };
  }
  if (section._type === "pricingPackageGrid") {
    return {
      _key: section._key ?? key("section"),
      _type: "pricingPackageGrid",
      header: section.header ?? null,
      packages: section.packages?.map((item) => ({
        _key: item._key ?? key("pricingPackage"),
        _type: "pricingPackage",
        name: item.name,
        price: item.price,
        duration: item.duration,
        description: item.description,
        icon: item.icon ?? null,
        tone: item.tone ?? "mint",
        badge: item.badge ?? null,
        highlighted: item.highlighted ?? false,
        features: item.features?.map((feature) => ({
          _key: feature._key ?? key("pricingPlanFeature"),
          _type: "pricingPlanFeatureItem",
          label: feature.label
        })) ?? []
      })) ?? []
    };
  }
  if (section._type === "pricingCtaBand") {
    return {
      _key: section._key ?? key("section"),
      _type: "pricingCtaBand",
      headline: section.headline,
      body: section.body,
      icon: section.icon ?? null,
      ctaGroup: ctaGroup(section.ctaGroup),
      proofItems: section.proofItems?.map((item) => ({
        _key: item._key ?? key("pricingProof"),
        _type: "pricingCtaProofItem",
        label: item.label,
        icon: item.icon ?? null
      })) ?? []
    };
  }
  if (section._type === "processPathSection") {
    return {
      _key: section._key ?? key("section"),
      _type: "processPathSection",
      header: section.header ?? (section.title || section.body
        ? {
            _type: "sectionHeader",
            headline: section.title,
            body: section.body ?? null,
            alignment: "left"
          }
        : null),
      tone: section.tone ?? "neutral",
      icon: section.icon ?? null,
      steps: section.steps?.map((step) => ({
        _key: step._key ?? key("processStep"),
        _type: "processStep",
        title: step.title,
        body: Array.isArray(step.body) ? step.body : step.description ? [block(step.description)] : [],
        icon: step.icon ?? null,
        cta: cta(step.cta)
      })) ?? [],
      cta: cta(section.cta)
    };
  }
  if (section._type === "warrantyConditionGrid") {
    return {
      _key: section._key ?? key("section"),
      _type: "warrantyConditionGrid",
      header: section.header ?? null,
      items: section.items?.map((item) => ({
        _key: item._key ?? key("warrantyCondition"),
        _type: "warrantyConditionItem",
        title: item.title,
        body: item.body,
        tone: item.tone ?? "covered",
        icon: item.icon ?? null
      })) ?? []
    };
  }
  if (section._type === "warrantyNoticeSection") {
    return {
      _key: section._key ?? key("section"),
      _type: "warrantyNoticeSection",
      anchorId: section.anchorId ?? null,
      header: section.header ?? null,
      body: Array.isArray(section.body) ? section.body : [block(section.body ?? "")],
      badgeLabel: section.badgeLabel ?? null
    };
  }
  if (section._type === "warrantyClaimPrep") {
    return {
      _key: section._key ?? key("section"),
      _type: "warrantyClaimPrep",
      anchorId: section.anchorId ?? null,
      header: section.header ?? null,
      items: section.items?.map((item) => ({
        _key: item._key ?? key("warrantyPrep"),
        _type: "warrantyClaimPrepItem",
        title: item.title,
        body: item.body,
        icon: item.icon ?? null
      })) ?? [],
      ctaGroup: ctaGroup(section.ctaGroup)
    };
  }
  return {
    _key: section._key ?? key("section"),
    ...section,
    cta: cta(section.cta),
    primary: cta(section.primary),
    secondary: cta(section.secondary),
    items: section.items?.map((item) => ({ _key: item._key ?? key("item"), ...item, body: Array.isArray(item.body) ? item.body : [block(item.body ?? "")] })) ?? section.items
  };
}

async function uploadKnownAssets() {
  const client = getClient();
  const refs = new Map();
  const knownFiles = [
    ["petType-dog-icon", join(mediaDir, "pet-types", "dog", "icon.svg"), "file"],
    ["petType-cat-icon", join(mediaDir, "pet-types", "cat", "icon.svg"), "file"],
    ["petType-rabbit-icon", join(mediaDir, "pet-types", "rabbit", "icon.svg"), "file"]
  ];

  const existingFiles = [...knownFiles, ...discoverApprovedMediaAssets()].filter(([, filePath]) => existsSync(filePath));
  const progress = createProgress("Known media assets", existingFiles.length);

  for (const [assetKey, filePath, assetType] of existingFiles) {
    const asset = await client.assets.upload(assetType, createReadStream(filePath), {
      filename: `${assetKey}${extensionFromPath(filePath)}`,
      contentType: contentTypeFromPath(filePath)
    });
    refs.set(assetKey, asset._id);
    progress.tick(`Uploaded ${assetKey}`);
  }

  return refs;
}

function discoverApprovedMediaAssets() {
  const files = listFiles(mediaDir);
  return files
    .map((filePath) => [assetKeyFromApprovedMediaPath(filePath), filePath, "image"])
    .filter(([assetKey]) => Boolean(assetKey));
}

function listFiles(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir).flatMap((entry) => {
    const entryPath = join(dir, entry);
    const stats = statSync(entryPath);
    return stats.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

function assetKeyFromApprovedMediaPath(filePath) {
  const relativePath = filePath.replace(`${mediaDir}\\`, "").replaceAll("\\", "/");
  const parts = relativePath.split("/");
  const fileBase = parts.at(-1)?.replace(/\.[^.]+$/, "");

  if (parts[0] === "pets" && parts[2] === "images" && fileBase) {
    return `pet-${parts[1]}-image-${fileBase}`;
  }

  if (parts[0] === "owners" && parts[2] === "images" && fileBase === "portrait") {
    return `owner-${parts[1]}-portrait`;
  }

  if (parts[0] === "pages" && parts[1] === "home" && parts[2] === "images" && fileBase) {
    return `home-${fileBase}`;
  }

  if (parts[0] === "pages" && parts[2] === "images" && fileBase === "hero") {
    return `${parts[1]}-hero`;
  }

  return null;
}

function extensionFromPath(filePath) {
  const match = filePath.match(/\.[^.]+$/);
  return match?.[0] ?? "";
}

function contentTypeFromPath(filePath) {
  const extension = extensionFromPath(filePath).toLowerCase();
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";
  return "image/png";
}

async function upsertBatch(docs, context) {
  const client = getClient();
  const resolvedDocs = docs.map((doc) => resolveReferences(doc, context));
  const existingBySeedKey = await fetchExistingDocumentsBySeedKey(client, resolvedDocs);

  for (const chunk of chunkArray(resolvedDocs, documentMutationChunkSize)) {
    const mutations = chunk.map((doc) => {
      const existing = existingBySeedKey.get(doc.seedKey);
      return existing?._id
        ? { patch: { id: existing._id, set: doc } }
        : { create: doc };
    });

    await client.mutate(mutations);

    chunk.forEach((doc) => {
      context.progress.tick(`Upserted ${doc._type}: ${doc.seedKey}`);
    });
  }

  await hydrateSeedRefs(client, resolvedDocs, context);
}

async function upsertSingletons(docs, context) {
  const client = getClient();
  const resolvedDocs = docs.map((doc) => resolveReferences(doc, context));

  for (const chunk of chunkArray(resolvedDocs, documentMutationChunkSize)) {
    const mutations = chunk.flatMap((doc) => [
      { createIfNotExists: { _id: doc._id, _type: doc._type } },
      { patch: { id: doc._id, set: doc } }
    ]);

    await client.mutate(mutations);

    chunk.forEach((doc) => {
      if (doc.seedKey) context.refsBySeedKey.set(doc.seedKey, doc._id);
      context.progress.tick(`Upserted ${doc._type}: ${doc._id}`);
    });
  }
}

async function fetchExistingDocumentsBySeedKey(client, docs) {
  const seedKeys = docs.map((doc) => doc.seedKey).filter(Boolean);
  if (seedKeys.length === 0) return new Map();

  const existingDocs = await client.fetch(`*[_type == $type && seedKey in $seedKeys]{_id, seedKey}`, {
    type: docs[0]?._type,
    seedKeys
  });

  return new Map(existingDocs.map((doc) => [doc.seedKey, doc]));
}

async function hydrateSeedRefs(client, docs, context) {
  const seedKeys = docs.map((doc) => doc.seedKey).filter(Boolean);
  if (seedKeys.length === 0) return;

  const savedDocs = await client.fetch(`*[_type == $type && seedKey in $seedKeys]{_id, seedKey}`, {
    type: docs[0]?._type,
    seedKeys
  });

  savedDocs.forEach((doc) => {
    context.refsBySeedKey.set(doc.seedKey, doc._id);
  });
}

async function hydrateAllSeedRefs(client, context) {
  const savedDocs = await client.fetch(`*[_type in ["petType", "owner", "pet", "testimonial", "formDefinition", "marketingPage"] && defined(seedKey)]{_id, seedKey}`);

  savedDocs.forEach((doc) => {
    context.refsBySeedKey.set(doc.seedKey, doc._id);
  });
}

async function preserveExistingPageMedia(docs) {
  const client = getClient();

  for (const doc of docs) {
    if (!["siteSettings", "homePage", "petIndexPage", "systemPage", "marketingPage"].includes(doc._type)) continue;

    const existing = doc._id
      ? await client.fetch(`*[_id == $id][0]`, { id: doc._id })
      : await client.fetch(`*[_type == $type && seedKey == $seedKey][0]`, { type: doc._type, seedKey: doc.seedKey });

    if (existing) {
      preserveImageWithAltFields(doc, existing);
    }
  }
}

function preserveImageWithAltFields(value, existingValue) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const matchingExistingItem = item?._key && Array.isArray(existingValue)
        ? existingValue.find((existingItem) => existingItem?._key === item._key)
        : existingValue?.[index];
      preserveImageWithAltFields(item, matchingExistingItem);
    });
    return;
  }

  if (!value || typeof value !== "object") return;

  if (value._type === "imageWithAlt" && !value.image?.asset?._ref && existingValue?.image?.asset?._ref) {
    value.image = existingValue.image;
  }

  for (const [keyName, child] of Object.entries(value)) {
    preserveImageWithAltFields(child, existingValue?.[keyName]);
  }
}

async function purgeSeedDocuments() {
  const client = getClient();
  const singletonIds = ["siteSettings", "homePage", "petIndexPage", "systemPage-notFound", "systemPage-serverError", "systemPage-genericError"];
  const purgeOrder = ["marketingPage", "systemPage", "homePage", "petIndexPage", "siteSettings", "formDefinition", "testimonial", "pet", "owner", "petType"];
  const docs = await client.fetch(`*[(defined(seedKey) || _id in $singletonIds) && !(_id in path("drafts.**"))]{_id, _type, seedKey}`, { singletonIds });
  const orderedDocs = docs.sort((a, b) => purgeOrder.indexOf(a._type) - purgeOrder.indexOf(b._type));
  const progress = createProgress("Purge seeded documents", orderedDocs.length);

  if (orderedDocs.length === 0) {
    console.log(color.warning("No seeded documents found to purge."));
    return;
  }

  console.log(color.warning(`Purging ${orderedDocs.length} existing seeded documents before writing fresh seed data.`));

  for (const chunk of chunkArray(orderedDocs, deleteMutationChunkSize)) {
    await client.mutate(chunk.map((doc) => ({ delete: { id: doc._id } })));

    chunk.forEach((doc) => {
      progress.tick(`Deleted ${doc._type}: ${doc.seedKey ?? doc._id}`);
    });
  }
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function createProgress(label, total) {
  let processed = 0;
  if (total === 0) {
    console.log(`${color.heading(label)}: ${color.warning("nothing to process")}`);
  }

  return {
    tick(message) {
      processed += 1;
      const remaining = Math.max(total - processed, 0);
      console.log(`${color.heading(label)}: ${color.success(String(processed))}/${total} processed, ${color.warning(String(remaining))} remaining - ${message}`);
    }
  };
}

function writePreviewFiles(documents, options = {}) {
  const previewDir = join(generatedDir, "preview");
  mkdirSync(previewDir, { recursive: true });
  const actualPetCount = documents.filter((doc) => doc._type === "pet").length;

  const summary = {
    generatedAt: new Date().toISOString(),
    requestedPetCount: options.petCount ?? actualPetCount,
    actualPetCount,
    mediaScope: options.mediaScope ?? "all",
    totalDocuments: documents.length,
    documentsByType: documents.reduce((counts, doc) => {
      counts[doc._type] = (counts[doc._type] ?? 0) + 1;
      return counts;
    }, {}),
    samplePets: documents
      .filter((doc) => doc._type === "pet")
      .slice(0, 10)
      .map((pet) => ({
        seedKey: pet.seedKey,
        name: pet.name,
        slug: pet.slug?.current,
        ownerSeedKey: pet.ownerSeedKey,
        petTypeSeedKey: pet.petTypeSeedKey,
        availabilityStatus: pet.availabilityStatus
      }))
  };

  writeJson(join(previewDir, "summary.json"), summary);
  writeJson(join(previewDir, "documents.json"), documents);
  writeJson(join(previewDir, "media-prompts.json"), buildMediaPrompts(documents, { mediaScope: options.mediaScope }));

  console.log(`Preview files written to ${color.path(previewDir)}`);
  console.log(`Prepared ${color.success(String(documents.length))} documents for review, including ${color.success(String(actualPetCount))} pets.`);
  console.log(`Prepared media prompts with ${color.success(options.mediaScope ?? "all")} scope.`);
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function buildMediaPrompts(documents, options = {}) {
  const mediaScope = options.mediaScope ?? "all";
  const pets = documents.filter((doc) => doc._type === "pet");
  const owners = mediaScope === "all" ? documents.filter((doc) => doc._type === "owner") : [];
  const pages = mediaScope === "all" ? documents.filter((doc) => ["homePage", "marketingPage", "petIndexPage", "systemPage"].includes(doc._type)) : [];

  return {
    generatedAt: new Date().toISOString(),
    mediaScope,
    defaults: {
      provider: "gemini",
      model: "gemini-2.5-flash-image",
      size: "1024x1024",
      petImageCountRange: "5-10"
    },
    pets: pets.map((pet, index) => {
      const imageCount = imageCountForPetIndex(index);
      return {
        seedKey: pet.seedKey,
        slug: pet.slug?.current,
        name: pet.name,
        breed: pet.breed,
        visualIdentity: pet.visualIdentity,
        imageCount,
        outputDirectory: `sanity/seed/generated/media/pets/${pet.slug?.current}/images/`,
        approvedDirectory: `sanity/seed/media/pets/${pet.slug?.current}/images/`,
        videoPrompt: buildVideoPrompt(pet),
        imagePrompts: Array.from({ length: imageCount }, (_, promptIndex) => ({
          fileName: `${String(promptIndex + 1).padStart(2, "0")}.png`,
          prompt: buildPetImagePrompt(pet, promptIndex)
        }))
      };
    }),
    owners: owners.map((owner) => ({
      seedKey: owner.seedKey,
      slug: owner.slug?.current,
      name: owner.name,
      outputDirectory: `sanity/seed/generated/media/owners/${owner.slug?.current}/images/`,
      approvedDirectory: `sanity/seed/media/owners/${owner.slug?.current}/images/`,
      imagePrompts: [
        {
          fileName: "portrait.png",
          prompt: `Create a photorealistic casual phone selfie of ${owner.name}, a Pet Share owner. It should look like a real person taking or receiving an informal everyday selfie in natural light, friendly expression, slightly imperfect phone-camera framing, realistic skin texture, casual clothing, bright approachable mood. No animated, cartoon, illustration, 3D render, vector, mascot, text, logo, watermark, border, frame, or poster styling.`
        }
      ]
    })),
    pages: pages.map((page) => ({
      seedKey: page.seedKey ?? page._id,
      title: page.title,
      outputDirectory: `sanity/seed/generated/media/pages/${page.seedKey ?? page._id}/images/`,
      approvedDirectory: `sanity/seed/media/pages/${page.seedKey ?? page._id}/images/`,
      imagePrompts: [
        {
          fileName: "hero.png",
          prompt: `Create photorealistic banner background elements for a Pet Share page titled "${page.title}". This should be usable behind website hero text, not a finished poster or complete UI. Use loose pet-related objects, soft natural light, bright matte colors, airy negative space, subtle glassmorphism-friendly highlights, and playful satirical pet-share energy. Leave open space for overlaid text. No text, logo, watermark, border, frame, UI layout, caption area, or poster composition.`
        }
      ]
    }))
  };
}

function buildPetImagePrompt(pet, promptIndex) {
  const sceneVariants = [
    "three-quarter front angle in a lived-in living room with soft window light",
    "clean side profile near a doorway, showing the full body shape",
    "slight high-angle three-quarter view like the owner quickly snapped the photo from above",
    "low-angle full-body standing shot with the pet turned slightly away from camera",
    "off-center side angle during a candid household moment",
    "relaxed side-lying pose on a couch, rug, blanket, or floor",
    "full-body side angle near a simple blanket or leash",
    "three-quarter seated pose looking just off camera",
    "casual close-up from a slight side angle, not straight-on",
    "wider candid environmental snapshot in a real home setting"
  ];

  return `Create a photorealistic full-bleed square candid phone-camera snapshot of ${pet.name} only, like the owner casually snapped a random everyday photo. The image should feel real, informal, slightly imperfect, and not professionally staged. Natural household lighting, believable phone-camera perspective, mild motion softness or imperfect framing is acceptable, but keep the pet clear and appealing. Use varied pet photography angles across the image set; this shot should be a ${sceneVariants[promptIndex % sceneVariants.length]}. Avoid making every image a straight-on headshot. The pet must clearly look like ${withArticle(pet.breed)} and should preserve that breed or variety's recognizable shape, coat, coloring, scale, body type, and species-specific traits. Keep this exact visual identity consistent across every image for this pet: primary color ${pet.visualIdentity.primaryColor}, secondary detail ${pet.visualIdentity.secondaryColor}, distinctive marking ${pet.visualIdentity.markings}, and ${pet.visualIdentity.eyeColor}. Do not change those colors or markings between shots. Bright, friendly, realistic home-photo style with natural textures, casual composition, and subtle silliness. Use a normal home environment with no handheld props, no flat rectangular props, no readable items, no printed items, and no office-like items. Do not use professional studio lighting, editorial portrait styling, animated, cartoon, illustration, 3D render, vector, mascot, toy, plush, fantasy, or painted styles. Do not create borders, frames, posters, stickers, product mockups, UI layouts, caption areas, labels, badges, text, logos, watermarks, drop shadow frames, or white mats. The output should be just the pet photo edge-to-edge.`;
}

function buildVideoPrompt(pet) {
  return `Short low-frame-rate looping clip concept for ${pet.name}, who must clearly look like ${withArticle(pet.breed)}: a full-bleed pet-only moment where the pet makes a tiny dramatic movement, the background stays airy and friendly, and the tone is playful but not chaotic. No card, border, frame, UI, text, logo, or watermark.`;
}

function resolveReferences(value, context) {
  if (Array.isArray(value)) return value.map((item) => resolveReferences(item, context)).filter(Boolean);
  if (!value || typeof value !== "object") return value;

  if (value.featuredPetsSeedKeys) {
    value.featuredPets = value.featuredPetsSeedKeys.map((seedKey) => ref(seedKey, context)).filter(Boolean);
    delete value.featuredPetsSeedKeys;
  }
  if (value.featuredOwnersSeedKeys) {
    value.featuredOwners = value.featuredOwnersSeedKeys.map((seedKey) => ref(seedKey, context)).filter(Boolean);
    delete value.featuredOwnersSeedKeys;
  }
  if (value.testimonialSeedIds) {
    value.testimonials = value.testimonialSeedIds.map((seedKey) => ref(seedKey, context)).filter(Boolean);
    delete value.testimonialSeedIds;
  }
  if (value.testimonialsSeedKeys) {
    value.testimonials = value.testimonialsSeedKeys.map((seedKey) => ref(seedKey, context)).filter(Boolean);
    delete value.testimonialsSeedKeys;
  }
  if (value.petTypeSeedKey) {
    value.petType = ref(value.petTypeSeedKey, context);
    delete value.petTypeSeedKey;
  }
  if (value.ownerSeedKey) {
    value.owner = ref(value.ownerSeedKey, context);
    delete value.ownerSeedKey;
  }
  if (value.submittedByOwnerSeedKey) {
    value.submittedBy = ref(value.submittedByOwnerSeedKey, context);
    delete value.submittedByOwnerSeedKey;
  }
  if (value.relatedPetSeedKey) {
    value.relatedPet = ref(value.relatedPetSeedKey, context);
    delete value.relatedPetSeedKey;
  }
  if (value.relatedOwnerSeedKey) {
    value.relatedOwner = ref(value.relatedOwnerSeedKey, context);
    delete value.relatedOwnerSeedKey;
  }
  if (value.customIconAssetKey) {
    const assetRef = context.assetRefs.get(value.customIconAssetKey);
    if (assetRef) {
      value.customIcon = { _type: "file", asset: { _type: "reference", _ref: assetRef } };
    }
    delete value.customIconAssetKey;
  }
  if (value._type === "imageWithAlt" && Object.hasOwn(value, "seedAssetKey")) {
    const assetRef = context.assetRefs.get(value.seedAssetKey);
    if (assetRef) {
      value.image = { _type: "image", asset: { _type: "reference", _ref: assetRef } };
    }
    delete value.seedAssetKey;
  }

  for (const [keyName, child] of Object.entries(value)) {
    value[keyName] = resolveReferences(child, context);
  }

  return value;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

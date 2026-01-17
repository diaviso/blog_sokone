import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const articleData = [
  {
    title: "La puissance de la prière quotidienne",
    slug: "puissance-priere-quotidienne",
    excerpt: "Découvrez comment la prière quotidienne peut transformer votre vie spirituelle et vous rapprocher de Dieu.",
    content: `<h2>L'importance de la prière</h2><p>La prière est le fondement de notre relation avec Dieu. Elle nous permet de communiquer avec notre Créateur, de lui confier nos joies et nos peines, et de recevoir sa guidance.</p><h3>Comment établir une routine de prière</h3><p>Commencez par choisir un moment fixe chaque jour. Le matin est souvent idéal car il permet de commencer la journée avec Dieu. Trouvez un endroit calme où vous ne serez pas dérangé.</p><blockquote>"Priez sans cesse" - 1 Thessaloniciens 5:17</blockquote><p>La régularité est plus importante que la durée. Même cinq minutes de prière sincère valent mieux qu'une heure de distraction.</p>`,
    category: 0,
    tags: [0, 3],
    image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800",
    views: 245
  },
  {
    title: "Méditation sur les Psaumes",
    slug: "meditation-psaumes",
    excerpt: "Une exploration profonde des Psaumes et leur pertinence pour notre vie moderne.",
    content: `<h2>Les Psaumes : poésie divine</h2><p>Les Psaumes sont un trésor de sagesse spirituelle. Écrits il y a des millénaires, ils continuent de toucher nos cœurs aujourd'hui.</p><h3>Psaume 23 : Le Seigneur est mon berger</h3><p>Ce psaume bien-aimé nous rappelle que Dieu prend soin de nous comme un berger de ses brebis. Dans les moments difficiles, nous pouvons nous reposer sur sa protection.</p><p>Prenez le temps de méditer sur un psaume chaque jour. Laissez les paroles pénétrer votre cœur et transformer votre perspective.</p>`,
    category: 2,
    tags: [1, 2],
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800",
    views: 189
  },
  {
    title: "Construire une communauté de foi",
    slug: "construire-communaute-foi",
    excerpt: "L'importance de la communauté dans notre parcours spirituel et comment y contribuer activement.",
    content: `<h2>Ensemble, nous sommes plus forts</h2><p>La foi n'est pas destinée à être vécue seul. Dieu nous a créés pour vivre en communauté, pour nous soutenir mutuellement dans notre marche spirituelle.</p><h3>Les piliers d'une communauté forte</h3><ul><li><strong>L'accueil</strong> - Chaque personne doit se sentir bienvenue</li><li><strong>Le partage</strong> - Partager nos joies et nos fardeaux</li><li><strong>La prière commune</strong> - Prier les uns pour les autres</li><li><strong>Le service</strong> - Servir ensemble notre prochain</li></ul><p>Engagez-vous dans votre communauté locale. Votre présence fait la différence.</p>`,
    category: 1,
    tags: [3, 4],
    image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800",
    views: 312
  },
  {
    title: "Le pardon : chemin vers la liberté",
    slug: "pardon-chemin-liberte",
    excerpt: "Comment le pardon peut nous libérer du poids du passé et nous ouvrir à une nouvelle vie.",
    content: `<h2>Le pouvoir libérateur du pardon</h2><p>Le pardon est l'un des enseignements les plus difficiles mais aussi les plus libérateurs de notre foi. Pardonner ne signifie pas oublier ou excuser, mais choisir de ne plus être prisonnier de la rancœur.</p><h3>Étapes vers le pardon</h3><p>Reconnaissez d'abord votre douleur. Ensuite, prenez la décision consciente de pardonner. Enfin, remettez la situation entre les mains de Dieu.</p><blockquote>"Pardonnez-vous réciproquement, comme Dieu vous a pardonné en Christ" - Éphésiens 4:32</blockquote>`,
    category: 3,
    tags: [3, 4],
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
    views: 278
  },
  {
    title: "Les enseignements de Jésus sur l'amour",
    slug: "enseignements-jesus-amour",
    excerpt: "Redécouvrez le message central de Jésus : l'amour inconditionnel pour Dieu et pour notre prochain.",
    content: `<h2>Le plus grand commandement</h2><p>Quand on a demandé à Jésus quel était le plus grand commandement, il a répondu : "Tu aimeras le Seigneur ton Dieu de tout ton cœur, de toute ton âme et de toute ta pensée. Et tu aimeras ton prochain comme toi-même."</p><h3>L'amour en action</h3><p>L'amour selon Jésus n'est pas un sentiment passif. C'est une action, un choix quotidien de mettre les autres avant nous-mêmes.</p><p>Comment pouvez-vous montrer l'amour de Christ aujourd'hui ?</p>`,
    category: 2,
    tags: [2, 3],
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800",
    views: 423
  },
  {
    title: "Trouver la paix dans la tempête",
    slug: "trouver-paix-tempete",
    excerpt: "Comment maintenir notre foi et notre paix intérieure face aux défis de la vie.",
    content: `<h2>La paix qui surpasse toute intelligence</h2><p>Les tempêtes de la vie sont inévitables. Mais au milieu de ces tempêtes, nous pouvons trouver une paix profonde en nous ancrant dans notre foi.</p><h3>Jésus calme la tempête</h3><p>Souvenez-vous de l'histoire où Jésus dormait pendant que ses disciples paniquaient face à la tempête. D'un mot, il a calmé les vents et les vagues. Il peut faire de même dans nos vies.</p><blockquote>"Je vous laisse la paix, je vous donne ma paix" - Jean 14:27</blockquote>`,
    category: 3,
    tags: [0, 1],
    image: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800",
    views: 356
  },
  {
    title: "La gratitude : clé du bonheur spirituel",
    slug: "gratitude-cle-bonheur",
    excerpt: "Cultivez une attitude de gratitude pour transformer votre perspective et approfondir votre foi.",
    content: `<h2>Rendez grâce en toutes circonstances</h2><p>La gratitude est une discipline spirituelle puissante. Elle nous aide à voir les bénédictions de Dieu même dans les moments difficiles.</p><h3>Pratique quotidienne</h3><p>Commencez chaque journée en listant trois choses pour lesquelles vous êtes reconnaissant. Cette simple pratique peut transformer votre état d'esprit.</p><ul><li>Remerciez pour les petites choses</li><li>Exprimez votre gratitude aux autres</li><li>Tenez un journal de gratitude</li></ul>`,
    category: 3,
    tags: [1, 3],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    views: 198
  },
  {
    title: "Le jeûne spirituel : guide pratique",
    slug: "jeune-spirituel-guide",
    excerpt: "Découvrez les bienfaits du jeûne spirituel et comment le pratiquer de manière saine.",
    content: `<h2>Le jeûne dans la tradition chrétienne</h2><p>Le jeûne est une pratique ancienne qui nous aide à nous concentrer sur Dieu en mettant de côté nos besoins physiques temporairement.</p><h3>Types de jeûne</h3><ul><li><strong>Jeûne total</strong> - Abstinence de nourriture et d'eau (courte durée)</li><li><strong>Jeûne partiel</strong> - Élimination de certains aliments</li><li><strong>Jeûne de médias</strong> - Se déconnecter pour se reconnecter à Dieu</li></ul><p>Consultez toujours un médecin avant d'entreprendre un jeûne prolongé.</p>`,
    category: 2,
    tags: [0, 4],
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800",
    views: 167
  },
  {
    title: "Événement communautaire : Fête de la moisson",
    slug: "fete-moisson-2024",
    excerpt: "Rejoignez-nous pour notre grande fête annuelle de la moisson, un moment de partage et de célébration.",
    content: `<h2>Célébrons ensemble !</h2><p>Notre fête annuelle de la moisson approche ! C'est l'occasion de remercier Dieu pour ses bénédictions et de partager un moment convivial en communauté.</p><h3>Programme</h3><ul><li>10h00 - Culte d'action de grâce</li><li>12h00 - Repas partagé</li><li>14h00 - Activités pour les enfants</li><li>16h00 - Concert de louange</li></ul><p>Apportez un plat à partager et votre bonne humeur !</p>`,
    category: 1,
    tags: [3],
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
    views: 445
  },
  {
    title: "L'espérance dans les moments sombres",
    slug: "esperance-moments-sombres",
    excerpt: "Comment garder l'espérance quand tout semble perdu, à la lumière de notre foi.",
    content: `<h2>L'espérance ne déçoit pas</h2><p>Dans les moments les plus sombres de notre vie, l'espérance peut sembler lointaine. Pourtant, c'est précisément dans ces moments que notre foi est appelée à briller.</p><h3>Sources d'espérance</h3><p>La Bible regorge de promesses qui peuvent nourrir notre espérance. Méditez sur ces versets quand le découragement vous guette.</p><blockquote>"Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance." - Jérémie 29:11</blockquote>`,
    category: 0,
    tags: [2, 3],
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800",
    views: 289
  },
  {
    title: "La sagesse des Proverbes",
    slug: "sagesse-proverbes",
    excerpt: "Explorez la sagesse intemporelle du livre des Proverbes pour une vie équilibrée.",
    content: `<h2>La sagesse commence par la crainte de l'Éternel</h2><p>Le livre des Proverbes est un trésor de sagesse pratique pour la vie quotidienne. Ces enseignements anciens restent pertinents aujourd'hui.</p><h3>Proverbes pour la vie moderne</h3><ul><li>"Confie-toi en l'Éternel de tout ton cœur"</li><li>"La langue douce est un arbre de vie"</li><li>"Celui qui marche avec les sages devient sage"</li></ul><p>Lisez un chapitre des Proverbes chaque jour pendant un mois.</p>`,
    category: 2,
    tags: [2, 4],
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    views: 234
  },
  {
    title: "Témoignage : Ma rencontre avec Dieu",
    slug: "temoignage-rencontre-dieu",
    excerpt: "Un témoignage personnel sur la façon dont Dieu a transformé une vie ordinaire en quelque chose d'extraordinaire.",
    content: `<h2>Une vie transformée</h2><p>Je n'étais pas croyant. Ma vie était vide de sens, remplie de questions sans réponses. Puis un jour, tout a changé.</p><h3>Le tournant</h3><p>C'était un dimanche ordinaire quand un ami m'a invité à l'église. Je n'avais aucune attente, mais ce que j'ai vécu ce jour-là a bouleversé ma vie.</p><p>Dieu m'a rencontré là où j'étais, avec mes doutes et mes questions. Il ne m'a pas jugé, il m'a aimé.</p><blockquote>"Si quelqu'un est en Christ, il est une nouvelle créature" - 2 Corinthiens 5:17</blockquote>`,
    category: 0,
    tags: [3, 4],
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800",
    views: 567
  },
  {
    title: "Guide de lecture biblique pour débutants",
    slug: "guide-lecture-biblique-debutants",
    excerpt: "Par où commencer quand on veut lire la Bible ? Un guide pratique pour les nouveaux lecteurs.",
    content: `<h2>Commencer votre voyage biblique</h2><p>La Bible peut sembler intimidante au premier abord. Avec 66 livres et des milliers de pages, par où commencer ?</p><h3>Suggestions de lecture</h3><ul><li><strong>Évangile de Jean</strong> - Une introduction à la vie de Jésus</li><li><strong>Psaumes</strong> - Pour la prière et la méditation</li><li><strong>Proverbes</strong> - Pour la sagesse quotidienne</li><li><strong>Romains</strong> - Pour comprendre la foi chrétienne</li></ul><p>Commencez par 15 minutes par jour et augmentez progressivement.</p>`,
    category: 2,
    tags: [2, 4],
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=800",
    views: 412
  },
  {
    title: "L'art de l'écoute dans la prière",
    slug: "art-ecoute-priere",
    excerpt: "La prière n'est pas qu'un monologue. Apprenez à écouter la voix de Dieu dans le silence.",
    content: `<h2>Écouter avant de parler</h2><p>Nous sommes souvent prompts à parler à Dieu, mais prenons-nous le temps de l'écouter ? La prière contemplative nous invite au silence.</p><h3>Pratique du silence</h3><p>Trouvez un endroit calme. Fermez les yeux. Respirez profondément. Puis, simplement, attendez. Dieu parle souvent dans le murmure doux.</p><blockquote>"Arrêtez, et sachez que je suis Dieu" - Psaume 46:10</blockquote><p>Commencez par 5 minutes de silence et augmentez progressivement.</p>`,
    category: 3,
    tags: [0, 1],
    image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800",
    views: 178
  },
  {
    title: "Servir les autres : l'exemple de Jésus",
    slug: "servir-autres-exemple-jesus",
    excerpt: "Jésus nous a montré l'exemple du service. Comment pouvons-nous suivre ses pas ?",
    content: `<h2>Le serviteur de tous</h2><p>Jésus, le Roi des rois, s'est agenouillé pour laver les pieds de ses disciples. Quel exemple puissant de service humble !</p><h3>Opportunités de service</h3><ul><li>Bénévolat dans une association caritative</li><li>Aide aux personnes âgées de votre quartier</li><li>Soutien aux familles dans le besoin</li><li>Écoute attentive pour ceux qui souffrent</li></ul><p>Le service n'a pas besoin d'être grandiose. Les petits gestes comptent.</p>`,
    category: 1,
    tags: [3, 4],
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
    views: 298
  },
  {
    title: "La foi des enfants",
    slug: "foi-enfants",
    excerpt: "Que pouvons-nous apprendre de la foi simple et pure des enfants ?",
    content: `<h2>Comme un petit enfant</h2><p>Jésus a dit : "Laissez venir à moi les petits enfants." Il admirait leur foi simple, leur confiance totale.</p><h3>Leçons des enfants</h3><ul><li><strong>Confiance absolue</strong> - Les enfants font confiance sans réserve</li><li><strong>Émerveillement</strong> - Ils s'émerveillent de tout</li><li><strong>Pardon facile</strong> - Ils pardonnent rapidement</li><li><strong>Questions honnêtes</strong> - Ils posent des questions sans honte</li></ul><p>Retrouvons cette simplicité dans notre foi.</p>`,
    category: 3,
    tags: [3],
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
    views: 234
  },
  {
    title: "Retraite spirituelle : se ressourcer",
    slug: "retraite-spirituelle-ressourcer",
    excerpt: "L'importance de prendre du temps à part pour renouveler notre relation avec Dieu.",
    content: `<h2>S'éloigner pour mieux revenir</h2><p>Même Jésus prenait du temps à part pour prier. Dans notre monde hyperconnecté, les retraites spirituelles sont plus nécessaires que jamais.</p><h3>Planifier votre retraite</h3><ul><li>Choisissez un lieu calme, proche de la nature si possible</li><li>Déconnectez-vous des écrans</li><li>Apportez votre Bible et un journal</li><li>Prévoyez du temps pour le silence</li></ul><p>Même une journée peut faire une grande différence.</p>`,
    category: 1,
    tags: [0, 1],
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
    views: 189
  },
  {
    title: "Les béatitudes expliquées",
    slug: "beatitudes-expliquees",
    excerpt: "Une exploration approfondie des béatitudes et leur application dans notre vie quotidienne.",
    content: `<h2>Le sermon sur la montagne</h2><p>Les béatitudes sont au cœur de l'enseignement de Jésus. Elles renversent les valeurs du monde pour nous montrer le chemin du Royaume.</p><h3>Heureux les pauvres en esprit</h3><p>Être pauvre en esprit, c'est reconnaître notre besoin de Dieu. C'est l'humilité qui ouvre la porte à la grâce.</p><blockquote>"Heureux les doux, car ils hériteront la terre" - Matthieu 5:5</blockquote><p>Méditez sur une béatitude chaque semaine.</p>`,
    category: 2,
    tags: [2, 4],
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800",
    views: 345
  },
  {
    title: "Gérer le stress par la foi",
    slug: "gerer-stress-foi",
    excerpt: "Des stratégies spirituelles pour faire face au stress et à l'anxiété de la vie moderne.",
    content: `<h2>Ne vous inquiétez de rien</h2><p>Le stress est omniprésent dans notre société. Mais notre foi nous offre des ressources précieuses pour y faire face.</p><h3>Stratégies spirituelles</h3><ul><li><strong>La prière</strong> - Déposez vos fardeaux devant Dieu</li><li><strong>La méditation biblique</strong> - Ancrez-vous dans la Parole</li><li><strong>La communauté</strong> - Ne portez pas vos fardeaux seul</li><li><strong>La gratitude</strong> - Changez votre perspective</li></ul><blockquote>"Déchargez-vous sur lui de tous vos soucis, car lui-même prend soin de vous" - 1 Pierre 5:7</blockquote>`,
    category: 3,
    tags: [0, 1],
    image: "https://images.unsplash.com/photo-1499728603263-13571c4f4a4f?w=800",
    views: 423
  },
  {
    title: "L'histoire de Ruth : fidélité et rédemption",
    slug: "histoire-ruth-fidelite-redemption",
    excerpt: "Découvrez l'histoire inspirante de Ruth et les leçons qu'elle nous enseigne sur la fidélité.",
    content: `<h2>Une histoire d'amour et de loyauté</h2><p>Le livre de Ruth est une perle de l'Ancien Testament. Cette histoire de fidélité, d'amour et de rédemption continue de nous inspirer.</p><h3>Les personnages</h3><ul><li><strong>Ruth</strong> - La Moabite fidèle</li><li><strong>Naomi</strong> - La belle-mère aimante</li><li><strong>Boaz</strong> - Le rédempteur généreux</li></ul><blockquote>"Où tu iras j'irai, où tu demeureras je demeurerai ; ton peuple sera mon peuple, et ton Dieu sera mon Dieu" - Ruth 1:16</blockquote>`,
    category: 2,
    tags: [2, 3],
    image: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800",
    views: 267
  },
  {
    title: "Préparer son cœur pour Noël",
    slug: "preparer-coeur-noel",
    excerpt: "Au-delà des décorations et des cadeaux, comment préparer spirituellement la fête de Noël.",
    content: `<h2>L'Avent : un temps de préparation</h2><p>Noël approche avec son cortège de festivités. Mais au milieu de l'agitation, prenons le temps de préparer nos cœurs.</p><h3>Suggestions pour l'Avent</h3><ul><li>Allumez une bougie de l'Avent chaque semaine</li><li>Lisez les prophéties messianiques</li><li>Pratiquez la générosité envers les plus démunis</li><li>Simplifiez pour vous concentrer sur l'essentiel</li></ul><p>Noël célèbre la venue de Dieu parmi nous. Quelle merveille !</p>`,
    category: 0,
    tags: [0, 3],
    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800",
    views: 534
  },
  {
    title: "Le pouvoir de la louange",
    slug: "pouvoir-louange",
    excerpt: "Comment la louange peut transformer notre perspective et nous rapprocher de Dieu.",
    content: `<h2>Louez l'Éternel !</h2><p>La louange est plus qu'un chant. C'est une attitude du cœur qui reconnaît la grandeur de Dieu et lui rend gloire.</p><h3>Formes de louange</h3><ul><li><strong>Le chant</strong> - Exprimez votre joie en musique</li><li><strong>La proclamation</strong> - Déclarez les attributs de Dieu</li><li><strong>L'action de grâce</strong> - Remerciez pour ses bienfaits</li><li><strong>Le silence</strong> - Adorez dans le recueillement</li></ul><p>La louange change notre atmosphère spirituelle.</p>`,
    category: 0,
    tags: [0, 3],
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
    views: 312
  },
  {
    title: "Comprendre la grâce divine",
    slug: "comprendre-grace-divine",
    excerpt: "La grâce est au cœur de l'Évangile. Explorons ce concept fondamental de notre foi.",
    content: `<h2>La grâce : un don immérité</h2><p>La grâce est la faveur imméritée de Dieu envers nous. Nous ne pouvons pas la gagner, seulement la recevoir avec gratitude.</p><h3>Aspects de la grâce</h3><ul><li><strong>Grâce salvatrice</strong> - Qui nous sauve du péché</li><li><strong>Grâce sanctifiante</strong> - Qui nous transforme</li><li><strong>Grâce suffisante</strong> - Qui nous soutient</li></ul><blockquote>"C'est par la grâce que vous êtes sauvés, par le moyen de la foi" - Éphésiens 2:8</blockquote>`,
    category: 2,
    tags: [2, 4],
    image: "https://images.unsplash.com/photo-1490730141103-6cac27abb37f?w=800",
    views: 289
  },
  {
    title: "Bénévoles recherchés : Banque alimentaire",
    slug: "benevoles-banque-alimentaire",
    excerpt: "Notre banque alimentaire a besoin de vous ! Rejoignez notre équipe de bénévoles.",
    content: `<h2>Ensemble contre la faim</h2><p>Notre banque alimentaire communautaire distribue des repas à des centaines de familles chaque mois. Nous avons besoin de bénévoles !</p><h3>Comment aider</h3><ul><li>Tri et emballage des denrées</li><li>Distribution aux familles</li><li>Collecte de dons</li><li>Transport</li></ul><p>Même quelques heures par mois font une différence. Contactez-nous pour vous inscrire !</p>`,
    category: 1,
    tags: [4],
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
    views: 178
  },
  {
    title: "La patience : fruit de l'Esprit",
    slug: "patience-fruit-esprit",
    excerpt: "Dans un monde d'instantanéité, redécouvrez la vertu de la patience.",
    content: `<h2>Attendre avec confiance</h2><p>La patience est l'un des fruits de l'Esprit mentionnés par Paul. Dans notre culture de l'immédiat, elle est plus précieuse que jamais.</p><h3>Cultiver la patience</h3><p>La patience n'est pas passive. C'est une attente active, confiante en la fidélité de Dieu.</p><ul><li>Acceptez que tout a son temps</li><li>Faites confiance au timing de Dieu</li><li>Utilisez l'attente pour grandir</li></ul><blockquote>"Mais le fruit de l'Esprit, c'est l'amour, la joie, la paix, la patience..." - Galates 5:22</blockquote>`,
    category: 3,
    tags: [1, 4],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    views: 234
  },
  {
    title: "Prier pour nos dirigeants",
    slug: "prier-pour-dirigeants",
    excerpt: "L'importance de la prière d'intercession pour ceux qui nous gouvernent.",
    content: `<h2>Une responsabilité chrétienne</h2><p>La Bible nous exhorte à prier pour nos dirigeants, quelle que soit notre opinion politique. C'est un acte de foi et d'obéissance.</p><h3>Comment prier</h3><ul><li>Pour leur sagesse dans les décisions</li><li>Pour leur intégrité</li><li>Pour la paix et la justice</li><li>Pour qu'ils connaissent Dieu</li></ul><blockquote>"J'exhorte donc, avant toutes choses, à faire des prières... pour les rois et pour tous ceux qui sont élevés en dignité" - 1 Timothée 2:1-2</blockquote>`,
    category: 0,
    tags: [0, 4],
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800",
    views: 156
  },
  {
    title: "L'humilité : la voie de la grandeur",
    slug: "humilite-voie-grandeur",
    excerpt: "Jésus a enseigné que les premiers seront les derniers. Explorons le paradoxe de l'humilité.",
    content: `<h2>S'abaisser pour être élevé</h2><p>Dans le Royaume de Dieu, les valeurs sont inversées. L'humilité n'est pas faiblesse, c'est force sous contrôle.</p><h3>L'exemple de Jésus</h3><p>Jésus, égal à Dieu, s'est fait serviteur. Il a lavé les pieds de ses disciples. Il est mort sur une croix.</p><blockquote>"Celui qui s'élève sera abaissé, et celui qui s'abaisse sera élevé" - Luc 14:11</blockquote><p>L'humilité ouvre la porte à la grâce de Dieu.</p>`,
    category: 2,
    tags: [2, 3],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    views: 278
  },
  {
    title: "Groupe de prière du mercredi",
    slug: "groupe-priere-mercredi",
    excerpt: "Rejoignez notre groupe de prière hebdomadaire pour un temps de communion et d'intercession.",
    content: `<h2>Priez ensemble</h2><p>Chaque mercredi soir, nous nous réunissons pour prier ensemble. C'est un moment précieux de communion fraternelle et d'intercession.</p><h3>Déroulement</h3><ul><li>19h00 - Accueil et louange</li><li>19h30 - Partage des sujets de prière</li><li>20h00 - Temps de prière en petits groupes</li><li>20h30 - Clôture et rafraîchissements</li></ul><p>Tous sont les bienvenus, croyants de longue date ou nouveaux dans la foi.</p>`,
    category: 1,
    tags: [0],
    image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800",
    views: 145
  },
  {
    title: "Surmonter la peur par la foi",
    slug: "surmonter-peur-foi",
    excerpt: "La peur est universelle, mais notre foi nous donne les outils pour la surmonter.",
    content: `<h2>N'ayez pas peur</h2><p>"N'aie pas peur" est l'un des commandements les plus répétés dans la Bible. Dieu sait que nous luttons avec la peur.</p><h3>Antidotes à la peur</h3><ul><li><strong>La présence de Dieu</strong> - Il est avec nous</li><li><strong>Les promesses bibliques</strong> - Ancrez-vous dans la Parole</li><li><strong>La prière</strong> - Confiez vos craintes à Dieu</li><li><strong>La communauté</strong> - Ne restez pas seul</li></ul><blockquote>"Car ce n'est pas un esprit de timidité que Dieu nous a donné, mais un esprit de force, d'amour et de sagesse" - 2 Timothée 1:7</blockquote>`,
    category: 0,
    tags: [0, 3],
    image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800",
    views: 389
  },
  {
    title: "La joie du Seigneur est notre force",
    slug: "joie-seigneur-force",
    excerpt: "Découvrez comment la joie spirituelle peut vous fortifier dans toutes les circonstances.",
    content: `<h2>Une joie qui ne dépend pas des circonstances</h2><p>La joie du Seigneur est différente du bonheur terrestre. Elle ne dépend pas de nos circonstances mais de notre relation avec Dieu.</p><h3>Sources de joie</h3><ul><li>La certitude du salut</li><li>La présence de Dieu</li><li>L'espérance de la vie éternelle</li><li>La communion fraternelle</li></ul><blockquote>"La joie de l'Éternel sera votre force" - Néhémie 8:10</blockquote><p>Cultivez cette joie par la louange et la gratitude.</p>`,
    category: 3,
    tags: [1, 3],
    image: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=800",
    views: 312
  }
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.tagsOnArticles.deleteMany();
  await prisma.articleImage.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();

  const hashedPassword = await hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sacredblog.org" },
    update: {},
    create: {
      name: "Administrateur",
      email: "admin@sacredblog.org",
      password: hashedPassword,
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Create 5 categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Foi & Spiritualité",
        slug: "foi-spiritualite",
        description: "Articles sur la foi, la prière et la vie spirituelle",
        color: "#6366f1",
      },
    }),
    prisma.category.create({
      data: {
        name: "Communauté",
        slug: "communaute",
        description: "Actualités et événements de notre communauté",
        color: "#22c55e",
      },
    }),
    prisma.category.create({
      data: {
        name: "Enseignements",
        slug: "enseignements",
        description: "Études bibliques et enseignements spirituels",
        color: "#8b5cf6",
      },
    }),
    prisma.category.create({
      data: {
        name: "Réflexions",
        slug: "reflexions",
        description: "Méditations et réflexions personnelles",
        color: "#ec4899",
      },
    }),
    prisma.category.create({
      data: {
        name: "Témoignages",
        slug: "temoignages",
        description: "Histoires de vie et témoignages de foi",
        color: "#f59e0b",
      },
    }),
  ]);

  console.log("✅ Created 5 categories");

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Prière", slug: "priere" } }),
    prisma.tag.create({ data: { name: "Méditation", slug: "meditation" } }),
    prisma.tag.create({ data: { name: "Bible", slug: "bible" } }),
    prisma.tag.create({ data: { name: "Inspiration", slug: "inspiration" } }),
    prisma.tag.create({ data: { name: "Vie pratique", slug: "vie-pratique" } }),
  ]);

  console.log("✅ Created 5 tags");

  // Create 30 articles
  console.log("📝 Creating 30 articles...");
  
  for (let i = 0; i < articleData.length; i++) {
    const data = articleData[i];
    const publishedDate = new Date();
    publishedDate.setDate(publishedDate.getDate() - (30 - i));

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.image,
        published: true,
        publishedAt: publishedDate,
        views: data.views,
        authorId: admin.id,
        categoryId: categories[data.category].id,
        metaTitle: data.title,
        metaDescription: data.excerpt,
      },
    });

    // Link tags
    for (const tagIndex of data.tags) {
      await prisma.tagsOnArticles.create({
        data: {
          articleId: article.id,
          tagId: tags[tagIndex].id,
        },
      });
    }

    console.log(`  ✓ Created article ${i + 1}/30: ${data.title.substring(0, 40)}...`);
  }

  console.log("✅ Created 30 articles with images");

  // Create some sample comments
  const articles = await prisma.article.findMany({ take: 10 });
  const commentAuthors = ["Marie D.", "Jean-Pierre L.", "Sophie M.", "Paul R.", "Claire B."];
  const commentContents = [
    "Merci pour cet article inspirant ! Cela m'a beaucoup touché.",
    "Très beau texte, je le partage avec ma famille.",
    "Que Dieu vous bénisse pour ce partage.",
    "J'avais besoin de lire cela aujourd'hui. Merci !",
    "Article très enrichissant, j'attends les prochains avec impatience.",
  ];

  for (const article of articles) {
    const numComments = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numComments; i++) {
      await prisma.comment.create({
        data: {
          authorName: commentAuthors[Math.floor(Math.random() * commentAuthors.length)],
          authorEmail: `user${Math.floor(Math.random() * 100)}@example.com`,
          content: commentContents[Math.floor(Math.random() * commentContents.length)],
          approved: true,
          articleId: article.id,
        },
      });
    }
  }

  console.log("✅ Created sample comments");

  console.log("\n🎉 Seeding complete!");
  console.log("\n📧 Admin login credentials:");
  console.log("   Email: admin@sacredblog.org");
  console.log("   Password: admin123");
  console.log("\n📊 Summary:");
  console.log("   - 5 categories");
  console.log("   - 5 tags");
  console.log("   - 30 articles with images");
  console.log("   - Sample comments");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

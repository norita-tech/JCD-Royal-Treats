/* Internationalisation — countries, currencies, and UI translations */

const I18N = (() => {

  const COUNTRIES = {
    ch: {
      name: 'Switzerland', flag: '🇨🇭', currency: 'CHF', symbol: 'CHF ', rate: 1.000,
      /* Swiss Post Pakete — prices in CHF */
      tiers: [
        { maxKg: 1,  price: 8.50  },
        { maxKg: 2,  price: 10.50 },
        { maxKg: 5,  price: 14.50 },
        { maxKg: 10, price: 18.50 },
        { maxKg: 20, price: 24.50 },
        { maxKg: 30, price: 32.00 },
      ],
    },
    de: {
      name: 'Germany', flag: '🇩🇪', currency: 'EUR', symbol: '€', rate: 1.04,
      /* DHL Paket domestic — stored as CHF equiv (÷1.04); displays as exact EUR */
      tiers: [
        { maxKg: 5,    price: 5.28  }, /* €5.49  */
        { maxKg: 10,   price: 6.72  }, /* €6.99  */
        { maxKg: 15,   price: 9.13  }, /* €9.49  */
        { maxKg: 20,   price: 13.45 }, /* €13.99 */
        { maxKg: 31.5, price: 17.78 }, /* €18.49 */
      ],
    },
    fr: {
      name: 'France', flag: '🇫🇷', currency: 'EUR', symbol: '€', rate: 1.04,
      /* Colissimo domestic — stored as CHF equiv (÷1.04); displays as exact EUR */
      tiers: [
        { maxKg: 0.5, price: 4.86  }, /* €5.05  */
        { maxKg: 1,   price: 5.87  }, /* €6.10  */
        { maxKg: 2,   price: 7.07  }, /* €7.35  */
        { maxKg: 5,   price: 9.23  }, /* €9.60  */
        { maxKg: 10,  price: 12.50 }, /* €13.00 */
        { maxKg: 20,  price: 19.23 }, /* €20.00 */
        { maxKg: 30,  price: 26.92 }, /* €28.00 */
      ],
    },
  };

  /* ── Translations ──────────────────────────────────────────────── */
  const T = {
    en: {
      nav: { home: 'Home', menu: 'Menu', cart: 'Cart', admin: 'Admin' },
      hero: {
        badge: '🍞 Fresh • Homemade • Delicious',
        title: 'Artisan Pastries<br>Made with Love',
        sub: 'Discover the warm, rich flavours of West African pastries — freshly baked and ready for delivery to your door.',
        shopBtn: 'Shop Our Menu',
        seeBtn: 'See Featured ↓',
      },
      features: {
        q: 'Homemade Quality',  qSub: 'Every item made from scratch with love',
        d: 'Fast Delivery',     dSub: 'Fresh to your door, same day',
        i: 'Fresh Ingredients', iSub: 'Only the finest quality ingredients',
        c: 'Made with Care',    cSub: 'Every bite tells a story',
      },
      home: {
        featLabel: 'Our Bestsellers',
        featTitle: 'Featured Treats',
        featSub: "Handpicked favourites that our customers can't get enough of",
        viewAll: 'View Full Menu →',
        aboutLabel: 'Our Story',
        aboutTitle: 'Baked with Heart,<br>Served with Pride',
        aboutP1: 'JCD Royal Treats started as a passion project — bringing the authentic flavours of West African pastries to the table. Every recipe is crafted with love and passed down through generations.',
        aboutP2: 'From our famous Banana Bread to our crispy Chin Chin, every treat is made fresh with the finest ingredients. We believe great food brings people together.',
        aboutBtn: 'Explore Our Menu',
      },
      products: {
        pageTitle: '🍞 Our Full Menu',
        pageSub: 'Fresh pastries and snacks, made from scratch every day',
        all: 'All Items', baked: 'Baked', fried: 'Fried',
        savory: 'Savory', snacks: 'Snacks', chips: 'Chips',
        search: 'Search products…',
        noResults: 'No products found. Try a different search or category.',
      },
      cart: {
        pageTitle: '🛒 My Cart',
        pageSub: 'Review your order before checking out',
        product: 'Product', price: 'Price', qty: 'Quantity', total: 'Total',
        continue: '← Continue Shopping',
        clear: 'Clear Cart',
        summary: 'Order Summary',
        subtotal: 'Subtotal', delivery: 'Delivery fee', grandTotal: 'Total',
        checkout: 'Proceed to Checkout →',
        secure: '🔒 Secure checkout',
        emptyTitle: 'Your cart is empty',
        emptyMsg: "Looks like you haven't added anything yet.",
        emptyBtn: 'Browse Menu',
      },
      checkout: {
        pageTitle: '🔒 Checkout',
        pageSub: 'Almost there — fill in your details to place your order',
        contact: '👤 Contact Information',
        delivery: '🚚 Delivery Address',
        payment: '💳 Payment Method',
        firstName: 'First Name *', lastName: 'Last Name *',
        email: 'Email Address *', phone: 'Phone Number *',
        address: 'Street Address *', city: 'City *', postal: 'Postal Code *',
        notes: 'Delivery Notes (optional)',
        paypal: '💳 PayPal', paypalSub: 'Secure online payment via PayPal',
        bank: '🏦 Bank Transfer', bankSub: 'Direct bank transfer to our account',
        pickup: '🏠 Cash at Pickup', pickupSub: 'Pick up from our address, pay in cash',
        paypalNote: 'After placing your order, please send your payment to our PayPal: noritalumnue2@gmail.com — use your order reference as the payment note.',
        bankNote: 'After placing your order, transfer the exact amount. Bank details will be sent to your email.',
        pickupNote: 'Pick up at: Käppelierainweg 27, 4147 Aesch, Switzerland. No delivery fee applies.',
        placeOrder: 'Place Order →',
        successTitle: 'Order Placed!',
        successMsg: "Thank you for your order! We'll prepare your treats right away.",
        shopMore: 'Shop More Treats',
        secure: '🔒 Your details are safe and secure',
        emptyTitle: 'Nothing to checkout',
        emptyMsg: 'Your cart is empty. Add some treats first!',
        emptyBtn: 'Browse Menu',
      },
      product: { addToCart: '+ Add to Cart', added: '✓ Added!' },
      productDescs: {
        'Banana Bread':   'Moist, golden banana bread made with ripe bananas, butter and a hint of cinnamon.',
        'Puff Puff':      'Light, fluffy deep-fried dough balls dusted with sugar — a West African classic.',
        'Chin Chin':      'Crunchy, lightly sweetened fried dough snack. Addictive and perfect for snacking.',
        'Peanut Burger':  'Crispy peanut-coated patties with a satisfying crunch in every bite.',
        'Meat Pie':       'Golden pastry filled with seasoned minced meat, potatoes and carrots.',
        'Fish Roll':      'Flaky pastry rolled with seasoned fish filling — a perfect snack any time.',
        'Scotch Egg':     'Hard-boiled egg wrapped in seasoned meat, breaded and fried to golden perfection.',
        'Plantain Chips': 'Crispy sliced plantain chips, lightly salted — great for snacking anytime.',
        'Potato Chips':   'House-made potato chips, thinly sliced and perfectly seasoned.',
      },
      footer: {
        menuTitle: 'Menu', linksTitle: 'Quick Links', contactTitle: 'Contact',
        copy: '© 2025 JCD Royal Treats. All rights reserved.',
        tagline: 'Made with ❤️ and lots of butter',
        allProducts: 'All Products', baked: 'Baked Goods', savory: 'Savory', chips: 'Chips & Snacks',
        homeLink: 'Home', cartLink: 'My Cart', checkoutLink: 'Checkout', adminLink: 'Admin Panel',
      },
    },

    fr: {
      nav: { home: 'Accueil', menu: 'Menu', cart: 'Panier', admin: 'Admin' },
      hero: {
        badge: '🍞 Frais • Fait Maison • Délicieux',
        title: 'Pâtisseries Artisanales<br>Faites avec Amour',
        sub: "Découvrez les saveurs riches et chaleureuses des pâtisseries ouest-africaines — fraîchement cuites et livrées à votre porte.",
        shopBtn: 'Voir Notre Menu',
        seeBtn: 'Voir les Vedettes ↓',
      },
      features: {
        q: 'Qualité Maison',    qSub: 'Chaque article fait maison avec amour',
        d: 'Livraison Rapide',  dSub: 'Frais à votre porte, le jour même',
        i: 'Ingrédients Frais', iSub: 'Uniquement les meilleurs ingrédients',
        c: 'Fait avec Soin',    cSub: 'Chaque bouchée raconte une histoire',
      },
      home: {
        featLabel: 'Nos Meilleures Ventes',
        featTitle: 'Gourmandises Vedettes',
        featSub: 'Les favoris de nos clients, sélectionnés avec soin',
        viewAll: 'Voir le Menu Complet →',
        aboutLabel: 'Notre Histoire',
        aboutTitle: 'Cuit avec Cœur,<br>Servi avec Fierté',
        aboutP1: "JCD Royal Treats a commencé comme un projet passion — apporter les saveurs authentiques des pâtisseries ouest-africaines à la table. Chaque recette est préparée avec amour.",
        aboutP2: "De notre célèbre Pain Banane à nos Chin Chin croustillants, chaque gourmandise est préparée fraîche avec les meilleurs ingrédients. La bonne nourriture rassemble les gens.",
        aboutBtn: 'Explorer Notre Menu',
      },
      products: {
        pageTitle: '🍞 Notre Menu Complet',
        pageSub: 'Pâtisseries et snacks frais, faits maison chaque jour',
        all: 'Tout', baked: 'Cuit au Four', fried: 'Frit',
        savory: 'Salé', snacks: 'Collations', chips: 'Chips',
        search: 'Rechercher…',
        noResults: 'Aucun produit trouvé. Essayez une autre recherche.',
      },
      cart: {
        pageTitle: '🛒 Mon Panier',
        pageSub: 'Vérifiez votre commande avant de passer à la caisse',
        product: 'Produit', price: 'Prix', qty: 'Quantité', total: 'Total',
        continue: '← Continuer mes Achats',
        clear: 'Vider le Panier',
        summary: 'Récapitulatif',
        subtotal: 'Sous-total', delivery: 'Frais de livraison', grandTotal: 'Total',
        checkout: 'Passer à la Caisse →',
        secure: '🔒 Paiement sécurisé',
        emptyTitle: 'Votre panier est vide',
        emptyMsg: "Il semble que vous n'ayez rien ajouté encore.",
        emptyBtn: 'Voir le Menu',
      },
      checkout: {
        pageTitle: '🔒 Paiement',
        pageSub: 'Remplissez vos coordonnées pour passer votre commande',
        contact: '👤 Informations de Contact',
        delivery: '🚚 Adresse de Livraison',
        payment: '💳 Mode de Paiement',
        firstName: 'Prénom *', lastName: 'Nom *',
        email: 'Adresse e-mail *', phone: 'Téléphone *',
        address: 'Adresse *', city: 'Ville *', postal: 'Code Postal *',
        notes: 'Notes de livraison (optionnel)',
        paypal: '💳 PayPal', paypalSub: 'Paiement en ligne sécurisé via PayPal',
        bank: '🏦 Virement Bancaire', bankSub: 'Virement direct sur notre compte',
        pickup: '🏠 Retrait en Main Propre', pickupSub: 'Retrait à notre adresse, paiement en espèces',
        paypalNote: 'Après votre commande, envoyez le paiement à notre PayPal : noritalumnue2@gmail.com — indiquez votre référence de commande.',
        bankNote: 'Après votre commande, effectuez le virement du montant exact. Les coordonnées bancaires vous seront envoyées par email.',
        pickupNote: 'Retrait à : Käppelierainweg 27, 4147 Aesch, Suisse. Aucun frais de livraison.',
        placeOrder: 'Passer la Commande →',
        successTitle: 'Commande Passée !',
        successMsg: 'Merci pour votre commande ! Nous préparerons vos gourmandises tout de suite.',
        shopMore: 'Commander Plus',
        secure: '🔒 Vos informations sont sécurisées',
        emptyTitle: 'Rien à commander',
        emptyMsg: 'Votre panier est vide. Ajoutez des articles !',
        emptyBtn: 'Voir le Menu',
      },
      product: { addToCart: '+ Ajouter au Panier', added: '✓ Ajouté !' },
      productDescs: {
        'Banana Bread':   'Pain banane moelleux et doré, préparé avec des bananes mûres, du beurre et une touche de cannelle.',
        'Puff Puff':      'Beignets légers et moelleux saupoudrés de sucre — un classique ouest-africain.',
        'Chin Chin':      'Biscuits frits croquants et légèrement sucrés. Irrésistibles et parfaits pour le grignotage.',
        'Peanut Burger':  'Galettes croustillantes enrobées de cacahuètes avec un croquant satisfaisant à chaque bouchée.',
        'Meat Pie':       'Pâtisserie dorée farcie de viande hachée assaisonnée, de pommes de terre et de carottes.',
        'Fish Roll':      'Pâtisserie feuilletée roulée avec une garniture de poisson assaisonnée — un en-cas parfait.',
        'Scotch Egg':     "Œuf dur enveloppé de viande assaisonnée, pané et frit jusqu'à la perfection dorée.",
        'Plantain Chips': 'Chips de plantain croustillantes légèrement salées — idéales pour le grignotage.',
        'Potato Chips':   'Chips maison finement tranchées et parfaitement assaisonnées.',
      },
      footer: {
        menuTitle: 'Menu', linksTitle: 'Liens Rapides', contactTitle: 'Contact',
        copy: '© 2025 JCD Royal Treats. Tous droits réservés.',
        tagline: 'Fait avec ❤️ et beaucoup de beurre',
        allProducts: 'Tous les Produits', baked: 'Pâtisseries', savory: 'Salé', chips: 'Chips & Snacks',
        homeLink: 'Accueil', cartLink: 'Mon Panier', checkoutLink: 'Commander', adminLink: 'Admin',
      },
    },

    de: {
      nav: { home: 'Startseite', menu: 'Menü', cart: 'Warenkorb', admin: 'Admin' },
      hero: {
        badge: '🍞 Frisch • Hausgemacht • Köstlich',
        title: 'Handgemachte Backwaren<br>Mit Liebe Gemacht',
        sub: 'Entdecken Sie die warmen, reichen Aromen westafrikanischer Backwaren — frisch gebacken und direkt zu Ihnen geliefert.',
        shopBtn: 'Zur Speisekarte',
        seeBtn: 'Highlights sehen ↓',
      },
      features: {
        q: 'Hausgemachte Qualität', qSub: 'Jedes Produkt mit Liebe handgemacht',
        d: 'Schnelle Lieferung',    dSub: 'Frisch an Ihre Tür, noch am selben Tag',
        i: 'Frische Zutaten',       iSub: 'Nur die besten Qualitätszutaten',
        c: 'Mit Sorgfalt Gemacht',  cSub: 'Jeder Bissen erzählt eine Geschichte',
      },
      home: {
        featLabel: 'Unsere Bestseller',
        featTitle: 'Empfohlene Leckereien',
        featSub: 'Handverlesene Lieblinge, von denen unsere Kunden nicht genug bekommen',
        viewAll: 'Vollständige Speisekarte →',
        aboutLabel: 'Unsere Geschichte',
        aboutTitle: 'Mit Herz Gebacken,<br>Mit Stolz Serviert',
        aboutP1: 'JCD Royal Treats begann als Leidenschaftsprojekt — die authentischen Aromen westafrikanischer Backwaren auf den Tisch zu bringen.',
        aboutP2: 'Von unserem berühmten Bananenbrot bis zu unserem knusprigen Chin Chin — jede Leckerei wird frisch mit den besten Zutaten zubereitet.',
        aboutBtn: 'Unser Menü Entdecken',
      },
      products: {
        pageTitle: '🍞 Unsere Speisekarte',
        pageSub: 'Frische Backwaren und Snacks, täglich frisch zubereitet',
        all: 'Alle', baked: 'Gebacken', fried: 'Gebraten',
        savory: 'Herzhaft', snacks: 'Snacks', chips: 'Chips',
        search: 'Produkte suchen…',
        noResults: 'Keine Produkte gefunden. Versuchen Sie eine andere Suche.',
      },
      cart: {
        pageTitle: '🛒 Mein Warenkorb',
        pageSub: 'Überprüfen Sie Ihre Bestellung vor dem Checkout',
        product: 'Produkt', price: 'Preis', qty: 'Menge', total: 'Gesamt',
        continue: '← Weiter Einkaufen',
        clear: 'Warenkorb Leeren',
        summary: 'Bestellübersicht',
        subtotal: 'Zwischensumme', delivery: 'Liefergebühr', grandTotal: 'Gesamt',
        checkout: 'Zur Kasse →',
        secure: '🔒 Sicherer Checkout',
        emptyTitle: 'Ihr Warenkorb ist leer',
        emptyMsg: 'Sie haben noch nichts hinzugefügt.',
        emptyBtn: 'Zum Menü',
      },
      checkout: {
        pageTitle: '🔒 Kasse',
        pageSub: 'Fast geschafft — füllen Sie Ihre Daten aus',
        contact: '👤 Kontaktinformationen',
        delivery: '🚚 Lieferadresse',
        payment: '💳 Zahlungsart',
        firstName: 'Vorname *', lastName: 'Nachname *',
        email: 'E-Mail-Adresse *', phone: 'Telefonnummer *',
        address: 'Straße und Hausnummer *', city: 'Stadt *', postal: 'Postleitzahl *',
        notes: 'Lieferhinweise (optional)',
        paypal: '💳 PayPal', paypalSub: 'Sichere Online-Zahlung via PayPal',
        bank: '🏦 Banküberweisung', bankSub: 'Direkte Überweisung auf unser Konto',
        pickup: '🏠 Abholung & Barzahlung', pickupSub: 'Abholung bei uns, Zahlung bar vor Ort',
        paypalNote: 'Nach der Bestellung senden Sie Ihre Zahlung bitte an unsere PayPal-Adresse: noritalumnue2@gmail.com — geben Sie Ihre Bestellreferenz als Verwendungszweck an.',
        bankNote: 'Nach der Bestellung überweisen Sie den genauen Betrag. Bankdaten werden Ihnen per E-Mail zugesandt.',
        pickupNote: 'Abholung: Käppelierainweg 27, 4147 Aesch, Schweiz. Keine Liefergebühr.',
        placeOrder: 'Bestellung Aufgeben →',
        successTitle: 'Bestellung Aufgegeben!',
        successMsg: 'Vielen Dank für Ihre Bestellung! Wir bereiten Ihre Leckereien sofort vor.',
        shopMore: 'Weitere Leckereien',
        secure: '🔒 Ihre Daten sind sicher',
        emptyTitle: 'Nichts zum Bestellen',
        emptyMsg: 'Ihr Warenkorb ist leer. Fügen Sie zuerst Artikel hinzu!',
        emptyBtn: 'Zum Menü',
      },
      product: { addToCart: '+ In den Warenkorb', added: '✓ Hinzugefügt!' },
      productDescs: {
        'Banana Bread':   'Saftiges, goldenes Bananenbrot aus reifen Bananen, Butter und einer Prise Zimt.',
        'Puff Puff':      'Leichte, luftige frittierte Teigbällchen mit Zucker — ein westafrikanischer Klassiker.',
        'Chin Chin':      'Knuspriges, leicht gesüßtes frittiertes Gebäck. Unwiderstehlich und perfekt zum Snacken.',
        'Peanut Burger':  'Knusprige erdnussummantelte Bratlinge mit einem befriedigenden Crunch bei jedem Biss.',
        'Meat Pie':       'Goldenes Gebäck gefüllt mit gewürztem Hackfleisch, Kartoffeln und Karotten.',
        'Fish Roll':      'Blätterteig mit gewürzter Fischfüllung gerollt — ein perfekter Snack zu jeder Zeit.',
        'Scotch Egg':     'Hartgekochtes Ei in gewürztem Fleisch, paniert und goldbraun frittiert.',
        'Plantain Chips': 'Knusprige Kochbananenchips, leicht gesalzen — ideal zum Snacken.',
        'Potato Chips':   'Hausgemachte Kartoffelchips, dünn geschnitten und perfekt gewürzt.',
      },
      footer: {
        menuTitle: 'Menü', linksTitle: 'Schnelllinks', contactTitle: 'Kontakt',
        copy: '© 2025 JCD Royal Treats. Alle Rechte vorbehalten.',
        tagline: 'Gemacht mit ❤️ und viel Butter',
        allProducts: 'Alle Produkte', baked: 'Backwaren', savory: 'Herzhaft', chips: 'Chips & Snacks',
        homeLink: 'Startseite', cartLink: 'Warenkorb', checkoutLink: 'Kasse', adminLink: 'Admin',
      },
    },
  };

  /* ── State ─────────────────────────────────────────────────────── */
  let country = localStorage.getItem('jcd_country') || 'ch';
  let lang    = localStorage.getItem('jcd_lang')    || 'en';

  /* ── Helpers ───────────────────────────────────────────────────── */
  function t()    { return T[lang] || T.en; }
  function dot(obj, path) { return path.split('.').reduce((o, k) => o?.[k], obj); }

  /* Prices stored in CHF; this converts to the selected country's currency */
  function formatPrice(chfAmount) {
    const c = COUNTRIES[country];
    const v = chfAmount * c.rate;
    if (c.currency === 'CHF') return `CHF ${v.toFixed(2)}`;
    return `${c.symbol}${v.toFixed(2)}`;
  }

  /* Returns the shipping fee in CHF for the current country given total order weight in kg */
  function getDeliveryFee(weightKg) {
    if (!weightKg || weightKg <= 0) return 0;
    const tiers = COUNTRIES[country].tiers;
    const tier  = tiers.find(t => weightKg <= t.maxKg);
    return tier ? tier.price : tiers[tiers.length - 1].price;
  }

  /* ── Selector dropdowns ────────────────────────────────────────── */
  function closeAll() {
    document.querySelectorAll('.selector-menu').forEach(m => m.classList.remove('open'));
  }
  function toggleDropdown(id) {
    const menu = document.getElementById(id);
    const wasOpen = menu.classList.contains('open');
    closeAll();
    if (!wasOpen) menu.classList.add('open');
  }
  document.addEventListener('click', e => {
    if (!e.target.closest('.selector-wrap')) closeAll();
  });

  /* ── Country change ────────────────────────────────────────────── */
  function setCountry(code) {
    country = code;
    localStorage.setItem('jcd_country', code);
    const c = COUNTRIES[code];
    document.querySelectorAll('.jcd-country-flag').forEach(el => el.textContent = c.flag);
    document.querySelectorAll('.jcd-country-name').forEach(el => el.textContent = c.name);
    document.querySelectorAll('[data-country]').forEach(el =>
      el.classList.toggle('active', el.dataset.country === code));
    closeAll();
    document.dispatchEvent(new Event('jcd:locale'));
  }

  /* ── Language change ───────────────────────────────────────────── */
  function setLanguage(code) {
    lang = code;
    localStorage.setItem('jcd_lang', code);
    document.querySelectorAll('.jcd-lang-code').forEach(el => el.textContent = code.toUpperCase());
    document.querySelectorAll('[data-lang]').forEach(el =>
      el.classList.toggle('active', el.dataset.lang === code));
    closeAll();
    applyTranslations();
    document.dispatchEvent(new Event('jcd:locale'));
  }

  /* ── Apply translations to DOM ─────────────────────────────────── */
  function applyTranslations() {
    const tr = t();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = dot(tr, el.dataset.i18n);
      if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = dot(tr, el.dataset.i18nHtml);
      if (v !== undefined) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const v = dot(tr, el.dataset.i18nPh);
      if (v !== undefined) el.placeholder = v;
    });
    document.documentElement.lang = lang;
  }

  /* ── Init ──────────────────────────────────────────────────────── */
  function init() {
    const c = COUNTRIES[country];
    document.querySelectorAll('.jcd-country-flag').forEach(el => el.textContent = c.flag);
    document.querySelectorAll('.jcd-country-name').forEach(el => el.textContent = c.name);
    document.querySelectorAll('.jcd-lang-code').forEach(el => el.textContent = lang.toUpperCase());
    document.querySelectorAll('[data-country]').forEach(el =>
      el.classList.toggle('active', el.dataset.country === country));
    document.querySelectorAll('[data-lang]').forEach(el =>
      el.classList.toggle('active', el.dataset.lang === lang));
    applyTranslations();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { t, formatPrice, getDeliveryFee, setCountry, setLanguage, toggleDropdown, COUNTRIES };
})();

/* Global override so all existing formatPrice() calls become locale-aware */
function formatPrice(amount) { return I18N.formatPrice(amount); }

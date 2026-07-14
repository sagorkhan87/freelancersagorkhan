/* =========================================================
   OLYMPIAD DATA — this is the ONLY file you need to edit to
   add, remove, or update Olympiads and the sliding notice bar.
   Nothing else in the project needs to change.

   OLYMPIAD CARD FIELDS
   image        -> featured image URL (large, landscape works best)
                   • a link already hosted online, e.g.
                     image: "https://your-site.com/photos/math-olympiad.jpg"
                   • OR a local file path relative to olympiad-hub.html, e.g.
                     image: "images/math-olympiad.jpg"
   title        -> olympiad name
   description  -> one/two line short summary shown on the card
   eventDate    -> e.g. "১৫ সেপ্টেম্বর, ২০২৬"
   deadline     -> registration deadline text
   organizer    -> organizing body / institution
   category     -> e.g. "গণিত", "বিজ্ঞান", "প্রোগ্রামিং"
   status       -> one of: "open" | "closing" | "closed"
   url          -> external registration / details link

   To add a brand-new Olympiad, copy one whole { ... } block below,
   paste it as a new item, and edit its fields — a new card appears
   automatically, no other code changes needed.

   ⚠️ NOTE ON ORDER: cards below are sorted status-first —
   "open" এন্ট্রি সবার উপরে, তারপর "closing", সবশেষে "closed"।
   নতুন এন্ট্রি যোগ করার সময় এই ক্রম বজায় রাখতে চাইলে সঠিক
   status-গ্রুপের ভেতরে বসিয়ে দিন।
   ========================================================= */

// Sliding notice bar text — you can put more than one message,
// they will loop one after another.
  const NOTICE_TEXTS = [
    "🏆 নিবন্ধন এখনই খোলা — আজই আপনার আসন নিশ্চিত করুন",
    "📢 নতুন অলিম্পিয়াড শীঘ্রই যুক্ত হচ্ছে — নিয়মিত চোখ রাখুন"
  ];

  // ---------------------------------------------------------
  // OLYMPIAD CARDS — each { ... } below is ONE card.
  // 👉 "image" is where YOUR photo for that card goes. You can put:
  //      • a link to an image already hosted online, e.g.
  //        image: "https://your-site.com/photos/math-olympiad.jpg",
  //      • OR a local file path relative to this HTML file, e.g.
  //        image: "images/math-olympiad.jpg",   (put the file in an "images" folder next to this page)
  // To add a brand-new Olympiad, copy one whole { ... } block, paste it
  // as a new item, and edit its fields — a new card appears automatically.
  // status: "open" | "closing" | "closed"
  // ---------------------------------------------------------
  const OLYMPIADS = [

    // ========== 🟢 OPEN — রেজিস্ট্রেশন চলমান ========== //

    {
      // ↓↓↓ PUT THIS CARD'S IMAGE HERE ↓↓↓
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1200&auto=format&fit=crop",
      title: "বাংলাদেশ ম্যাথ অলিম্পিয়াড ২০২৬",
      description: "দেশের সবচেয়ে বড় গণিত প্রতিযোগিতা — জাতীয় পর্যায় থেকে আন্তর্জাতিক আসরে যাওয়ার সুযোগ।",
      eventDate: "১৫ সেপ্টেম্বর, ২০২৬",
      deadline: "৩১ আগস্ট, ২০২৬",
      organizer: "বাংলাদেশ গণিত অলিম্পিয়াড কমিটি",
      category: "গণিত",
      status: "open",
      url: "https://matholympiad.org.bd/"
    },
    {
      // ↓↓↓ PUT THIS CARD'S IMAGE HERE ↓↓↓
      image: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?q=80&w=1200&auto=format&fit=crop",
      title: "ন্যাশনাল কেমিস্ট্রি অলিম্পিয়াড",
      description: "রসায়ন বিষয়ে শিক্ষার্থীদের বিশ্লেষণী দক্ষতা যাচাইয়ের জাতীয় প্রতিযোগিতা।",
      eventDate: "২০ অক্টোবর, ২০২৬",
      deadline: "২৫ সেপ্টেম্বর, ২০২৬",
      organizer: "বাংলাদেশ রসায়ন অলিম্পিয়াড কমিটি",
      category: "রসায়ন",
      status: "open",
      url: "https://example.com/chemistry-olympiad"
    },
    {
      image: "award pic/biology.jpg",
      title: "বাংলাদেশ বায়োলজি অলিম্পিয়াড ২০২৬",
      description: "জীববিজ্ঞানপ্রেমী শিক্ষার্থীদের জন্য জাতীয় প্রতিযোগিতা।",
      eventDate: "১০ নভেম্বর, ২০২৬",
      deadline: "২০ অক্টোবর, ২০২৬",
      organizer: "বাংলাদেশ বায়োলজি অলিম্পিয়াড কমিটি",
      category: "জীববিজ্ঞান",
      status: "open",
      url: "https://bdbo.org"
    },
    {
      image: "award pic/informatics.jpg",
      title: "বাংলাদেশ ইনফরমেটিক্স অলিম্পিয়াড",
      description: "প্রোগ্রামিং ও অ্যালগরিদমভিত্তিক প্রতিযোগিতা।",
      eventDate: "৫ ডিসেম্বর, ২০২৬",
      deadline: "১৫ নভেম্বর, ২০২৬",
      organizer: "বাংলাদেশ ইনফরমেটিক্স অলিম্পিয়াড",
      category: "ইনফরমেটিক্স",
      status: "open",
      url: "https://bdio.org"
    },

    // ↓↓↓ যাচাই করা নতুন এন্ট্রি (জুলাই ২০২৬ অনুযায়ী সর্বশেষ অবস্থা) ↓↓↓
    {
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      title: "ন্যাশনাল আইসিটি অলিম্পিয়াড ২০২৬",
      description: "সারাদেশের শিক্ষার্থীদের জন্য ৪টি ক্যাটাগরিতে জাতীয় আইসিটি প্রতিযোগিতা — বাছাই, সেমি-ফাইনাল ও ফাইনাল পর্ব নিয়ে আয়োজিত।",
      eventDate: "সেমি-ফাইনাল (অনলাইন) ও ফাইনাল (অফলাইন) — তারিখ শীঘ্রই জানানো হবে",
      deadline: "রেজিস্ট্রেশন পর্ব চলমান — নির্দিষ্ট শেষ তারিখ অফিসিয়াল সাইটে উল্লেখ নেই, দ্রুত রেজিস্ট্রেশন করার পরামর্শ দেওয়া হচ্ছে",
      organizer: "National ICT Olympiad",
      category: "তথ্যপ্রযুক্তি",
      status: "open",
      url: "https://nictobd.lovable.app/"
    },
    {
      image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1200&auto=format&fit=crop",
      title: "বাংলাদেশ বায়োলজি অলিম্পিয়াড (BdBO) ২০২৬ — আঞ্চলিক রেজিস্ট্রেশন",
      description: "আঞ্চলিক পর্বের রেজিস্ট্রেশন চলমান। যোগ্যতা: বাংলাদেশে অধ্যয়নরত ও ১ জুলাই, ২০০৬-এর পরে জন্মগ্রহণকারী শিক্ষার্থী।",
      eventDate: "আঞ্চলিক পর্ব — তারিখ অফিসিয়াল পোর্টালে দেখুন",
      deadline: "রেজিস্ট্রেশন চলমান — নির্দিষ্ট শেষ তারিখের জন্য অফিসিয়াল পোর্টাল দেখুন",
      organizer: "Bangladesh Biology Olympiad (BdBO)",
      category: "জীববিজ্ঞান",
      status: "open",
      url: "https://registration.bdbo.net/"
    },

    // ========== 🟡 CLOSING — শীঘ্রই বন্ধ হচ্ছে ========== //

    {
      // ↓↓↓ PUT THIS CARD'S IMAGE HERE ↓↓↓
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
      title: "ন্যাশনাল ফিজিক্স অলিম্পিয়াড",
      description: "পদার্থবিজ্ঞানে দেশসেরা মেধাবীদের খুঁজে বের করার জাতীয় আয়োজন।",
      eventDate: "২ অক্টোবর, ২০২৬",
      deadline: "১০ সেপ্টেম্বর, ২০২৬",
      organizer: "শিক্ষা মন্ত্রণালয়, বাংলাদেশ",
      category: "পদার্থবিজ্ঞান",
      status: "closing",
      url: "https://www.bdpho.org/"
    },
    {
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop",
      title: "২১তম বাংলাদেশ অ্যাস্ট্রো-অলিম্পিয়াড (BAO) ২০২৬",
      description: "জেলা-ভিত্তিক অনলাইন বাছাই দিয়ে শুরু হয়ে বিভাগীয়, জাতীয় ও ক্লোজড ক্যাম্প পর্ব পর্যন্ত ৪ ধাপের প্রতিযোগিতা। প্রথম রাউন্ডে কোনো ফি নেই।",
      eventDate: "৪ ধাপের আয়োজন (মে–জুলাই, ২০২৬)",
      deadline: "রেজিস্ট্রেশন সংক্রান্ত সর্বশেষ তারিখ অফিসিয়াল সাইটে দেখুন",
      organizer: "Bangladesh Astronomical Association (BAA)",
      category: "জ্যোতির্বিজ্ঞান",
      status: "closing",
      url: "https://www.astronomybangla.com/olympiad2026"
    },

    // ========== 🔴 CLOSED — সমাপ্ত ========== //

    {
      // ↓↓↓ PUT THIS CARD'S IMAGE HERE ↓↓↓
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
      title: "ঢাকা কোডিং চ্যালেঞ্জ ২০২৬",
      description: "তরুণ প্রোগ্রামারদের জন্য প্রতিযোগিতামূলক প্রোগ্রামিং প্রতিযোগিতা।",
      eventDate: "৫ জুলাই, ২০২৬ (সমাপ্ত)",
      deadline: "২০ জুন, ২০২৬",
      organizer: "ঢাকা বিশ্ববিদ্যালয় কম্পিউটার সোসাইটি",
      category: "প্রোগ্রামিং",
      status: "closed",
      url: "https://example.com/dhaka-coding-challenge"
    },

  ];

/* =========================================================
   Shared site data
   Loaded by BOTH index.html and room.html before their
   own script — edit photos, certificates, notice text and
   room labels here in one place.
   ========================================================= */

/* -------------------------------------------------------
   EDIT ME: sliding notice bar text (top of the site)
------------------------------------------------------- */
const noticeText = "🎉 Welcome to my Website — new award-winning photos and videos is here  •  📸 Now your time is ready - Earn skill make money  •  ✦ Thanks for visiting my website!";

/* -------------------------------------------------------
   EDIT ME: Award slider photos
   Replace each "img" URL with your own image path
   (e.g. "images/award1.jpg"). Add/remove objects freely —
   the slider and article rooms adapt automatically.
------------------------------------------------------- */
const slidesData = [
  {
    img: "award pic/Creative Talent Search 2024.jpg",
    title: "Bangladesh National Creative Talent Search 2024",
    subtitle: "বাংলাদেশ জাতীয় মেধা অন্বেষণ প্রতিযোগিতা ২০২৪",
    // EDIT ME (optional): shown as a date pill on the detail page. Leave "" to hide it.
    date: "March 2024",
    // EDIT ME (optional): longer write-up shown on the detail page.
    // If left empty, the subtitle above is used instead.
    description: "Awarded at the Bangladesh National Creative Talent Search 2024. ."
  },
  {
    img: "award pic/Wildlife1.jpg",
    title: "Wildlife Olympiad Award 2024",
    subtitle: "ওয়াইল্ড লাইফ অলিম্পিয়াড প্রতিযোগিতা ২০২৪",
    date: "November 09-11- 2024",
    description: "ভিকারুন্নেসা নুন স্কুল এন্ড কলেজে, জাতীয় পর্যায়ের অনুষ্ঠান টি অনুষ্ঠিত হয়"
  },
  {
    img: "award pic/ai2.jpg",
    title: "AI & Machine Learning Competition 2026",
    subtitle: "এআই ও মেশিন লার্নিং প্রতিযোগিতা ২০২৬",
    date: "January 2026",
    description: "Awarded at the AI & Machine Learning Competition 2026. এআই ও মেশিন লার্নিং প্রতিযোগিতা ২০২৬ location: BUBT."
  },
  {
    img: "award pic/creative2.jpg",
    title: "bangladesh National Creative Talent Search 2024",
    subtitle: "বাংলাদেশ জাতীয় মেধা অন্বেষণ প্রতিযোগিতা ২০২৪",
    date: "March 2024",
    description: "Awarded at the Bangladesh National Creative Talent Search 2024."
  },
  {
    img: "award pic/creative4.jpg",
    title: "Bangladesh National Creative Talent Search 2024",
    subtitle: "বাংলাদেশ জাতীয় মেধা অন্বেষণ প্রতিযোগিতা ২০২৪",
    date: "March 2024",
    description: "Awarded at the Bangladesh National Creative Talent Search 2024."
  },
   {
    img: "award pic/wildlife3.jpg",
    title: "Wildlife Olympiad Award 2024",
    subtitle: "ওয়াইল্ড লাইফ অলিম্পিয়াড প্রতিযোগিতা ২০২৪",
    date: "November 2024",
    description: "Awarded at the Wildlife Olympiad 2024."
  },
  {
    img: "award pic/ai1.jpg",
    title: "AI & Machine Learning Competition 2026",
    subtitle: "এআই ও মেশিন লার্নিং প্রতিযোগিতা ২০২৬",
    date: "January 2026",
    description: "Awarded at the AI & Machine Learning Competition 2026."
  },
  {
    img: "award pic/creative3.jpg",
    title: "Bangladesh National Creative Talent Search 2024",
    subtitle: "বাংলাদেশ জাতীয় মেধা অন্বেষণ প্রতিযোগিতা ২০২৪",
    date: "March 2024",
    description: "Awarded at the Bangladesh National Creative Talent Search 2024."
  },
  {
    img: "award pic/sagor2.jpg",
    title: "Wildlife Olympiad Award 2024",
    subtitle: "ওয়াইল্ড লাইফ অলিম্পিয়াড প্রতিযোগিতা ২০২৪",
    date: "November 2024",
    description: "Awarded at the District level Wildlife Olympiad 2024."
  },
  {
    img: "award pic/creative5.jpg",
    title: "Wildlife Olympiad Award 2024",
    subtitle: "ওয়াইল্ড লাইফ অলিম্পিয়াড প্রতিযোগিতা ২০২৪",
    date: "November 2024",
    description: "Awarded at the District level Wildlife Olympiad 2024."
  },
  {
    img: "award pic/school competetion.jpg",
    title: "School Level Competition Award 2025",
    subtitle: "স্কুল স্তরের প্রতিযোগিতা পুরস্কার 2025",
    date: " March 2025",
    description: "school level competition."
  },
  {
    img: "award pic/ai3.jpg",
    title: "AI & Machine Learning Competition 2026",
    subtitle: "এআই ও মেশিন লার্নিং প্রতিযোগিতা ২০২৬",
    date: "January 2026",
    description: "Awarded at the AI & Machine Learning Competition 2026."
  },
   {
    img: "award pic/wildlife6.jpg",
    title: "Wildlife Olympiad Award 2024",
    subtitle: "ওয়াইল্ড লাইফ অলিম্পিয়াড প্রতিযোগিতা ২০২৪",
    date: "November 2024",
    description: "Awarded at the Wildlife Olympiad 2024."
  },
  {
    img: "award pic/creative6.jpg",
    title: "Bangladesh National Creative Talent Search 2024",
    subtitle: "বাংলাদেশ জাতীয় মেধা অন্বেষণ প্রতিযোগিতা ২০২৪",
    date: "March 2024",
    description: "Awarded at the Bangladesh National Creative Talent Search 2024."
  },
  {
    img: "award pic/nature2.jpg",
    title: "nature olympiad Award 2025",
    subtitle: "ন্যাচার অলিম্পিয়াড প্রতিযোগিতা ২০২৫",
    date: "November 2025",
    description: "Awarded at the Nature Olympiad 2025."
  },
  {
    img: "award pic/creative9.jpg",
    title: "Bangladesh National Creative Talent Search 2024",
    subtitle: "বাংলাদেশ জাতীয় মেধা অন্বেষণ প্রতিযোগিতা ২০২৪",
    date: "March 2024",
    description: "Awarded at the Bangladesh National Creative Talent Search 2024."
  },
  {
    img: "award pic/creative10.jpg",
    title: "Bangladesh National Creative Talent Search 2024",
    subtitle: "বাংলাদেশ জাতীয় মেধা অন্বেষণ প্রতিযোগিতা ২০২৪",
    date: "March 2024",
    description: "Awarded at the Bangladesh National Creative Talent Search 2024."
  },
  {
    img: "award pic/wildlife8.jpg",
    title: "Wildlife Olympiad Award 2024",
    subtitle: "ওয়াইল্ড লাইফ অলিম্পিয়াড প্রতিযোগিতা ২০২৪",
    date: "November 2024",
    description: "Awarded at the Wildlife Olympiad 2024."
  },
  {
    img: "award pic/school competetion2.jpg",
    title: "School Level Competition Award 2025",
    subtitle: "স্কুল স্তরের প্রতিযোগিতা পুরস্কার 2025",
    date: "March 2025",
    description: "school level competition."
  },
  {
    img: "award pic/wildlife7.jpg",
    title: "Wildlife Olympiad Award 2024",
    subtitle: "ওয়াইল্ড লাইফ অলিম্পিয়াড প্রতিযোগিতা ২০২৪",
    date: "November 2024",
    description: "Awarded at the Wildlife Olympiad 2024."
  },
  {
    img: "award pic/wildlife4.jpg",
    title: "Wildlife Olympiad Award 2024",
    subtitle: "ওয়াইল্ড লাইফ অলিম্পিয়াড প্রতিযোগিতা ২০২৪",
    date: "November 2024",
    description: "Awarded at the Wildlife Olympiad 2024."
  }
];

/* -------------------------------------------------------
   EDIT ME: Certificate slider images
------------------------------------------------------- */
const certData = [
  {
    img: "award pic/cit1.jpg",
    title: "Digital marketing specialist certification",
    subtitle: "Creative it institute Bangladesh, ",
    date: "2025",
    description: "স্বনামধন্য আইটি শিক্ষা প্রতিষ্ঠান ক্রিয়েটিভ আইটি ইন্সটিটিউট থেকে ডিজিটাল মার্কেটিং বিষয়ের উপর কোর্স সম্পন্ন করি , যা ছিল ছয় মাসের একটি কোর্স।"
  },
  {
    img: "award pic/cit2.jpg",
    title: "Bangladesh Freelancer Certification",
    subtitle: "Bangladesh Government , 2026",
    date: "2026",
    description: "বাংলাদেশ সরকার সকল ফ্রিল্যান্সারকে একটা আইডি কার্ড প্রদান করা হয় । আলহামদুলিল্লাহ আমি ও সেটি পেয়েছি ।"
  },
  {
    img: "award pic/cit3.jpg",
    title: "Bangladesh National tech award 2026",
    subtitle: "ONE WAY SCHOOL,Bangladesh",
    date: "2026",
    description: "ঢাকা বিশ্ববিদ্যালয় বাংলা একাডেমিতে বিশেষ এক জাঁকজমকপূর্ণ অনুষ্ঠানের মাধ্যমে দেশের প্রত্যন্ত অঞ্চল থেকে শুরু করে শহর অঞ্চল । সেরা ফ্রিল্যান্সারদের এবং ডিজিটাল  উদ্যোক্তা কনটেন্ট ক্রিকেটারদের পুরষ্কার প্রদান করা হয়, আলহামদুলিল্লাহ আমিও সেখানে একটি ফ্রিল্যান্সার ক্যাটাগরিতে জাতীয় পর্যায় সম্মানজনক পুরস্কার পেয়েছি"
  },
  {
    img: "award pic/cit4.jpg",
    title: "IELTS Certification ",
    subtitle: "GRAMEENPHONE AND UNDP, Bangladesh",
    date: "2026",
    description: "দেশের গ্রামীণফোন টেলিকম বানিয়ে এবং জাতিসংঘের ইউএনডিপি বাংলাদেশ শাখা কর্তৃক এই ( আই ই এল টি এস ) বেসিক রিটেন মডিউল কোর্স আলহামদুলিল্লাহ কৃতিত্বের সাথে সম্পন্ন করি ।"
  },
  {
    img: "award pic/cit6.jpg",
    title: "wildlife Olympiad Certification ",
    subtitle: "wildlife Olympiad, Bangladesh",
    date: "2026",
    description: "wildlife Olympiad certification."
  },
  {
    img: "award pic/newspaper certificate.jpg",
    title: "Bkash present newspaper olmpiad certificate",
    subtitle: "Newspaper Olympiad, Bangladesh",
    date: "2026",
    description: "Newspaper Olympiad certification."
  },
  {
    img: "award pic/cit7.jpg",
    title: "Dhaka University present physics Olympiad certificate",
    subtitle: "Physics Olympiad, Bangladesh",
    date: "2026",
    description: "Physics Olympiad certification."
  },
  {
    img: "award pic/cit8.jpg",
    title: "Bangladesh Olmpiad Challenged certificate",
    subtitle: "Math Olympiad, Bangladesh",
    date: "2026",
    description: "Math Olympiad certification."
  },
  {
    img: "award pic/cit9.jpg",
    title: "Bangladesh National Earth Science Olympiad certificate",
    subtitle: "Earth Science Olympiad, Bangladesh",
    date: "2025",
    description: "Earth Science Olympiad certification."
  },
  {
    img: "award pic/cit10.jpg",
    title: "Bangladesh ict Olympiad certificate",
    subtitle: "ICT Olympiad, Bangladesh",
    date: "2025",
    description: "ICT Olympiad certification."
  },
];

/* -------------------------------------------------------
   EDIT ME: Memorable Videos slider (new section, placed
   right under Certificate Collection on the homepage).

   For each video you can use EITHER:
   - "youtube": just the YouTube video ID (the part after
     "v=" in a normal YouTube URL), OR
   - "video": a path/URL to an .mp4 file — e.g. "videos/shoot1.mp4"

   Leave the one you're not using as "" (empty string).
   "thumb" is the still image shown in the slider before playing.
------------------------------------------------------- */
const videosData = [
  {
    thumb: "award pic/thambalain1.jpg",
    title: "সিরাজগঞ্জ জেলা চ্যাম্পিয়ন শিক্ষার্থী । 🇧🇩 ওয়াইল্ডলাইফ অলিম্পিয়াড ২০২৪",
    subtitle: "Wildlife Olympiad 2024",
    date: "November  2024",
    description: "বাংলাদেশ সরকার কর্তৃক আয়োজিত ওয়াইল্ড লাইফ অলিম্পিয়াড সারা বাংলাদেশ আয়োজন করা হয় সেখানে প্রত্যেকটা হাই স্কুল শ্রেণীর ষষ্ঠ থেকে দ্বাদশ শ্রেণী পর্যন্ত শিক্ষার্থীরা অংশগ্রহণ করে । আমিও সেখানে অংশগ্রহণ করেছিলাম । আলহামদুলিল্লাহ আমি সেখানে জেলা চ্যাম্পিয়ন হয়েছি  ।",
    youtube: "lmTRTklhexU",
    video: ""
  },
  {
    thumb: "award pic/thamb2.jpg",
    title: "Identification Game",
    subtitle: "Wildlife Olympiad 2024",
    date: "November 09 2024",
    description: "In this video, I showcase my skills in identifying various wildlife species during the Wildlife Olympiad 2024.",
    youtube: "FDKepw01Zo0",
    video: ""
  },
  {
    thumb: "award pic/influencer award.jpg",
    title: "National influencer Award 2025 ",
    subtitle: "Events and Recognition atn bangla news channel",
    date: "December 2024",
    description: "Highlights from the 2024 award ceremony night.",
    youtube: "cuLTI57_vTM",
    video: ""
  },
  {
    thumb: "award pic/wildlife2.jpg",
    title: "International performance in Education life",
    subtitle: "বাংলাদেশ জাতীয় শিক্ষা সপ্তাহ ২০২৪",
    date: "2024",
    description: "A short aerial reel captured over the last year.",
    youtube: "mheiqOdB5lo",
    video: ""
  },
  {
    thumb: "award pic/milion.jpg",
    title: "Milionaire MD SAGOR ALI KHAN",
    subtitle: "বাংলাদেশের একজন মিলিওনেয়ার",
    date: "2024",
    description: "A short aerial reel captured over the last year.",
    youtube: "",
    video: "videos/milion1.mp4"
  },
];

/* -------------------------------------------------------
   EDIT ME: the four "room" cards on the homepage
   Each key must match a button's data-room attribute.
------------------------------------------------------- */
const roomMeta = {
  about: {
    title: "About Me",
    subtitle: "My story, in my own words",
    icon: "award pic/sagor1.jpg",
    accent: "gold"
  },
  skills: {
    title: "My Skills",
    subtitle: "একটাই লক্ষ্য হতে হবে দক্ষ",
    icon: "fa-brain",
    accent: "purple"
  },
  awards: {
    title: "My Awards",
    subtitle: "Behind the scenes of every win",
    icon: "fa-trophy",
    accent: "green"
  },
  contact: {
    title: "Contact Me",
    subtitle: "Notes, updates & how to reach me",
    icon: "fa-envelope",
    accent: "blue"
  }
};

/* -------------------------------------------------------
   Resolves a room id (from a card OR a slide) into
   { title, subtitle, icon, accent } for room.html.
   You shouldn't need to edit this function.
------------------------------------------------------- */
function getRoomInfo(roomId) {
  if (roomMeta[roomId]) return roomMeta[roomId];

  if (roomId && roomId.startsWith("award-")) {
    const idx = parseInt(roomId.split("-")[1], 10);
    const slide = slidesData[idx];
    if (slide) {
      return { title: slide.title, subtitle: slide.subtitle, icon: "fa-trophy", accent: "gold", cover: slide.img };
    }
  }

  if (roomId && roomId.startsWith("cert-")) {
    const idx = parseInt(roomId.split("-")[1], 10);
    const cert = certData[idx];
    if (cert) {
      return { title: cert.title, subtitle: cert.subtitle, icon: "fa-certificate", accent: "blue", cover: cert.img };
    }
  }

  if (roomId && roomId.startsWith("video-")) {
    const idx = parseInt(roomId.split("-")[1], 10);
    const vid = (typeof videosData !== "undefined") ? videosData[idx] : null;
    if (vid) {
      return { title: vid.title, subtitle: vid.subtitle, icon: "fa-clapperboard", accent: "blue", cover: vid.thumb };
    }
  }

  return { title: "Articles", subtitle: "Publish your story here", icon: "fa-newspaper", accent: "gold" };
}

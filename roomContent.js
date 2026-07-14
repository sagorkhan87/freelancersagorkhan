/* =========================================================
   Gallery + Article content for the "About Me", "My Skills"
   and "My Awards" pages.

   HOW THIS FILE WORKS
   --------------------------------------------------------
   Each of the 3 keys below (about / skills / awards) builds
   ONE full page with this layout:

     Row 1  -> "topImages"  : 4 plain photos side by side
     Row 2  -> "cards" [0-3]: 4 photo+text cards
     Row 3  -> "cards" [4-7]: 4 photo+text cards

   Clicking any card in Row 2 or Row 3 opens a details page
   for that card, using the "detail" text you write below.

   TO ADD / EDIT CONTENT LATER:
   - Change any "img" value to your own image path
     (e.g. "images/about/1.jpg") or another photo URL.
   - Change "title" / "excerpt" (the short text shown on the
     card) and "detail" (the long text shown on the details
     page) freely — plain text, no HTML needed.
   - You can add more cards to a row's array; the grid will
     wrap automatically. Keep 4 in "topImages" for the best
     look on desktop.
   - "id" must stay unique inside each room (about/skills/
     awards) — it's used to link a card to its details page.
   ========================================================= */

const roomPageContent = {

  /* =======================================================
     ABOUT ME
     ======================================================= */
  about: {

    /* Row 1 — EDIT ME: 4 top photos (no text, just images) */
    topImages: [
      { img: "award pic/sagor1.jpg ", alt: "Behind the camera" },
      { img: "award pic/wildlife5.jpg", alt: "On location" },
      { img: "award pic/creative2.jpg", alt: "Editing session" },
      { img: "award pic/argentina.jpg", alt: "Studio setup" }
    ],


    /* Row 2 + Row 3 — EDIT ME: 8 cards (4 + 4) */
    cards: [
      {
        id: "about-1",
        img: "award pic/Creative Talent Search 2024.jpg",
        title: "বাংলাদেশ জাতীয় মেধা অন্বেষণ প্রতিযোগিতা ২০২৪",
        // Short text shown on the card (2-3 lines is enough)
        excerpt: "জাতীয় পর্যায়ের এই প্রতিযোগিতায় অংশগ্রহণ করে পুরস্কার অর্জনের অভিজ্ঞতা।",
        // Long text shown on the details page — write as much as you like.
        // Leave a blank line between paragraphs to start a new paragraph.
        detail:
`২০২৪ সালে অনুষ্ঠিত বাংলাদেশ জাতীয় মেধা অন্বেষণ প্রতিযোগিতায় অংশগ্রহণ করার সুযোগ পাই, যা আমার জন্য ছিল এক অসাধারণ অভিজ্ঞতা।

সারা দেশ থেকে আসা মেধাবী শিক্ষার্থীদের সাথে প্রতিযোগিতা করার এই যাত্রায় নিজের সৃজনশীলতা ও দক্ষতা যাচাইয়ের সুযোগ পাই, এবং শেষ পর্যন্ত পুরস্কার অর্জন করতে সক্ষম হই।

এই অর্জন শুধু একটি সনদ নয় — এটি আমাকে আরও পরিশ্রম করার এবং নিজের সেরাটা দেওয়ার অনুপ্রেরণা জুগিয়েছে।`
      },
      {
        id: "about-2",
        img: "award pic/wildlife friend1.jpg",
        title: "ওয়াইল্ডলাইফ অলিম্পিয়াড ২০২৪",
        excerpt: "অংশগ্রহণ, পুরস্কার অর্জন এবং নতুন বন্ধুত্বের এক সুন্দর অভিজ্ঞতা।",
        detail:
`ওয়াইল্ডলাইফ অলিম্পিয়াড ২০২৪-এ অংশগ্রহণ করে প্রকৃতি ও বন্যপ্রাণী সম্পর্কে আরও গভীরভাবে জানার সুযোগ পাই।

এই প্রতিযোগিতায় অংশগ্রহণ করে বিভিন্ন প্রকার পুরস্কার অর্জন করি, যা আমার জন্য ছিল দারুণ এক অর্জন।

সবচেয়ে বড় কথা, এই যাত্রায় অনেক বন্ধু-বান্ধবের সাথে পরিচয় হয় এবং তাদের সাথে একটি চমৎকার নেটওয়ার্ক তৈরি হয়, যা আজও আমার সাথে রয়ে গেছে।`
      },
      {
        id: "about-3",
        img: "award pic/rajshahi startup icon.jpg",
        title: "স্টার্টআপ আইকন রাজশাহী",
        excerpt: "নতুন উদ্ভাবন ও প্রযুক্তি সম্পর্কে জানার একটি অনন্য অভিজ্ঞতা।",
        detail:
`স্টার্টআপ আইকন রাজশাহী প্রোগ্রামে অংশগ্রহণ করার সুযোগ পাই, যেখানে উদ্যোক্তা জগতের নানা দিক সম্পর্কে জানার সুযোগ হয়।

এখানে অংশগ্রহণ করে নতুন নতুন উদ্ভাবন এবং সর্বাধুনিক প্রযুক্তি সম্পর্কে অনেক কিছু জানতে পারি, যা আমার চিন্তাভাবনাকে আরও প্রসারিত করেছে।

এই অভিজ্ঞতা আমাকে শুধু প্রযুক্তির জ্ঞানই দেয়নি, বরং নতুন কিছু তৈরি করার সাহসও জুগিয়েছে।`
      },
      {
        id: "about-4",
        img: "award pic/math1.jpg",
        title: "বাংলাদেশ ম্যাথ অলিম্পিয়াড ২০২৫",
        excerpt: "গণিতের প্রতি ভালোবাসা থেকে এই জাতীয় প্রতিযোগিতায় অংশগ্রহণ।",
        detail:
`২০২৫ সালে বাংলাদেশ ম্যাথ অলিম্পিয়াডে অংশগ্রহণ করার সুযোগ পাই, যা গণিতের প্রতি আমার ভালোবাসা থেকেই একটি স্বাভাবিক পদক্ষেপ ছিল।

দেশের বিভিন্ন প্রান্ত থেকে আসা মেধাবী প্রতিযোগীদের সাথে এক মঞ্চে প্রতিযোগিতা করার এই অভিজ্ঞতা সত্যিই স্মরণীয়।

এই প্রতিযোগিতা আমাকে যুক্তিবাদী চিন্তাভাবনা ও সমস্যা সমাধানের দক্ষতা আরও শাণিত করার সুযোগ দিয়েছে।`
      }
    ]
  },

  /* =======================================================
     MY SKILLS
     ======================================================= */
  skills: {

    /* Row 1 — EDIT ME: 4 top photos */
    topImages: [
      { img: "award pic/cit1.jpg", alt: "Photography skill" },
      { img: "award pic/cit2.jpg", alt: "Editing skill" },
      { img: "award pic/cit3.jpg", alt: "Design skill" },
      { img: "award pic/cit5.jpg", alt: "Video skill" }
    ],

    /* Row 2 + Row 3 — EDIT ME: 8 skill cards (4 + 4) */
    cards: [
      {
        id: "skills-1",
        img: "https://picsum.photos/id/180/900/700",
        title: "Photography",
        excerpt: "Portrait, landscape and event photography across formats.",
        detail:
`Photography is where everything else in my work starts. I'm comfortable across portraits, landscapes, events and product shoots, adapting my style to whatever the subject calls for.

I focus heavily on natural light and composition before reaching for anything artificial — I find it produces images that feel honest rather than manufactured.

Whether it's a quiet portrait session or a fast-moving event, my goal is always the same: capture the moment as it actually felt, not just as it looked.`
      },
      {
        id: "skills-2",
        img: "https://picsum.photos/id/201/900/700",
        title: "Photo editing & retouching",
        excerpt: "Color grading and retouching that enhances, never overdoes.",
        detail:
`My editing philosophy is simple: enhance what's already there, don't replace it. That means careful color grading, subtle retouching, and a lot of restraint.

I work with layered, non-destructive editing workflows so that every image can be revisited or adjusted later without losing quality.

The result is a consistent, polished look across a whole gallery — images that feel like they belong together, without looking artificially uniform.`
      },
      {
        id: "skills-3",
        img: "https://picsum.photos/id/219/900/700",
        title: "Graphic design",
        excerpt: "Clean, modern layouts for print and digital use.",
        detail:
`Alongside photography, I design layouts for both print and digital — everything from social media graphics to printed brochures and album spreads.

I lean toward clean, minimal design with strong typography, letting the photography itself stay the focus rather than competing with heavy design elements.

Good design, to me, is design you don't notice — it just makes the content easier and more pleasant to take in.`
      },
      {
        id: "skills-4",
        img: "https://picsum.photos/id/225/900/700",
        title: "Video editing",
        excerpt: "Short-form and long-form edits with a cinematic feel.",
        detail:
`Video has become a bigger part of my work over the last few years, from short social clips to longer behind-the-scenes documentary-style pieces.

I pay close attention to pacing and sound design — two things that separate a video that feels professional from one that just has nice footage.

Whether it's a 30-second highlight reel or a multi-minute story piece, my aim is to keep the viewer's attention without ever feeling rushed.`
      },
      {
        id: "skills-5",
        img: "https://picsum.photos/id/236/900/700",
        title: "Drone cinematography",
        excerpt: "Aerial perspectives that add scale and context to a story.",
        detail:
`Aerial footage adds a sense of scale that ground-level shots simply can't — especially for landscapes, events and architecture.

I plan every drone flight carefully around safety and local regulations, always prioritizing a responsible flight over a flashy shot.

Used well, a single aerial shot can reframe an entire story — showing the audience the "where" before we bring them back down to the "who."`
      },
      {
        id: "skills-6",
        img: "https://picsum.photos/id/250/900/700",
        title: "Lighting & studio setup",
        excerpt: "Building the right lighting for portraits, products and video.",
        detail:
`Lighting is the difference between a flat image and one that feels alive. I work with both natural light and a compact studio lighting kit depending on the project.

For portraits, I usually build a simple two- or three-light setup that flatters without looking overworked. For product and video work, consistency and control matter more than drama.

I enjoy the technical side of lighting almost as much as the shoot itself — it's where a lot of the "magic" actually happens before the shutter ever clicks.`
      },
      {
        id: "skills-7",
        img: "https://picsum.photos/id/26/900/700",
        title: "Client direction & posing",
        excerpt: "Helping subjects feel natural in front of the camera.",
        detail:
`Most people aren't naturally comfortable in front of a camera, and that's completely normal — part of my job is helping them forget it's even there.

I focus on simple, natural direction rather than rigid posing, giving small prompts and letting genuine expressions happen in between.

By the end of a session, most clients tell me it felt more like a conversation than a photoshoot — which is exactly the goal.`
      },
      {
        id: "skills-8",
        img: "https://picsum.photos/id/28/900/700",
        title: "Project management",
        excerpt: "Keeping shoots, edits and deliveries organized end to end.",
        detail:
`Behind every smooth shoot is a fair amount of planning — timelines, shot lists, backups and clear communication with everyone involved.

I keep a simple, repeatable workflow from initial booking through final delivery, so clients always know what stage their project is at.

It's not the most glamorous skill on this list, but it's often what makes the difference between a stressful shoot and an enjoyable one.`
      }
    ]
  },

  /* =======================================================
     MY AWARDS
     ======================================================= */
  awards: {

    /* Row 1 — EDIT ME: 4 top photos */
    topImages: [
      { img: "https://picsum.photos/id/1029/900/700", alt: "Award ceremony" },
      { img: "https://picsum.photos/id/1039/900/700", alt: "Award winning shot" },
      { img: "https://picsum.photos/id/1044/900/700", alt: "Trophy detail" },
      { img: "https://picsum.photos/id/1047/900/700", alt: "Certificate frame" }
    ],

    /* Row 2 + Row 3 — EDIT ME: 8 award cards (4 + 4) */
    cards: [
      {
        id: "awards-1",
        img: "https://picsum.photos/id/1052/900/700",
        title: "National Photography Award 2023",
        excerpt: "Recognized in the Nature & Landscape category.",
        detail:
`This award came from a single frame taken after nearly three hours of waiting for the right light on a foggy morning — a reminder that patience is often the most underrated skill in landscape photography.

The judging panel highlighted the composition and the way the mist layered the background, something I only noticed myself after reviewing hundreds of frames from that shoot.

Winning in the Nature & Landscape category meant a lot, since it's the genre that first got me into photography in the first place.`
      },
      {
        id: "awards-2",
        img: "https://picsum.photos/id/1056/900/700",
        title: "Wildlife Olympiad Award 2023",
        excerpt: "Honored in the Nature & Landscape category for wildlife work.",
        detail:
`This shot came from an early-morning trip where the subject appeared for barely a few seconds — just enough time for a couple of frames before it moved on.

Wildlife photography demands a different kind of readiness than portrait or event work; there's no second take, no direction, just preparation and reaction.

This recognition pushed me to keep investing time in wildlife work, even though it's often the slowest and least predictable part of what I do.`
      },
      {
        id: "awards-3",
        img: "https://picsum.photos/id/1069/900/700",
        title: "Golden Lens Award 2022",
        excerpt: "Best Portrait Series, recognizing a full body of work.",
        detail:
`Unlike the other awards on this list, this one recognized a full series rather than a single image — a set of portraits built around a shared theme over several months.

Building a cohesive series meant returning to the same subjects multiple times, refining lighting and direction until the set felt like it belonged together.

It remains one of the projects I'm proudest of, precisely because it rewarded patience and consistency rather than a single lucky frame.`
      },
      {
        id: "awards-4",
        img: "https://picsum.photos/id/1073/900/700",
        title: "International Foggy Bridge Award",
        excerpt: "Fine Art category recognition for atmospheric composition.",
        detail:
`This image leaned heavily into mood and atmosphere rather than technical sharpness — a deliberate choice that paid off with this recognition in the Fine Art category.

Fine art photography gives more room for interpretation than documentary work, and this project let me experiment with longer exposures and unconventional framing.

The award reinforced something I already believed: sometimes an imperfect, atmospheric frame says more than a technically "perfect" one.`
      },
      {
        id: "awards-5",
        img: "https://picsum.photos/id/1080/900/700",
        title: "Mountain Vista Award 2021",
        excerpt: "Travel Photography category, captured during a multi-day trek.",
        detail:
`Captured on the third day of a multi-day trek, this frame is the result of carrying camera gear up a mountain at an hour most people would call unreasonable.

Travel photography rewards discomfort more than any other genre I work in — the best light is rarely at the most convenient time or place.

This award holds a special place for me since it came from one of the most physically demanding shoots of my career so far.`
      },
      {
        id: "awards-6",
        img: "https://picsum.photos/id/1084/900/700",
        title: "Regional Portrait Prize 2021",
        excerpt: "Recognized for a single environmental portrait.",
        detail:
`This portrait was shot in the subject's own workspace rather than a studio, aiming to tell a story about who they are through their surroundings rather than posing alone.

Environmental portraits take more planning than studio work — you're managing natural light, background clutter and a subject's comfort all at once.

The recognition here confirmed something I've come to believe: context often says more about a person than a perfectly lit, isolated portrait ever could.`
      },
      {
        id: "awards-7",
        img: "https://picsum.photos/id/1062/900/700",
        title: "Emerging Creator Award 2020",
        excerpt: "Early recognition that encouraged me to go full-time.",
        detail:
`This was one of the earliest recognitions I received, at a point when I was still deciding whether photography could become more than a hobby.

It came from a small local competition, but the encouragement it gave me was disproportionate to its size — it was the push that convinced me to take the work seriously.

Looking back, this award marks the real starting point of everything that followed.`
      },
      {
        id: "awards-8",
        img: "https://picsum.photos/id/1067/900/700",
        title: "Best Emerging Talent 2019",
        excerpt: "My first competitive award, and the one that started it all.",
        detail:
`My very first award, won with a photo I almost didn't submit because I doubted it was good enough — a lesson in not underestimating your own work.

It came at a stage when I had very little formal training, just a lot of curiosity and hours spent shooting whatever was in front of me.

I keep this one close as a reminder of how far consistent practice can take you, even from a completely self-taught starting point.`
      }
    ]
  }

};

// ============================================================
// SafarGuide — Complete Data Store
// All bus companies, schedules, routes, fares, and tips
// ============================================================

const SITE_CONFIG = {
  name: "SafarGuide",
  tagline: "Sukkur se Karachi — Apna Safar Plan Karein",
  taglineUrdu: "سکھر سے کراچی — اپنا سفر پلان کریں",
  totalDistance: 485,
  estimatedTime: "7.5 - 8.5",
  lastUpdated: "September 2026",
  disclaimer: "Ye estimated timings hain. Travel se pehle bus company se confirm zaroor karein."
};

// ============================================================
// BUS COMPANIES
// ============================================================
const BUS_COMPANIES = [
  {
    id: "daewoo",
    name: "Daewoo Express",
    nameUrdu: "دیوو ایکسپریس",
    logo: "🚌",
    color: "#0057A0",
    colorLight: "#E3F0FF",
    rating: 4.5,
    ratingCount: 2840,
    established: 1997,
    description: "Pakistan ka sabse mashhoor aur bharosa mand luxury bus service. Gold class mein behtareen comfort milta hai.",
    phone: "111-007-008",
    website: "https://daewoo.com.pk",
    bookingUrl: "https://bookme.pk",
    terminals: {
      sukkur: "Daewoo Terminal, Sukkur Bypass / Shikarpur Road",
      karachi: "Sohrab Goth Terminal, M-9 Motorway Exit"
    },
    amenities: ["ac", "wifi", "charging", "entertainment", "refreshments", "legroom"],
    tiers: [
      { name: "Standard", seats: "2+2", priceRange: [2400, 2800], features: ["AC", "Reclining Seats"] },
      { name: "Gold Class", seats: "2+1", priceRange: [3500, 4200], features: ["AC", "Extra Legroom", "Personal Screen", "Charging Port", "Blanket"] }
    ]
  },
  {
    id: "faisal",
    name: "Faisal Movers",
    nameUrdu: "فیصل موورز",
    logo: "🚍",
    color: "#D4262C",
    colorLight: "#FFE8E8",
    rating: 4.3,
    ratingCount: 3120,
    established: 1994,
    description: "Pakistan ka sabse bada bus network. Executive se lekar Sleeper tak har class available. Har raat multiple departures.",
    phone: "111-22-44-88",
    website: "https://faisalmovers.com",
    bookingUrl: "https://bookme.pk",
    terminals: {
      sukkur: "Rohri Bypass, Military Road ke qareeb",
      karachi: "Al-Asif Square, Sohrab Goth / Saddar Taj Complex"
    },
    amenities: ["ac", "wifi", "charging", "entertainment", "refreshments", "sleeper"],
    tiers: [
      { name: "Executive", seats: "2+2", priceRange: [2400, 2800], features: ["AC", "Reclining Seats", "Charging"] },
      { name: "Super Executive", seats: "2+1", priceRange: [3200, 3800], features: ["AC", "Extra Legroom", "Charging", "Entertainment"] },
      { name: "Sleeper", seats: "Berth", priceRange: [4500, 5500], features: ["AC", "Full Bed", "Blanket", "Pillow", "Charging", "Curtain"] }
    ]
  },
  {
    id: "khan",
    name: "Khan Movers",
    nameUrdu: "خان موورز",
    logo: "🚐",
    color: "#2E7D32",
    colorLight: "#E8F5E9",
    rating: 4.0,
    ratingCount: 1560,
    established: 2005,
    description: "Affordable aur comfortable travel. Southern Punjab aur Sindh belt mein mashhoor. Competitive pricing.",
    phone: "0311-115-4261",
    website: null,
    bookingUrl: "https://bookkaru.com",
    terminals: {
      sukkur: "General Bus Stand, Lab-e-Mehran",
      karachi: "Sohrab Goth Terminal"
    },
    amenities: ["ac", "charging", "legroom"],
    tiers: [
      { name: "Executive", seats: "2+2", priceRange: [2000, 2500], features: ["AC", "Reclining Seats"] },
      { name: "Business", seats: "2+1", priceRange: [2800, 3500], features: ["AC", "Extra Legroom", "Charging Port"] }
    ]
  },
  {
    id: "niazi",
    name: "Niazi Express",
    nameUrdu: "نیازی ایکسپریس",
    logo: "🚌",
    color: "#FF6F00",
    colorLight: "#FFF3E0",
    rating: 4.1,
    ratingCount: 1890,
    established: 1990,
    description: "Long-distance travel ka experienced operator. Islamabad se Karachi tak — Sukkur route pe reliable service.",
    phone: "111-22-99-99",
    website: "https://niaziexpress.com.pk",
    bookingUrl: "https://bookme.pk",
    terminals: {
      sukkur: "National Highway N-5, Sukkur Stop",
      karachi: "Sohrab Goth / Al-Asif Square"
    },
    amenities: ["ac", "charging", "refreshments"],
    tiers: [
      { name: "Standard", seats: "2+2", priceRange: [2200, 2600], features: ["AC", "Reclining Seats"] },
      { name: "Executive", seats: "2+1", priceRange: [2800, 3200], features: ["AC", "Extra Legroom", "Charging"] }
    ]
  },
  {
    id: "alsaif",
    name: "Al-Saif Coach",
    nameUrdu: "الصیف کوچ",
    logo: "🚐",
    color: "#5C6BC0",
    colorLight: "#E8EAF6",
    rating: 3.8,
    ratingCount: 980,
    established: 2008,
    description: "Budget-friendly AC coach service. Sukkur se Karachi tak sasti aur reliable rides. Zyada departures available.",
    phone: "0300-555-1234",
    website: null,
    bookingUrl: null,
    terminals: {
      sukkur: "General Bus Stand, Military Road",
      karachi: "Sohrab Goth, Lee Market Stop"
    },
    amenities: ["ac"],
    tiers: [
      { name: "Standard AC", seats: "2+2", priceRange: [1500, 2200], features: ["AC", "Basic Seating"] }
    ]
  },
  {
    id: "mashallah",
    name: "Mashallah Coach",
    nameUrdu: "ماشاءاللہ کوچ",
    logo: "🚐",
    color: "#00897B",
    colorLight: "#E0F2F1",
    rating: 3.7,
    ratingCount: 720,
    established: 2010,
    description: "Sasti aur reliable local coach service. Short aur long distance dono ke liye available.",
    phone: "0333-444-5678",
    website: null,
    bookingUrl: null,
    terminals: {
      sukkur: "General Bus Stand, Lab-e-Mehran",
      karachi: "Sohrab Goth Terminal"
    },
    amenities: ["ac"],
    tiers: [
      { name: "Standard AC", seats: "2+2", priceRange: [1500, 2000], features: ["AC", "Basic Seating"] }
    ]
  }
];

// ============================================================
// BUS SCHEDULES
// ============================================================
const SCHEDULES = {
  sukkurToKarachi: {
    night: [
      { companyId: "faisal", tier: "Executive", departure: "20:00", arrival: "04:00", duration: "8h", price: 2600 },
      { companyId: "alsaif", tier: "Standard AC", departure: "20:30", arrival: "05:00", duration: "8.5h", price: 1800 },
      { companyId: "daewoo", tier: "Standard", departure: "21:00", arrival: "05:00", duration: "8h", price: 2600 },
      { companyId: "khan", tier: "Executive", departure: "21:00", arrival: "05:30", duration: "8.5h", price: 2200 },
      { companyId: "mashallah", tier: "Standard AC", departure: "21:00", arrival: "05:30", duration: "8.5h", price: 1700 },
      { companyId: "faisal", tier: "Super Executive", departure: "21:30", arrival: "05:30", duration: "8h", price: 3500 },
      { companyId: "niazi", tier: "Standard", departure: "22:00", arrival: "06:00", duration: "8h", price: 2400 },
      { companyId: "khan", tier: "Business", departure: "22:00", arrival: "06:00", duration: "8h", price: 3000 },
      { companyId: "alsaif", tier: "Standard AC", departure: "22:00", arrival: "06:30", duration: "8.5h", price: 1800 },
      { companyId: "daewoo", tier: "Gold Class", departure: "22:30", arrival: "06:30", duration: "8h", price: 3800 },
      { companyId: "faisal", tier: "Sleeper", departure: "23:00", arrival: "07:00", duration: "8h", price: 5000 },
      { companyId: "niazi", tier: "Executive", departure: "23:00", arrival: "07:00", duration: "8h", price: 3000 },
      { companyId: "alsaif", tier: "Standard AC", departure: "23:00", arrival: "07:30", duration: "8.5h", price: 1800 },
      { companyId: "khan", tier: "Executive", departure: "23:30", arrival: "07:30", duration: "8h", price: 2200 },
      { companyId: "daewoo", tier: "Standard", departure: "00:00", arrival: "08:00", duration: "8h", price: 2600 },
      { companyId: "faisal", tier: "Executive", departure: "00:30", arrival: "08:30", duration: "8h", price: 2600 },
      { companyId: "alsaif", tier: "Standard AC", departure: "01:00", arrival: "09:30", duration: "8.5h", price: 1500 },
      { companyId: "mashallah", tier: "Standard AC", departure: "01:30", arrival: "10:00", duration: "8.5h", price: 1500 }
    ],
    morning: [
      { companyId: "daewoo", tier: "Standard", departure: "08:00", arrival: "16:00", duration: "8h", price: 2600 },
      { companyId: "faisal", tier: "Executive", departure: "08:30", arrival: "16:30", duration: "8h", price: 2600 },
      { companyId: "khan", tier: "Executive", departure: "09:00", arrival: "17:30", duration: "8.5h", price: 2200 },
      { companyId: "niazi", tier: "Standard", departure: "11:00", arrival: "19:00", duration: "8h", price: 2400 },
      { companyId: "daewoo", tier: "Gold Class", departure: "14:00", arrival: "22:00", duration: "8h", price: 3800 },
      { companyId: "faisal", tier: "Super Executive", departure: "14:30", arrival: "22:30", duration: "8h", price: 3500 }
    ]
  },
  karachiToSukkur: {
    night: [
      { companyId: "daewoo", tier: "Standard", departure: "20:00", arrival: "04:00", duration: "8h", price: 2600 },
      { companyId: "faisal", tier: "Executive", departure: "20:00", arrival: "04:00", duration: "8h", price: 2600 },
      { companyId: "alsaif", tier: "Standard AC", departure: "20:30", arrival: "05:00", duration: "8.5h", price: 1800 },
      { companyId: "khan", tier: "Executive", departure: "21:00", arrival: "05:30", duration: "8.5h", price: 2200 },
      { companyId: "faisal", tier: "Super Executive", departure: "21:30", arrival: "05:30", duration: "8h", price: 3500 },
      { companyId: "daewoo", tier: "Gold Class", departure: "22:00", arrival: "06:00", duration: "8h", price: 3800 },
      { companyId: "niazi", tier: "Executive", departure: "22:00", arrival: "06:00", duration: "8h", price: 3000 },
      { companyId: "mashallah", tier: "Standard AC", departure: "22:00", arrival: "06:30", duration: "8.5h", price: 1700 },
      { companyId: "alsaif", tier: "Standard AC", departure: "22:30", arrival: "07:00", duration: "8.5h", price: 1800 },
      { companyId: "faisal", tier: "Sleeper", departure: "23:00", arrival: "07:00", duration: "8h", price: 5000 },
      { companyId: "khan", tier: "Business", departure: "23:00", arrival: "07:00", duration: "8h", price: 3000 },
      { companyId: "daewoo", tier: "Standard", departure: "00:00", arrival: "08:00", duration: "8h", price: 2600 },
      { companyId: "alsaif", tier: "Standard AC", departure: "01:00", arrival: "09:30", duration: "8.5h", price: 1500 }
    ],
    morning: [
      { companyId: "daewoo", tier: "Standard", departure: "08:00", arrival: "16:00", duration: "8h", price: 2600 },
      { companyId: "faisal", tier: "Executive", departure: "09:00", arrival: "17:00", duration: "8h", price: 2600 },
      { companyId: "khan", tier: "Executive", departure: "10:00", arrival: "18:30", duration: "8.5h", price: 2200 },
      { companyId: "niazi", tier: "Standard", departure: "11:00", arrival: "19:00", duration: "8h", price: 2400 },
      { companyId: "daewoo", tier: "Gold Class", departure: "14:00", arrival: "22:00", duration: "8h", price: 3800 }
    ]
  }
};

// ============================================================
// ROUTE STOPS
// ============================================================
const ROUTE_STOPS = [
  {
    id: 1,
    city: "Sukkur",
    cityUrdu: "سکھر",
    distanceFromStart: 0,
    timeFromStart: "0 min",
    description: "Safar ka aghaz — Upper Sindh ka industrial hub. Lansdowne Bridge aur Sukkur Barrage yahan ke mashoor maqamaat hain.",
    isStart: true,
    isEnd: false,
    isMajorStop: true,
    hasBreak: false,
    icon: "🟢",
    lat: 27.7052,
    lng: 68.8574
  },
  {
    id: 2,
    city: "Khairpur",
    cityUrdu: "خیرپور",
    distanceFromStart: 30,
    timeFromStart: "30 min",
    description: "Sindh ke qadam shareef se mashhoor — Khairpur Mirs ka historic sheher. Yahan se kuch passengers board karte hain.",
    isStart: false,
    isEnd: false,
    isMajorStop: false,
    hasBreak: false,
    icon: "📍",
    lat: 27.5295,
    lng: 68.7592
  },
  {
    id: 3,
    city: "Ranipur",
    cityUrdu: "رانی پور",
    distanceFromStart: 75,
    timeFromStart: "1 hr",
    description: "Chhota sa sheher — bus yahan thodi der ke liye speed slow karti hai. National Highway N-5 pe.",
    isStart: false,
    isEnd: false,
    isMajorStop: false,
    hasBreak: false,
    icon: "📍",
    lat: 27.2876,
    lng: 68.5048
  },
  {
    id: 4,
    city: "Moro",
    cityUrdu: "مورو",
    distanceFromStart: 150,
    timeFromStart: "2 hr",
    description: "⚡ MAJOR STOP — Yahan 30-45 minute ka break hota hai! Chai, khaana, washroom. Highway dhabe mashhoor hain.",
    isStart: false,
    isEnd: false,
    isMajorStop: true,
    hasBreak: true,
    icon: "☕",
    lat: 26.6633,
    lng: 68.0000
  },
  {
    id: 5,
    city: "Nawabshah",
    cityUrdu: "نوابشاہ",
    distanceFromStart: 210,
    timeFromStart: "3 hr",
    description: "Shaheed Benazirabad — Sindh ka aik aur bara sheher. Yahan se bhi passengers board/alight karte hain.",
    isStart: false,
    isEnd: false,
    isMajorStop: true,
    hasBreak: false,
    icon: "📍",
    lat: 26.2442,
    lng: 68.4100
  },
  {
    id: 6,
    city: "Hala",
    cityUrdu: "ہالا",
    distanceFromStart: 260,
    timeFromStart: "3.5 hr",
    description: "Handicrafts aur pottery ke liye mashhoor. Shah Abdul Latif Bhittai ka mazar yahan hai.",
    isStart: false,
    isEnd: false,
    isMajorStop: false,
    hasBreak: false,
    icon: "📍",
    lat: 25.8156,
    lng: 68.4219
  },
  {
    id: 7,
    city: "Hyderabad",
    cityUrdu: "حیدرآباد",
    distanceFromStart: 340,
    timeFromStart: "5.5 hr",
    description: "Sindh ka doosra sabse bada sheher! Yahan se M-9 Motorway shuru hoti hai Karachi ki taraf. Major passenger stop.",
    isStart: false,
    isEnd: false,
    isMajorStop: true,
    hasBreak: false,
    icon: "🏙️",
    lat: 25.3960,
    lng: 68.3578
  },
  {
    id: 8,
    city: "Karachi",
    cityUrdu: "کراچی",
    distanceFromStart: 485,
    timeFromStart: "8 hr",
    description: "Manzil mubarak! Pakistan ka sabse bada sheher aur economic hub. Sohrab Goth terminal pe utarein.",
    isStart: false,
    isEnd: true,
    isMajorStop: true,
    hasBreak: false,
    icon: "🔴",
    lat: 24.8607,
    lng: 67.0011
  }
];

// ============================================================
// AMENITY ICONS MAP
// ============================================================
const AMENITY_ICONS = {
  ac: { icon: "❄️", label: "AC" },
  wifi: { icon: "📶", label: "WiFi" },
  charging: { icon: "🔌", label: "Charging Port" },
  entertainment: { icon: "🎬", label: "Entertainment" },
  refreshments: { icon: "🥤", label: "Refreshments" },
  legroom: { icon: "🦵", label: "Extra Legroom" },
  sleeper: { icon: "🛏️", label: "Sleeper Berth" }
};

// ============================================================
// TRAVEL TIPS
// ============================================================
const TRAVEL_TIPS = [
  {
    category: "Safar se Pehle",
    icon: "📋",
    tips: [
      "Ticket pehle se book karein — especially weekends aur chutti ke dinon mein rush hota hai.",
      "Terminal pe departure se kam az kam 30 minute pehle pahunchein.",
      "CNIC (Computerized National Identity Card) saath rakhein — zaroori hai.",
      "Phone charger aur power bank zaroor rakhein."
    ]
  },
  {
    category: "Raat ka Safar",
    icon: "🌙",
    tips: [
      "Raat 9-10 baje ki buses sabse popular hain — subah 5-6 baje Karachi pahunch jao ge.",
      "Halka garam kapra rakhein — bus mein AC bohot thanda hota hai.",
      "Khaana khake chalein — Moro pe sirf chai/snacks milte hain.",
      "Qeemti cheezein apne paas rakhein, seat ke neeche ya rack pe nahi."
    ]
  },
  {
    category: "Budget Tips",
    icon: "💰",
    tips: [
      "Al-Saif aur Mashallah Coach sabse sasti hain — PKR 1,500 se shuru.",
      "Weekdays pe travel karein — weekend se sasta padta hai.",
      "Online booking pe kabhi kabhi discount milta hai (Bookme.pk).",
      "Standard class kaafi comfortable hai — zaroori nahi ke Business lein."
    ]
  },
  {
    category: "Comfort Tips",
    icon: "😌",
    tips: [
      "Window seat lein agar landscape dekhna hai, aisle seat lein agar uthna hai aasan.",
      "Neck pillow laye to bohot aaram milega raat ke safar mein.",
      "Headphones laye — apna music/podcast sunein.",
      "Pani ki bottle saath rakhein — bus mein mushkil se milta hai."
    ]
  }
];

// ============================================================
// FAQ DATA
// ============================================================
const FAQ_DATA = [
  {
    question: "Sukkur se Karachi kitna time lagta hai bus se?",
    answer: "Express/luxury buses (Daewoo, Faisal Movers) mein 7.5 se 8.5 ghante lagte hain, including ek break. Local coaches mein 9 se 10.5 ghante lag sakte hain."
  },
  {
    question: "Sabse sasti bus kaunsi hai?",
    answer: "Al-Saif Coach aur Mashallah Coach sabse sasti hain — PKR 1,500 se shuru. Ye standard AC coaches hain, comfortable lekin basic amenities ke saath."
  },
  {
    question: "Raat ko safar karna safe hai?",
    answer: "Haan, bilkul safe hai! Major companies (Daewoo, Faisal Movers) ke drivers trained hain aur buses well-maintained hain. N-5 highway aur M-9 motorway dono well-lit hain. Raat ka safar actually zyada popular hai."
  },
  {
    question: "Kya bachon ke liye ticket lagta hai?",
    answer: "3 saal se kam umar ke bachon ka ticket nahi lagta agar wo goud mein baithein. 3 se 10 saal ke bachon ka half ticket lagta hai. 10 se upar full ticket."
  },
  {
    question: "Luggage limit kya hai?",
    answer: "Aam tor pe 2 bags (40-50 kg total) allow hain. Extra luggage ke liye chhota charge lag sakta hai. Qeemti saamaan apne paas rakhein."
  },
  {
    question: "Bus mein khaana milta hai?",
    answer: "Luxury buses (Daewoo Gold, Faisal Sleeper) mein light refreshments milte hain. Baqi sab mein Moro stop pe 30-45 min ka break hota hai jahan khaana/chai mil jata hai."
  },
  {
    question: "Online ticket kaise book karein?",
    answer: "Bookme.pk ya Bookkaru.com pe jaake route (Sukkur → Karachi) select karein, date choose karein, bus select karein, seat choose karein, aur online payment karein (JazzCash, Easypaisa, ya card)."
  },
  {
    question: "Karachi mein bus kahan utarti hai?",
    answer: "Zyada tar buses Sohrab Goth (Al-Asif Square / Gateway Terminal) pe utarti hain. Kuch buses Saddar (Taj Complex) tak bhi jaati hain. Daewoo ki shuttle Sohrab Goth se Saddar tak le jaati hai."
  }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function getCompanyById(id) {
  return BUS_COMPANIES.find(c => c.id === id);
}

function getSchedules(direction, shift) {
  return SCHEDULES[direction]?.[shift] || [];
}

function formatTime(time24) {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function formatPrice(price) {
  return `PKR ${price.toLocaleString()}`;
}

function getStarRating(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function filterSchedules(schedules, filters = {}) {
  let filtered = [...schedules];

  if (filters.company) {
    filtered = filtered.filter(s => s.companyId === filters.company);
  }
  if (filters.maxPrice) {
    filtered = filtered.filter(s => s.price <= filters.maxPrice);
  }
  if (filters.tier) {
    filtered = filtered.filter(s => s.tier === filters.tier);
  }

  if (filters.sortBy === 'price') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'departure') {
    filtered.sort((a, b) => a.departure.localeCompare(b.departure));
  } else if (filters.sortBy === 'arrival') {
    filtered.sort((a, b) => a.arrival.localeCompare(b.arrival));
  }

  return filtered;
}

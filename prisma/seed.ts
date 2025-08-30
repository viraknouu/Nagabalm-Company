import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await prisma.teamMember.deleteMany();
  await prisma.teamCategory.deleteMany();
  await prisma.location.deleteMany();
  await prisma.locationCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create Categories
  console.log("📂 Creating categories...");

  const balmsCategory = await prisma.category.create({
    data: {
      slug: "balms",
      translations: {
        en: {
          name: "Balms",
        },
        km: {
          name: "ក្រែម",
        },
      },
    },
  });

  const oilsCategory = await prisma.category.create({
    data: {
      slug: "oils",
      translations: {
        en: {
          name: "Oils",
        },
        km: {
          name: "ប្រេង",
        },
      },
    },
  });

  const spraysCategory = await prisma.category.create({
    data: {
      slug: "sprays",
      translations: {
        en: {
          name: "Sprays",
        },
        km: {
          name: "ស្ព្រេ",
        },
      },
    },
  });

  const inhalersCategory = await prisma.category.create({
    data: {
      slug: "inhalers",
      translations: {
        en: {
          name: "Inhalers",
        },
        km: {
          name: "ឧបករណ៍ដកដង្ហើម",
        },
      },
    },
  });

  console.log("✅ Categories created successfully!");

  // Create Products
  console.log("🛍️ Creating products...");

  // Balm Products
  await prisma.product.create({
    data: {
      slug: "naga-balm-original",
      images: ["/images/Images for NB/Naga-Balm-Original.jpg"],
      price: 2.5,
      isTopSell: true,
      translations: {
        en: {
          name: "Naga Balm Original",
          description:
            "Traditional herbal balm for muscle relief and pain management. Made with natural ingredients following ancient Khmer recipes.",
        },
        km: {
          name: "នាគបាម ដើម",
          description:
            "ក្រែមឱសធបុរាណសម្រាប់បំបាត់ការឈឺចាប់និងសម្រាកសាច់ដុំ។ ផលិតពីគ្រឿងផ្សំធម្មជាតិតាមរូបមន្តបុរាណខ្មែរ។",
        },
      },
      categoryId: balmsCategory.id,
    },
  });

  await prisma.product.create({
    data: {
      slug: "naga-balm-fire",
      images: ["/images/Images for NB/Naga-Balm-Fire.jpg"],
      price: 2.75,
      isTopSell: true,
      translations: {
        en: {
          name: "Naga Balm Fire",
          description:
            "Extra strength warming balm for deep muscle relief. Perfect for athletes and active individuals.",
        },
        km: {
          name: "នាគបាម ភ្លើង",
          description:
            "ក្រែមកម្តៅខ្លាំងសម្រាប់បំបាត់ការឈឺចាប់ជ្រៅ។ ល្អសម្រាប់អ្នកកីឡានិងអ្នកសកម្ម។",
        },
      },
      categoryId: balmsCategory.id,
    },
  });

  await prisma.product.create({
    data: {
      slug: "naga-balm-ice",
      images: ["/images/Images for NB/Naga-Balm-Ice.jpg"],
      price: 2.75,
      isTopSell: false,
      translations: {
        en: {
          name: "Naga Balm Ice",
          description:
            "Cooling balm for instant relief from heat and inflammation. Refreshing menthol formula.",
        },
        km: {
          name: "នាគបាម ទឹកកក",
          description:
            "ក្រែមត្រជាក់សម្រាប់បំបាត់កំដៅនិងការរលាក។ រូបមន្តម៉ិនថលធម្មជាតិ។",
        },
      },
      categoryId: balmsCategory.id,
    },
  });

  await prisma.product.create({
    data: {
      slug: "naga-balm-go",
      images: ["/images/Images for NB/Naga-Balm-Go.jpg"],
      price: 3.0,
      isTopSell: true,
      translations: {
        en: {
          name: "Naga Balm Go",
          description:
            "Portable balm stick for on-the-go relief. Convenient and mess-free application.",
        },
        km: {
          name: "នាគបាម ហ្គោ",
          description:
            "ក្រែមកាំបិតសម្រាប់ការប្រើប្រាស់ងាយស្រួល។ ការលាបមិនរញ៉េរញ៉ៃ។",
        },
      },
      categoryId: balmsCategory.id,
    },
  });

  // Oil Products
  await prisma.product.create({
    data: {
      slug: "liniment-oil-energizing",
      images: ["/images/Images for NB/Leniment-Oil-Energizing.jpg"],
      price: 4.5,
      isTopSell: false,
      translations: {
        en: {
          name: "Liniment Oil Energizing",
          description:
            "Energizing massage oil to boost circulation and vitality. Perfect for pre-workout preparation.",
        },
        km: {
          name: "ប្រេងម៉ាស្សាស ថាមពល",
          description:
            "ប្រេងម៉ាស្សាសបង្កើនថាមពលដើម្បីជំរុញចលនាឈាមនិងភាពរស់រវើក។ ល្អសម្រាប់រៀបចំមុនហាត់ប្រាណ។",
        },
      },
      categoryId: oilsCategory.id,
    },
  });

  await prisma.product.create({
    data: {
      slug: "liniment-oil-extreme",
      images: ["/images/Images for NB/Leniment-Oil-Extreme.jpg"],
      price: 5.0,
      isTopSell: false,
      translations: {
        en: {
          name: "Liniment Oil Extreme",
          description:
            "Maximum strength massage oil for severe muscle tension and deep tissue relief.",
        },
        km: {
          name: "ប្រេងម៉ាស្សាស ខ្លាំង",
          description:
            "ប្រេងម៉ាស្សាសកម្រិតខ្ពស់សម្រាប់ការតានតឹងសាច់ដុំធ្ងន់ធ្ងរនិងការបំបាត់ការឈឺចាប់ជ្រៅ។",
        },
      },
      categoryId: oilsCategory.id,
    },
  });

  // Spray Products
  await prisma.product.create({
    data: {
      slug: "energizing-spray",
      images: ["/images/Images for NB/Energizing-Spray.jpg"],
      price: 3.75,
      isTopSell: false,
      translations: {
        en: {
          name: "Energizing Spray",
          description:
            "Quick-acting spray for instant energy boost and muscle activation. Easy to apply anywhere.",
        },
        km: {
          name: "ស្ព្រេថាមពល",
          description:
            "ស្ព្រេប្រើប្រាស់រហ័សសម្រាប់បង្កើនថាមពលភ្លាមៗនិងធ្វើឱ្យសាច់ដុំសកម្ម។ ងាយស្រួលប្រើគ្រប់ទីកន្លែង។",
        },
      },
      categoryId: spraysCategory.id,
    },
  });

  await prisma.product.create({
    data: {
      slug: "mosquito-repellent",
      images: ["/images/Images for NB/NagaBalm-MosquitoRepellent.jpg"],
      price: 3.25,
      isTopSell: false,
      translations: {
        en: {
          name: "Mosquito Repellent",
          description:
            "Natural mosquito repellent spray with herbal ingredients. Safe and effective protection.",
        },
        km: {
          name: "ថ្នាំបណ្តេញមូស",
          description:
            "ស្ព្រេបណ្តេញមូសធម្មជាតិដែលមានគ្រឿងផ្សំឱសថ។ ការការពារមានសុវត្ថិភាពនិងមានប្រសិទ្ធភាព។",
        },
      },
      categoryId: spraysCategory.id,
    },
  });

  // Inhaler Products
  await prisma.product.create({
    data: {
      slug: "roll-on-inhaler",
      images: ["/images/Images for NB/RollOn.jpg"],
      price: 2.25,
      isTopSell: false,
      translations: {
        en: {
          name: "Roll-On Inhaler",
          description:
            "Convenient roll-on inhaler for respiratory relief and aromatherapy benefits.",
        },
        km: {
          name: "ឧបករណ៍ដកដង្ហើមរំកិល",
          description:
            "ឧបករណ៍ដកដង្ហើមរំកិលងាយស្រួលសម្រាប់បំបាត់ការលំបាកដកដង្ហើមនិងអត្ថប្រយោជន៍ក្លិនអរូម៉ា។",
        },
      },
      categoryId: inhalersCategory.id,
    },
  });

  console.log("✅ Products created successfully!");

  // Create Location Categories
  console.log("📍 Creating location categories...");

  const martsCategory = await prisma.locationCategory.create({
    data: {
      slug: "marts",
      translations: {
        en: {
          name: "Marts",
        },
        km: {
          name: "ហាងលក់ទំនិញ",
        },
      },
    },
  });

  const pharmacyCategory = await prisma.locationCategory.create({
    data: {
      slug: "pharmacy",
      translations: {
        en: {
          name: "Pharmacy",
        },
        km: {
          name: "ឱសថស្ថាន",
        },
      },
    },
  });

  const clubsFitnessCategory = await prisma.locationCategory.create({
    data: {
      slug: "clubs-fitness",
      translations: {
        en: {
          name: "Clubs & Fitness",
        },
        km: {
          name: "ក្លឹបនិងហាត់ប្រាណ",
        },
      },
    },
  });

  const specialtyStoresCategory = await prisma.locationCategory.create({
    data: {
      slug: "specialty-stores",
      translations: {
        en: {
          name: "Specialty Stores",
        },
        km: {
          name: "ហាងជំនាញ",
        },
      },
    },
  });

  console.log("✅ Location categories created successfully!");

  // Create Locations
  console.log("🏪 Creating locations...");

  // Marts
  await prisma.location.create({
    data: {
      slug: "7-eleven",
      logo: "/images/partners/7-11.png",
      translations: {
        en: { name: "7-Eleven" },
        km: { name: "៧-អេលេវិន" },
      },
      categoryId: martsCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "total-bonjour-mart",
      logo: "/images/partners/Total Bonjour Mart.png",
      translations: {
        en: { name: "Total Bonjour Mart" },
        km: { name: "តូតាល់ បុងជួរ ម៉ាត" },
      },
      categoryId: martsCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "super-duper",
      logo: "/images/partners/SuperDuper.png",
      translations: {
        en: { name: "Super Duper" },
        km: { name: "ស៊ុបប៊ឺ ឌុបប៊ឺ" },
      },
      categoryId: martsCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "circle-k",
      logo: "/images/partners/Circle K.png",
      translations: {
        en: { name: "Circle K" },
        km: { name: "ស៊ឺគល K" },
      },
      categoryId: martsCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "21-degree-mart",
      logo: "/images/partners/21 Degree.jpg",
      translations: {
        en: { name: "21° Mart" },
        km: { name: "២១ ដឺក្រេ ម៉ាត" },
      },
      categoryId: martsCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "shop-satu",
      logo: "/images/partners/Shop Satu.jpg",
      translations: {
        en: { name: "Shop SATU" },
        km: { name: "ហាង សាទូ" },
      },
      categoryId: martsCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "phnom-penh-international-airport",
      logo: "/images/partners/Phnom Penh International Airport.png",
      translations: {
        en: { name: "Phnom Penh International Airport" },
        km: { name: "អាកាសយានដ្ឋានអន្តរជាតិភ្នំពេញ" },
      },
      categoryId: martsCategory.id,
    },
  });

  // Pharmacies
  await prisma.location.create({
    data: {
      slug: "point-sante-pharmacy",
      logo: "/images/partners/Point Sante Pharmacy.jpg",
      translations: {
        en: { name: "Point Santé Pharmacy" },
        km: { name: "ឱសថស្ថាន ពយិន សាន់តេ" },
      },
      categoryId: pharmacyCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "aosot-plus-pharmacy",
      logo: "/images/partners/Aosot Plus.jpg",
      translations: {
        en: { name: "Aosot Plus Pharmacy" },
        km: { name: "ឱសថស្ថាន អាវសុត ផ្លាស់" },
      },
      categoryId: pharmacyCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "pharmacy-chhat",
      logo: "/images/partners/Pharmacy Chhat.jpg",
      translations: {
        en: { name: "Pharmacy Chhat" },
        km: { name: "ឱសថស្ថាន ឆាត" },
      },
      categoryId: pharmacyCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "pharmacy-phsar-chas",
      logo: "/images/partners/Pharmacy Phsar Chas.jpg",
      translations: {
        en: { name: "Pharmacy Phsar Chas" },
        km: { name: "ឱសថស្ថាន ផ្សារចាស់" },
      },
      categoryId: pharmacyCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "our-pharmacy-bkk",
      logo: "/images/partners/Our Pharmacy BKK.jpg",
      translations: {
        en: { name: "Our Pharmacy BKK" },
        km: { name: "ឱសថស្ថាន យើង BKK" },
      },
      categoryId: pharmacyCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "medilance-pharmacy",
      logo: "/images/partners/Medilance Pharmacy.jpg",
      translations: {
        en: { name: "Medilance Pharmacy" },
        km: { name: "ឱសថស្ថាន មេឌីឡាន់ស" },
      },
      categoryId: pharmacyCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "hrk-care-pharmacy",
      logo: "/images/partners/HRK Care.jpg",
      translations: {
        en: { name: "HRK Care Pharmacy" },
        km: { name: "ឱសថស្ថាន HRK ខែរ" },
      },
      categoryId: pharmacyCategory.id,
    },
  });

  // Clubs & Fitness
  await prisma.location.create({
    data: {
      slug: "phnom-penh-sport-club",
      logo: "/images/partners/Phnom Penh Sport CLub.jpg",
      translations: {
        en: { name: "Phnom Penh Sport Club" },
        km: { name: "ក្លឹបកីឡាភ្នំពេញ" },
      },
      categoryId: clubsFitnessCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "inter-badminton-club",
      logo: "/images/partners/Inter Badminton Club.jpg",
      translations: {
        en: { name: "Inter Badminton Club" },
        km: { name: "ក្លឹបបាតមីនតុន អ៊ីនធើ" },
      },
      categoryId: clubsFitnessCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "interter-club",
      logo: "/images/partners/Interter Club.jpg",
      translations: {
        en: { name: "Interter Club" },
        km: { name: "ក្លឹប អ៊ីនធើធើ" },
      },
      categoryId: clubsFitnessCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "sen-bunthen-club",
      logo: "/images/partners/Sen Bunthen Club.png",
      translations: {
        en: { name: "Sen Bunthen Club" },
        km: { name: "ក្លឹប សែន បុន្ថែន" },
      },
      categoryId: clubsFitnessCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "the-ring-fitness-club",
      logo: "/images/partners/The Ring Fitness Club.png",
      translations: {
        en: { name: "The Ring Fitness Club" },
        km: { name: "ក្លឹបហាត់ប្រាណ ឌឹ រីង" },
      },
      categoryId: clubsFitnessCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "kingdom-fight-gym",
      logo: "/images/partners/Kingdom Fight Gym.jfif",
      translations: {
        en: { name: "Kingdom Fight Gym" },
        km: { name: "ហាត់ប្រាណប្រយុទ្ធ ព្រះរាជាណាចក្រ" },
      },
      categoryId: clubsFitnessCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "villa-martial-art",
      logo: "/images/partners/Villa Martial Art.jpg",
      translations: {
        en: { name: "Villa Martial Art" },
        km: { name: "វីឡា ក្បាច់គុន" },
      },
      categoryId: clubsFitnessCategory.id,
    },
  });

  // Specialty Stores
  await prisma.location.create({
    data: {
      slug: "kabas-concept-store",
      logo: "/images/partners/Kabas Concept store.jpg",
      translations: {
        en: { name: "Kabas Concept Store" },
        km: { name: "ហាង កាបាស់ កុនសិប" },
      },
      categoryId: specialtyStoresCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "for-someone-i-like",
      logo: "/images/partners/For Someone I Like.jpg",
      translations: {
        en: { name: "For Someone I Like" },
        km: { name: "សម្រាប់អ្នកដែលខ្ញុំចូលចិត្ត" },
      },
      categoryId: specialtyStoresCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "babel-guesthouse",
      logo: "/images/partners/Babel Guesthouse.jpg",
      translations: {
        en: { name: "Babel Guesthouse" },
        km: { name: "ផ្ទះសំណាក់ បាបែល" },
      },
      categoryId: specialtyStoresCategory.id,
    },
  });

  await prisma.location.create({
    data: {
      slug: "kun-khmer-international-federation",
      logo: "/images/partners/Kun Khmer international Federation.jpg",
      translations: {
        en: { name: "Kun Khmer International Federation" },
        km: { name: "សហព័ន្ធអន្តរជាតិកុនខ្មែរ" },
      },
      categoryId: specialtyStoresCategory.id,
    },
  });

  console.log("✅ Locations created successfully!");

  // Create Team Categories
  console.log("👥 Creating team categories...");

  const ourTeamCategory = await prisma.teamCategory.create({
    data: {
      slug: "our-team",
      translations: {
        en: {
          name: "Our Team",
        },
        km: {
          name: "ក្រុមការងាររបស់យើង",
        },
      },
    },
  });

  const facilityTeamCategory = await prisma.teamCategory.create({
    data: {
      slug: "facility-team",
      translations: {
        en: {
          name: "Facility Team",
        },
        km: {
          name: "ក្រុមការងារកន្លែងធ្វើការ",
        },
      },
    },
  });

  console.log("✅ Team categories created successfully!");

  // Create Team Members
  console.log("🧑‍💼 Creating team members...");

  // Our Team Members
  await prisma.teamMember.create({
    data: {
      slug: "robert-esposito",
      image:
        "/images/Team Photo/Individual/1. Robert Esposito - Founder and CEO.jpg",
      translations: {
        en: {
          name: "Robert Esposito",
          role: "Founder and CEO",
        },
        km: {
          name: "រ៉ូបឺត អេស្ប៉ូស៊ីតូ",
          role: "ស្ថាបនិកនិងនាយកប្រតិបត្តិ",
        },
      },
      categoryId: ourTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "sovisal-jerry-meach",
      image:
        "/images/Team Photo/Individual/2.Sovisal Jerry Meach-Co -Founder.jpg",
      translations: {
        en: {
          name: "Sovisal Jerry Meach",
          role: "Director of Business Development",
        },
        km: {
          name: "សុវិសាល ជេរី មាច",
          role: "នាយកអភិវឌ្ឍន៍អាជីវកម្ម",
        },
      },
      categoryId: ourTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "moeun-putheamony",
      image:
        "/images/Team Photo/Individual/3. Moeun Putheamony - HR & Finance Manager.jpg",
      translations: {
        en: {
          name: "Moeun Putheamony",
          role: "HR & Finance Manager",
        },
        km: {
          name: "មឿន ពុទ្ធាមុនី",
          role: "អ្នកគ្រប់គ្រងធនធានមនុស្សនិងហិរញ្ញវត្ថុ",
        },
      },
      categoryId: ourTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "ses-sarom",
      image: "/images/Team Photo/Individual/4. Ses Sarom - Sale Supervisor.jpg",
      translations: {
        en: {
          name: "Ses Sarom",
          role: "Sales Supervisor",
        },
        km: {
          name: "សេស សារុម",
          role: "ប្រធានផ្នែកលក់",
        },
      },
      categoryId: ourTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "nou-virak",
      image:
        "/images/Staff Photo/Individual/5. Nou Virak-Makerting and Communication Officer.jpg",
      translations: {
        en: {
          name: "Nou Virak",
          role: "Marketing and Communications Officer",
        },
        km: {
          name: "នូ វីរៈ",
          role: "មន្ត្រីទីផ្សារនិងទំនាក់ទំនង",
        },
      },
      categoryId: ourTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "chhen-vannak",
      image:
        "/images/Team Photo/Individual/6. Chhen Vannak - Visual Creative Specialist.jpg",
      translations: {
        en: {
          name: "Chhen Vannak",
          role: "Visual Creative Specialist",
        },
        km: {
          name: "ឈិន វណ្ណៈ",
          role: "អ្នកជំនាញច្នៃប្រឌិតរូបភាព",
        },
      },
      categoryId: ourTeamCategory.id,
    },
  });

  // Facility Team Members
  await prisma.teamMember.create({
    data: {
      slug: "korng-sreysor",
      image: "/images/Team Photo/Individual/Facility Tam/Korng Sreysor.jpg",
      translations: {
        en: {
          name: "Korng Sreysor",
          role: "Facility Team",
        },
        km: {
          name: "គង់ ស្រីសរ",
          role: "ក្រុមការងារកន្លែងធ្វើការ",
        },
      },
      categoryId: facilityTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "sem-tola",
      image: "/images/Team Photo/Individual/Facility Tam/Sem Tola.jpg",
      translations: {
        en: {
          name: "Sem Tola",
          role: "Facility Team",
        },
        km: {
          name: "សែម តុលា",
          role: "ក្រុមការងារកន្លែងធ្វើការ",
        },
      },
      categoryId: facilityTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "kimhouy-aok",
      image: "/images/Team Photo/Individual/Facility Tam/KimHouy Aok.jpg",
      translations: {
        en: {
          name: "KimHouy Aok",
          role: "Facility Team",
        },
        km: {
          name: "គឹមហួយ អោក",
          role: "ក្រុមការងារកន្លែងធ្វើការ",
        },
      },
      categoryId: facilityTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "vann-sreypich",
      image: "/images/Team Photo/Individual/Facility Tam/Vann Sreypich.jpg",
      translations: {
        en: {
          name: "Vann Sreypich",
          role: "Facility Team",
        },
        km: {
          name: "វ៉ាន់ ស្រីពេជ្រ",
          role: "ក្រុមការងារកន្លែងធ្វើការ",
        },
      },
      categoryId: facilityTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "john-souphea",
      image: "/images/Team Photo/Individual/Facility Tam/John Souphea.jpg",
      translations: {
        en: {
          name: "John Souphea",
          role: "Facility Team",
        },
        km: {
          name: "ចន សុភា",
          role: "ក្រុមការងារកន្លែងធ្វើការ",
        },
      },
      categoryId: facilityTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "phorn-sokin",
      image: "/images/Team Photo/Individual/Facility Tam/Phorn Sokin.jpg",
      translations: {
        en: {
          name: "Phorn Sokin",
          role: "Facility Team",
        },
        km: {
          name: "ភន សុគិន",
          role: "ក្រុមការងារកន្លែងធ្វើការ",
        },
      },
      categoryId: facilityTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "thida-emmav",
      image: "/images/Team Photo/Individual/Facility Tam/Thida Emmav.jpg",
      translations: {
        en: {
          name: "Thida Emmav",
          role: "Facility Team",
        },
        km: {
          name: "ធីដា អេមម៉ាវ",
          role: "ក្រុមការងារកន្លែងធ្វើការ",
        },
      },
      categoryId: facilityTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "kim-lin",
      image: "/images/Team Photo/Individual/Facility Tam/Kim Lin.jpg",
      translations: {
        en: {
          name: "Kim Lin",
          role: "Facility Team",
        },
        km: {
          name: "គឹម លីន",
          role: "ក្រុមការងារកន្លែងធ្វើការ",
        },
      },
      categoryId: facilityTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "lun-bopha",
      image: "/images/Team Photo/Individual/Facility Tam/Lun Bopha.jpg",
      translations: {
        en: {
          name: "Lun Bopha",
          role: "Facility Team",
        },
        km: {
          name: "លុន បុប្ផា",
          role: "ក្រុមការងារកន្លែងធ្វើការ",
        },
      },
      categoryId: facilityTeamCategory.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      slug: "sim-yem",
      image: "/images/Team Photo/Individual/Facility Tam/Sim Yem.jpg",
      translations: {
        en: {
          name: "Sim Yem",
          role: "Facility Maintenance Technician",
        },
        km: {
          name: "ស៊ីម យ៉ែម",
          role: "បច្ចេកទេសថែទាំកន្លែងធ្វើការ",
        },
      },
      categoryId: facilityTeamCategory.id,
    },
  });

  console.log("✅ Team members created successfully!");
  console.log("🎉 Database seeding completed!");

  // Display summary
  const categoryCount = await prisma.category.count();
  const productCount = await prisma.product.count();
  const locationCategoryCount = await prisma.locationCategory.count();
  const locationCount = await prisma.location.count();
  const teamCategoryCount = await prisma.teamCategory.count();
  const teamMemberCount = await prisma.teamMember.count();

  console.log(`📊 Summary:`);
  console.log(`   Categories: ${categoryCount}`);
  console.log(`   Products: ${productCount}`);
  console.log(`   Location Categories: ${locationCategoryCount}`);
  console.log(`   Locations: ${locationCount}`);
  console.log(`   Team Categories: ${teamCategoryCount}`);
  console.log(`   Team Members: ${teamMemberCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

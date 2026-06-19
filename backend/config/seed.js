// require("dotenv").config();
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const User = require("../models/User");
// const Service = require("../models/Service");
// const Plan = require("../models/Plan");
// const Review = require("../models/Review");

// const seed = async () => {
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log("Connected to MongoDB. Seeding...");

//   // Clear existing data
//   await Promise.all([
//     User.deleteMany({}),
//     Service.deleteMany({}),
//     Plan.deleteMany({}),
//     Review.deleteMany({}),
//   ]);

//   // ─── Admin User ────────────────────────────────────────────────────────────
//   const admin = await User.create({
//     name: "SplashX Admin",
//     email: "admin@splashx.in",
//     phone: "9876543210",
//     password: "admin@123",
//     role: "admin",
//     isEmailVerified: true,
//   });
//   console.log("✅ Admin created:", admin.email);

//   // ─── Demo Customer ─────────────────────────────────────────────────────────
//   await User.create({
//     name: "Ravi Kumar",
//     email: "ravi@example.com",
//     phone: "9876501234",
//     password: "password123",
//     role: "customer",
//     isEmailVerified: true,
//     loyaltyPoints: 450,
//     totalBookings: 9,
//   });

//   // ─── Services ──────────────────────────────────────────────────────────────
//   const services = await Service.insertMany([
//     {
//       name: "Exterior Wash",
//       description: "High-pressure foam wash with wax coat and tyre cleaning",
//       shortDesc: "Quick exterior foam wash with wax",
//       icon: "🚿",
//       category: "exterior",
//       duration: { min: 20, max: 30 },
//       basePrice: {
//         hatchback: 199,
//         sedan: 249,
//         suv: 299,
//         muv: 349,
//         luxury: 499,
//       },
//       features: [
//         "High-pressure foam wash",
//         "Tyre & rim cleaning",
//         "Window wipe",
//         "Wax coat",
//         "Air freshener",
//       ],
//       isFeatured: true,
//       sortOrder: 1,
//     },
//     {
//       name: "Interior Detail",
//       description: "Deep vacuum, dashboard wipe-down, and glass cleaning",
//       shortDesc: "Complete interior vacuum & clean",
//       icon: "🧴",
//       category: "interior",
//       duration: { min: 45, max: 60 },
//       basePrice: {
//         hatchback: 399,
//         sedan: 499,
//         suv: 599,
//         muv: 649,
//         luxury: 999,
//       },
//       features: [
//         "Full vacuum",
//         "Dashboard wipe",
//         "Glass & mirror clean",
//         "Door panel clean",
//         "Seat wipe",
//         "Floor mat wash",
//       ],
//       sortOrder: 2,
//     },
//     {
//       name: "Full Detail Package",
//       description:
//         "Complete interior and exterior detailing for a showroom finish",
//       shortDesc: "Interior + exterior combo package",
//       icon: "✨",
//       category: "full",
//       duration: { min: 90, max: 120 },
//       basePrice: {
//         hatchback: 699,
//         sedan: 849,
//         suv: 999,
//         muv: 1099,
//         luxury: 1799,
//       },
//       features: [
//         "Full exterior wash",
//         "Wax coat",
//         "Interior vacuum",
//         "Seat shampoo",
//         "Dashboard polish",
//         "Glass treatment",
//       ],
//       isFeatured: true,
//       sortOrder: 3,
//     },
//     {
//       name: "Steam Clean",
//       description:
//         "High-temperature steam cleaning for engine bay and upholstery",
//       shortDesc: "Deep steam for engine & interior",
//       icon: "🌊",
//       category: "specialty",
//       duration: { min: 60, max: 90 },
//       basePrice: {
//         hatchback: 799,
//         sedan: 899,
//         suv: 1099,
//         muv: 1199,
//         luxury: 1999,
//       },
//       features: [
//         "Engine bay steam",
//         "Seat & upholstery steam",
//         "Bacteria & odour removal",
//         "Floor mat steam",
//         "Vent cleaning",
//       ],
//       sortOrder: 4,
//     },
//     {
//       name: "Ceramic Coating",
//       description:
//         "Professional-grade ceramic coating for long-term paint protection up to 2 years",
//       shortDesc: "2-year paint protection coating",
//       icon: "🛡️",
//       category: "protection",
//       duration: { min: 180, max: 240 },
//       basePrice: {
//         hatchback: 4999,
//         sedan: 5999,
//         suv: 7499,
//         muv: 7999,
//         luxury: 12999,
//       },
//       features: [
//         "Paint decontamination",
//         "Clay bar treatment",
//         "Single-stage polish",
//         "9H ceramic coat",
//         "2-year warranty",
//         "Hydrophobic finish",
//       ],
//       isFeatured: true,
//       sortOrder: 5,
//     },
//     {
//       name: "Polish & Buff",
//       description:
//         "Swirl mark removal and paint restoration for a mirror-like finish",
//       shortDesc: "Swirl removal & paint restoration",
//       icon: "🔆",
//       category: "protection",
//       duration: { min: 120, max: 180 },
//       basePrice: {
//         hatchback: 1999,
//         sedan: 2499,
//         suv: 2999,
//         muv: 3299,
//         luxury: 5999,
//       },
//       features: [
//         "Machine polish",
//         "Swirl mark removal",
//         "Scratch correction",
//         "Paint enhancement",
//         "Carnauba wax finish",
//       ],
//       sortOrder: 6,
//     },
//   ]);
//   console.log(`✅ ${services.length} services created`);

//   // ─── Plans ─────────────────────────────────────────────────────────────────
//   const plans = await Plan.insertMany([
//     {
//       name: "basic",
//       displayName: "Basic",
//       tagline: "Essential cleaning for everyday use",
//       icon: "🚿",
//       price: { perVisit: 299, monthly: 1999 },
//       monthlyWashes: 8,
//       features: [
//         { label: "Exterior foam wash", included: true },
//         { label: "Tyre & rim cleaning", included: true },
//         { label: "Window wipe", included: true },
//         { label: "Air freshener", included: true },
//         { label: "Interior vacuum", included: false },
//         { label: "Wax coat", included: false },
//         { label: "Seat shampoo", included: false },
//         { label: "Ceramic protection", included: false },
//       ],
//       discount: 0,
//       sortOrder: 1,
//       color: "#1a6bff",
//     },
//     {
//       name: "premium",
//       displayName: "Premium",
//       tagline: "Full interior & exterior for a showroom feel",
//       icon: "✨",
//       price: { perVisit: 799, monthly: 3999 },
//       monthlyWashes: 6,
//       features: [
//         { label: "Full exterior wash", included: true },
//         { label: "Wax coat", included: true },
//         { label: "Interior vacuum", included: true },
//         { label: "Dashboard wipe", included: true },
//         { label: "Seat shampoo", included: true },
//         { label: "Glass treatment", included: true },
//         { label: "Engine bay clean", included: false },
//         { label: "Ceramic protection", included: false },
//       ],
//       discount: 0,
//       sortOrder: 2,
//       isFeatured: true,
//       color: "#ff4e1a",
//     },
//     {
//       name: "elite",
//       displayName: "Elite",
//       tagline: "The complete detailing experience",
//       icon: "🛡️",
//       price: { perVisit: 1999, monthly: 7999 },
//       features: [
//         { label: "Complete detail package", included: true },
//         { label: "Steam clean", included: true },
//         { label: "Polish & buff", included: true },
//         { label: "Engine bay clean", included: true },
//         { label: "Ceramic coat layer", included: true },
//         { label: "Odour treatment", included: true },
//         { label: "Priority scheduling", included: true },
//         { label: "Free pickup & drop", included: true },
//       ],
//       discount: 0,
//       sortOrder: 3,
//       color: "#e6a817",
//     },
//   ]);
//   console.log(`✅ ${plans.length} plans created`);

//   // ─── Sample Reviews ────────────────────────────────────────────────────────
//   const [customer] = await User.find({ role: "customer" });
//   await Review.insertMany([
//     {
//       customer: customer._id,
//       customerName: "Ravi K.",
//       vehicleModel: "2022 Honda City",
//       rating: 5,
//       comment:
//         "Best detailing I have ever had. The ceramic coating looks incredible after 3 months!",
//       tags: ["ceramic coating", "great results"],
//       isApproved: true,
//       isHighlighted: true,
//     },
//     {
//       customer: customer._id,
//       customerName: "Priya M.",
//       vehicleModel: "Hyundai Creta",
//       rating: 5,
//       comment:
//         "Super quick, staff is professional. The interior steam clean removed stains I thought were permanent.",
//       tags: ["quick service", "professional staff"],
//       isApproved: true,
//     },
//     {
//       customer: customer._id,
//       customerName: "Arun S.",
//       vehicleModel: "Tata Nexon EV",
//       rating: 4,
//       comment:
//         "Great value for the premium plan. Always book online now - so convenient.",
//       tags: ["good value", "easy booking"],
//       isApproved: true,
//     },
//     {
//       customer: customer._id,
//       customerName: "Deepa R.",
//       vehicleModel: "Maruti Baleno",
//       rating: 5,
//       comment:
//         "Polishing job was flawless. My 5-year-old car looks brand new. Highly recommended.",
//       tags: ["polishing", "like new"],
//       isApproved: true,
//     },
//   ]);
//   console.log("✅ Sample reviews created");

//   console.log("\n🎉 Database seeded successfully!");
//   console.log("Admin login → email: admin@splashx.in | password: admin@123");
//   console.log(
//     "Customer login → email: ravi@example.com | password: password123"
//   );
//   process.exit(0);
// };

// seed().catch((err) => {
//   console.error("Seed error:", err);
//   process.exit(1);
// });
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Service = require("../models/Service");
const Plan = require("../models/Plan");
const Review = require("../models/Review");

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is undefined. Check backend/.env and dotenv loading.");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB. Seeding...");

    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      Plan.deleteMany({}),
      Review.deleteMany({}),
    ]);

    const admin = await User.create({
      name: "SplashX Admin",
      email: "admin@splashx.in",
      phone: "9876543210",
      password: "admin@123",
      role: "admin",
      isEmailVerified: true,
    });
    console.log("✅ Admin created:", admin.email);

    await User.create({
      name: "Ravi Kumar",
      email: "ravi@example.com",
      phone: "9876501234",
      password: "password123",
      role: "customer",
      isEmailVerified: true,
      loyaltyPoints: 450,
      totalBookings: 9,
    });

    const services = await Service.insertMany([
      { name: "Exterior Wash", description: "High-pressure foam wash with wax coat and tyre cleaning", shortDesc: "Quick exterior foam wash with wax", icon: "🚿", category: "exterior", duration: { min: 20, max: 30 }, basePrice: { hatchback: 199, sedan: 249, suv: 299, muv: 349, luxury: 499 }, features: ["High-pressure foam wash", "Tyre & rim cleaning", "Window wipe", "Wax coat", "Air freshener"], isFeatured: true, sortOrder: 1 },
      { name: "Interior Detail", description: "Deep vacuum, dashboard wipe-down, and glass cleaning", shortDesc: "Complete interior vacuum & clean", icon: "🧴", category: "interior", duration: { min: 45, max: 60 }, basePrice: { hatchback: 399, sedan: 499, suv: 599, muv: 649, luxury: 999 }, features: ["Full vacuum", "Dashboard wipe", "Glass & mirror clean", "Door panel clean", "Seat wipe", "Floor mat wash"], sortOrder: 2 },
      { name: "Full Detail Package", description: "Complete interior and exterior detailing for a showroom finish", shortDesc: "Interior + exterior combo package", icon: "✨", category: "full", duration: { min: 90, max: 120 }, basePrice: { hatchback: 699, sedan: 849, suv: 999, muv: 1099, luxury: 1799 }, features: ["Full exterior wash", "Wax coat", "Interior vacuum", "Seat shampoo", "Dashboard polish", "Glass treatment"], isFeatured: true, sortOrder: 3 },
      { name: "Steam Clean", description: "High-temperature steam cleaning for engine bay and upholstery", shortDesc: "Deep steam for engine & interior", icon: "🌊", category: "specialty", duration: { min: 60, max: 90 }, basePrice: { hatchback: 799, sedan: 899, suv: 1099, muv: 1199, luxury: 1999 }, features: ["Engine bay steam", "Seat & upholstery steam", "Bacteria & odour removal", "Floor mat steam", "Vent cleaning"], sortOrder: 4 },
      { name: "Ceramic Coating", description: "Professional-grade ceramic coating for long-term paint protection up to 2 years", shortDesc: "2-year paint protection coating", icon: "🛡️", category: "protection", duration: { min: 180, max: 240 }, basePrice: { hatchback: 4999, sedan: 5999, suv: 7499, muv: 7999, luxury: 12999 }, features: ["Paint decontamination", "Clay bar treatment", "Single-stage polish", "9H ceramic coat", "2-year warranty", "Hydrophobic finish"], isFeatured: true, sortOrder: 5 },
      { name: "Polish & Buff", description: "Swirl mark removal and paint restoration for a mirror-like finish", shortDesc: "Swirl removal & paint restoration", icon: "🔆", category: "protection", duration: { min: 120, max: 180 }, basePrice: { hatchback: 1999, sedan: 2499, suv: 2999, muv: 3299, luxury: 5999 }, features: ["Machine polish", "Swirl mark removal", "Scratch correction", "Paint enhancement", "Carnauba wax finish"], sortOrder: 6 },
    ]);
    console.log(`✅ ${services.length} services created`);

    const plans = await Plan.insertMany([
      { name: "basic", displayName: "Basic", tagline: "Essential cleaning for everyday use", icon: "🚿", price: { perVisit: 299, monthly: 1999 }, monthlyWashes: 8, features: [{ label: "Exterior foam wash", included: true }, { label: "Tyre & rim cleaning", included: true }, { label: "Window wipe", included: true }, { label: "Air freshener", included: true }, { label: "Interior vacuum", included: false }, { label: "Wax coat", included: false }, { label: "Seat shampoo", included: false }, { label: "Ceramic protection", included: false }], discount: 0, sortOrder: 1, color: "#1a6bff" },
      { name: "premium", displayName: "Premium", tagline: "Full interior & exterior for a showroom feel", icon: "✨", price: { perVisit: 799, monthly: 3999 }, monthlyWashes: 6, features: [{ label: "Full exterior wash", included: true }, { label: "Wax coat", included: true }, { label: "Interior vacuum", included: true }, { label: "Dashboard wipe", included: true }, { label: "Seat shampoo", included: true }, { label: "Glass treatment", included: true }, { label: "Engine bay clean", included: false }, { label: "Ceramic protection", included: false }], discount: 0, sortOrder: 2, isFeatured: true, color: "#ff4e1a" },
      { name: "elite", displayName: "Elite", tagline: "The complete detailing experience", icon: "🛡️", price: { perVisit: 1999, monthly: 7999 }, features: [{ label: "Complete detail package", included: true }, { label: "Steam clean", included: true }, { label: "Polish & buff", included: true }, { label: "Engine bay clean", included: true }, { label: "Ceramic coat layer", included: true }, { label: "Odour treatment", included: true }, { label: "Priority scheduling", included: true }, { label: "Free pickup & drop", included: true }], discount: 0, sortOrder: 3, color: "#e6a817" },
    ]);
    console.log(`✅ ${plans.length} plans created`);

    const customer = await User.findOne({ role: "customer" });
    await Review.insertMany([
      { customer: customer._id, customerName: "Ravi K.", vehicleModel: "2022 Honda City", rating: 5, comment: "Best detailing I have ever had. The ceramic coating looks incredible after 3 months!", tags: ["ceramic coating", "great results"], isApproved: true, isHighlighted: true },
      { customer: customer._id, customerName: "Priya M.", vehicleModel: "Hyundai Creta", rating: 5, comment: "Super quick, staff is professional. The interior steam clean removed stains I thought were permanent.", tags: ["quick service", "professional staff"], isApproved: true },
      { customer: customer._id, customerName: "Arun S.", vehicleModel: "Tata Nexon EV", rating: 4, comment: "Great value for the premium plan. Always book online now - so convenient.", tags: ["good value", "easy booking"], isApproved: true },
      { customer: customer._id, customerName: "Deepa R.", vehicleModel: "Maruti Baleno", rating: 5, comment: "Polishing job was flawless. My 5-year-old car looks brand new. Highly recommended.", tags: ["polishing", "like new"], isApproved: true },
    ]);
    console.log("✅ Sample reviews created");

    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
};

seed();

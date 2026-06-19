const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
});

const Service = require('./models/Service');

const services = [
  {
    name: 'Basic Wash',
    slug: 'basic-wash',
    description: 'Exterior wash and cleaning',
    shortDesc: 'Quick exterior wash',
    icon: '🚗',
    category: 'exterior',
    duration: {
      min: 20,
      max: 30
    },
    basePrice: {
      hatchback: 299,
      sedan: 349,
      suv: 399,
      muv: 449,
      luxury: 599
    },
    features: [
      'Exterior Foam Wash',
      'Tyre Cleaning',
      'Dry Wipe'
    ],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Premium Wash',
    slug: 'premium-wash',
    description: 'Interior and exterior cleaning package',
    shortDesc: 'Complete cleaning',
    icon: '✨',
    category: 'full',
    duration: {
      min: 45,
      max: 60
    },
    basePrice: {
      hatchback: 699,
      sedan: 799,
      suv: 899,
      muv: 999,
      luxury: 1499
    },
    features: [
      'Exterior Wash',
      'Interior Vacuum',
      'Dashboard Cleaning',
      'Tyre Polish'
    ],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Ceramic Protection',
    slug: 'ceramic-protection',
    description: 'Premium ceramic coating protection',
    shortDesc: 'Paint protection',
    icon: '🛡️',
    category: 'protection',
    duration: {
      min: 120,
      max: 180
    },
    basePrice: {
      hatchback: 4999,
      sedan: 5999,
      suv: 6999,
      muv: 7999,
      luxury: 9999
    },
    features: [
      'Ceramic Coating',
      'Paint Protection',
      'Gloss Finish'
    ],
    isActive: true,
    isFeatured: false
  }
];
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await Service.deleteMany({});
    console.log(`Deleted ${result.deletedCount} existing services`);

    await Service.insertMany(services);

    console.log('✅ Services seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seed();
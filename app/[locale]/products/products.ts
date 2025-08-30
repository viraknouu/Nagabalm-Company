export interface Product {
    id: string
    name: {
      en: string
      km: string
    }
    description: {
      en: string
      km: string
    }
    ingredients: string[]
    keyIngredient: {
      name: string
      benefits: string
    }
    recommendedFor: string
    image: string
    category: 'balms' | 'oils' | 'sprays' | 'inhalers'
    useCase: {
      type: ('active' | 'everyday')[]
      benefits: string[]
    }
}

export const products: Product[] = [
    {
      id: 'naga-balm-original',
      name: {
        en: 'Naga Balm Original',
        km: 'ណាហ្គាបាមអូរីជីណល'
      },
      description: {
        en: 'The PAIN RELIEF POWERHOUSE. Well-rounded pain relief, your go-to balm for the daily aches and pains of life. Pain relief from headaches, muscle pain, joint pain, bug-bites.',
        km: 'ថាមពលបំបាត់ការឈឺចាប់។ ការបំបាត់ការឈឺចាប់គ្រប់បែបយ៉ាង សម្រាប់ការឈឺចាប់ប្រចាំថ្ងៃ។'
      },
      ingredients: [
        'Coconut Oil',
        'White Beeswax',
        'Camphor',
        'Peppermint Oil',
        'Eucalyptus Oil',
        'Cajuput Oil',
        'Cypress Oil',
        'Clove Oil'
      ],
      keyIngredient: {
        name: 'Peppermint',
        benefits: 'Relief from tension headaches, bug bites. A topical muscle relaxant for muscle tension and spasms. Improves blood circulation for better healing.'
      },
      recommendedFor: '✔️ General Muscle & Joint Relief – Helps ease minor aches, muscle fatigue, and joint discomfort.\n✔️ Daily Use – Ideal for long work hours, travel fatigue, and physical strain.\n✔️ Balanced Sensation – Provides a gentle warming effect without being too intense.',
      image: '/images/NB-Ointment-Original1.jpg',
      category: 'balms',
      useCase: {
        type: ['everyday'],
        benefits: [
          'Long-lasting relief',
          'All-purpose pain relief',
          'Joint and muscle comfort',
          'Versatile application'
        ]
      }
    },
    {
      id: 'naga-balm-ice',
      name: {
        en: 'Naga Balm Ice',
        km: 'ណាហ្គាបាមអាយស៍'
      },
      description: {
        en: 'NATURALLY COOL. Provides soothing relief through the cooling power of arnica, menthol and eucalyptus. Temporary relief from joint pain, sore muscles, chest and nasal congestion. Good to apply on sensitive areas such as the chest and stomach.',
        km: 'ធម្មជាតិត្រជាក់។ ត្រជាក់និងសុខស្រួលតាមរយៈថាមពលត្រជាក់នៃមិនថុលនិងអានីកា។'
      },
      ingredients: [
        'Coconut Oil',
        'White Beeswax',
        'Menthol',
        'Arnica Oil',
        'Eucalyptus Oil',
        'Camphor',
        'Clove Oil'
      ],
      keyIngredient: {
        name: 'Arnica',
        benefits: 'A powerful anti-inflammatory plant with analgesic properties - improves circulation, reduces stiffness, swelling, and bruising.'
      },
      recommendedFor: '✔️ Cooling Sensation – A refreshing alternative for those who prefer cold over heat, especially for sensitive areas or skin.\n✔️ Post-Workout & Recovery – Soothes sore muscles and overworked joints.\n✔️ Swelling & Inflammation – Helps reduce discomfort and bruising from minor strains and injuries.',
      image: '/images/NB-Ointment-Ice.jpg',
      category: 'balms',
      useCase: {
        type: ['everyday'],
        benefits: [
          'Pre-workout preparation',
          'Post-exercise recovery',
          'Athletic performance support',
          'Cooling relief'
        ]
      }
    },
    {
      id: 'naga-balm-fire',
      name: {
        en: 'Naga Balm Fire',
        km: 'ណាហ្គាបាមហ្វាយ'
      },
      description: {
        en: 'NATURALLY FIERY. Delivers deeper heat for deeper relief of muscle aches and fatigues, pulled muscles, stiff and chronic joint or nerve pain. Smooth but long-lasting!',
        km: 'ធម្មជាតិក្តៅ។ កំដៅសុខស្រួលនិងបង្កើនការរត់ឈាមសម្រាប់ការស្តារឡើងវិញលឿន។'
      },
      ingredients: [
        'Chili Infused Coconut Oil',
        'White Beeswax',
        'Camphor',
        'Peppermint Oil',
        'Eucalyptus Oil',
        'Cajuput Oil',
        'Clove Oil',
        'Capsicum Annuum Fruit Extract'
      ],
      keyIngredient: {
        name: 'Capsicum',
        benefits: 'Reduces perception of pain, increases blood flow and promotes healing through the increased circulation.'
      },
      recommendedFor: '✔️ Strong, Lasting Heat – Designed for those who prefer a more intense warming sensation.\n✔️ Athletes & Active Individuals – Supports muscle warm-up and post-workout recovery.\n✔️ Deep, Targeted Relief – Ideal for stubborn muscle, back, and joint pain.\n✔️ Everyday Tension & Stiffness – Helps loosen tight muscles and promote relaxation from those everyday activities.',
      image: '/images/NB-Ointment-Fire.jpg',
      category: 'balms',
      useCase: {
        type: ['active'],
        benefits: [
          'Deep muscle relief',
          'Enhanced circulation',
          'Long-lasting heat therapy',
          'Powerful pain relief'
        ]
      }
    },
    {
      id: 'naga-balm-go',
      name: {
        en: 'Naga Balm Go',
        km: 'ណាហ្គាបាមហ្គូ'
      },
      description: {
        en: 'NATURALLY ENERGIZING. Delivers relief with fast cooling and warming sensations. Like aspirin for your skin, it numbs the pain before delivering penetrating heat to the affected area. With Oil of Wintergreen, there is also a familiar herbal mintiness to help with nausea, dizziness, and hangover.',
        km: 'ថាមពលធម្មជាតិ។ ដំណើរការលឿនបំផុតជាមួយអារម្មណ៍ត្រជាក់និងក្តៅ។'
      },
      ingredients: [
        'Coconut Oil',
        'White Beeswax',
        'Oil of Wintergreen',
        'Menthol',
        'Camphor',
        'Eucalyptus Oil',
        'Cypress Oil',
        'Clove Oil'
      ],
      keyIngredient: {
        name: 'Wintergreen',
        benefits: 'A natural analgesic and anti-inflammatory, Wintergreen provides a cooling, numbing effect for instant pain relief, while improving circulation to aid recovery.'
      },
      recommendedFor: 'A versatile balm that is good for both athletes to target',
      image: '/images/NB-Ointment-Go.jpg',
      category: 'balms',
      useCase: {
        type: ['active', 'everyday'],
        benefits: [
          'Pre-workout preparation',
          'Post-exercise recovery',
          'Athletic performance support',
          'Quick-acting formula'
        ]
      }
    },
    {
      id: 'naga-balm-energizing-liniment',
      name: {
        en: 'Naga Balm Energizing Liniment Oil',
        km: 'ប្រេងណាហ្គាបាមថាមពល'
      },
      description: {
        en: 'LATHER, MASSAGE, GO. The coconut oil liniment version of the Naga Balm Go. Great for muscle and joint activation and warming up. Massage the heat in.',
        km: 'លាប ម៉ាស្សា ទៅ។ កំណែប្រេងដូងនៃណាហ្គាបាមហ្គូ។'
      },
      ingredients: [
        'Coconut Oil',
        'Oil of Wintergreen',
        'Menthol',
        'Camphor',
        'Eucalyptus Oil',
        'Cypress Oil',
        'Clove Oil'
      ],
      keyIngredient: {
        name: 'Wintergreen Oil',
        benefits: 'A natural analgesic and anti-inflammatory, Wintergreen provides a cooling, numbing effect for instant pain relief, while improving circulation to aid recovery.'
      },
      recommendedFor: '✔️ Athletes & Fitness Enthusiasts – Ideal for pre- and post-workout recovery\n✔️ Individuals with Chronic Pain – Provides relief for arthritis, back pain, and stiff joints\n✔️ Wide Surface Application – Perfect for larger muscle groups like the back, legs, and shoulders, ensuring broad coverage and deep relief',
      image: '/images/NB-EnergizingLinimentOil1.jpg',
      category: 'oils',
      useCase: {
        type: ['active', 'everyday'],
        benefits: [
          'Pre-workout preparation',
          'Post-exercise recovery',
          'Athletic performance support',
          'Deep penetration'
        ]
      }
    },
    {
      id: 'extreme-liniment-oil',
      name: {
        en: 'Extreme Liniment Oil',
        km: 'ប្រេងលីនីមិនខ្លាំង'
      },
      description: {
        en: 'EXTREME RECOVERY. The ultimate heat provider - the Extreme Liniment Oil lives up to its name, delivering maximum, penetrating warmth for the more persistent chronic muscle and joint pain. A perfect companion for any recovery and injury rehabilitation process.',
        km: 'ការស្តារឡើងវិញខ្លាំង។ អ្នកផ្តល់កំដៅដ៏ល្អបំផុត។'
      },
      ingredients: [
        'Chili Infused Coconut Oil',
        'Camphor',
        'Oil of Wintergreen',
        'Peppermint Oil',
        'Eucalyptus Oil',
        'Cajuput Oil',
        'Cypress Oil',
        'Clove Oil'
      ],
      keyIngredient: {
        name: 'Capsicum',
        benefits: 'Reduces perception of pain, increases blood flow, anti-inflammatory, and promotes healing through increased blood circulation.'
      },
      recommendedFor: '✔️ Athletes Pushing Their Limits – Ideal for post-training recovery and deep muscle relaxation.\n✔️ Chronic Pain Warriors – Delivers long-lasting relief for stubborn back, joint, and arthritis pain.\n✔️ Everyday Hustlers or Elders – Perfect for those dealing with stiffness from long hours at work, travel, physical labor, or sitting.\n✔️ Heat Seekers – For those who crave intense, deep-penetrating warmth for increased blood circulation.',
      image: '/images/NB-ExtremeLinimentOil1.jpg',
      category: 'oils',
      useCase: {
        type: ['active', 'everyday'],
        benefits: [
          'Intense pain relief',
          'Deep muscle penetration',
          'Long-lasting effect',
          'Professional strength'
        ]
      }
    },
    {
      id: 'pain-relief-spray',
      name: {
        en: 'Energizing Pain Relief Spray',
        km: 'ស្ព្រេយ៍បំបាត់ការឈឺចាប់'
      },
      description: {
        en: 'SPRAY. RUB. GO. Fast-acting relief to keep you moving. This spray is formulated to deliver an instant cooling sensation while promoting circulation for faster recovery. The ethanol-based formula absorbs quickly, providing immediate relief without greasy residue.',
        km: 'បាញ់ លាប ទៅ។ ការបំបាត់ការឈឺចាប់ភ្លាមៗដើម្បីឱ្យអ្នកចល័តបាន។'
      },
      ingredients: [
        'Ethanol',
        'Purified Water',
        'Oil of Wintergreen',
        'Camphor',
        'Eucalyptus Oil',
        'Cypress Oil',
        'Clove Oil'
      ],
      keyIngredient: {
        name: 'Wintergreen Oil',
        benefits: 'A natural analgesic and anti-inflammatory, Wintergreen provides a cooling, numbing effect for instant pain relief, while improving circulation to aid recovery.'
      },
      recommendedFor: '✔️ Versatile and immediate – Help with warming up before exercising or fast pain relief.\n✔️ Hard-to-Reach Areas – Ideal for back, shoulders, and other difficult spots.\n✔️ Mess-Free Quick Absorption - The ethanol-based formula absorbs quickly, providing immediate relief without oil residue.',
      image: '/images/NB-EngergizingSpray1.jpg',
      category: 'sprays',
      useCase: {
        type: ['active'],
        benefits: [
          'Quick absorption',
          'Targeted application',
          'No residue',
          'Fast-acting relief'
        ]
      }
    },
    {
      id: 'inhaler-roll-on',
      name: {
        en: 'Inhaler & Roll-On',
        km: 'ឧបករណ៍ស្រូបនិងរ៉ូលអន'
      },
      description: {
        en: 'TWO-IN-ONE RELIEF. A two-in-one touch-free pain relief solution to take on the go. Inhaler: Relief from nausea, congestion, headaches & stress. Roll-On: Our Energizing Liniment Oil in a mini format - for those small touchpoints like nerve ends and temples.',
        km: 'ការបំបាត់ការឈឺចាប់ពីរក្នុងមួយ។ ដំណោះស្រាយបំបាត់ការឈឺចាប់ដោយមិនប៉ះពាល់ពីរក្នុងមួយដើម្បីយកទៅជាមួយ។'
      },
      ingredients: [
        'Inhaler: Menthol, Eucalyptus Oil, Peppermint Oil, Camphor, Grapefruit Peel Oil, Orange Oil, Coconut Oil',
        'Roll-On: Menthol, Wintergreen Oil, Camphor, Eucalyptus Oil, Cypress Oil, Clove Oil, Coconut Oil'
      ],
      keyIngredient: {
        name: 'Eucalyptus',
        benefits: 'Clear nasal congestion, reduces inflammation, and provides a refreshing, energizing aroma for easier breathing.'
      },
      recommendedFor: 'The Naga Balm Inhaler is perfect for easing nausea, headaches, boosting focus, clearing congestion, and refreshing the senses—anytime, anywhere.',
      image: '/images/NB-Inhaler-RollOn1.jpg',
      category: 'inhalers',
      useCase: {
        type: ['everyday'],
        benefits: [
          'Dual-action relief',
          'Portable solution',
          'Quick application',
          'Touch-free relief'
        ]
      }
    },
    {
      id: 'mosquito-repellent',
      name: {
        en: 'Naga Balm Picaridin Mosquito Repellent',
        km: 'ថ្នាំកម្ចាត់មូសណាហ្គាបាម'
      },
      description: {
        en: 'EMBRACE LIFE, REPEL MOSQUITOES. Cambodia\'s first Picaridin Mosquito Repellent - an effective, DEET-free solution for the family. Because like it or not, mosquitoes are a pain. Made with 20% Picaridin, it is child safe (6 months up), skin safe and may last up to 12 hours.',
        km: 'រីករាយជាមួយជីវិត បណ្តេញមូស។ ថ្នាំកម្ចាត់មូសដែលមានប្រសិទ្ធភាពនិងសុវត្ថិភាពបំផុតនៅកម្ពុជា។'
      },
      ingredients: [
        'Picaridin',
        'Purified Water',
        'Ethanol'
      ],
      keyIngredient: {
        name: 'Picaridin',
        benefits: 'Picaridin is a long-lasting, non-greasy insect repellent that effectively protects against mosquitoes, ticks, flies, and other biting insects—without the strong odor or skin irritation of DEET.'
      },
      recommendedFor: 'Safe for children (6 months up) and adults.',
      image: '/images/NB-MosquitoRepellent1.jpg',
      category: 'sprays',
      useCase: {
        type: ['everyday'],
        benefits: [
          'Long-lasting protection',
          'Family-friendly',
          'DEET-free formula',
          'Skin-safe application'
        ]
      }
    },
    {
      id: 'medicated-oil',
      name: {
        en: 'Naga Balm Medicated Oil',
        km: 'ប្រេងឱសថណាហ្គាបាម'
      },
      description: {
        en: 'The Naga Balm Medicated Oil is formulated to effectively relieve nausea, headaches, dizziness, congestion, stomachaches, and small aches and pains. Inhale, rub on your forehead or on sensitive areas.',
        km: 'ប្រេងឱសថណាហ្គាបាមត្រូវបានរចនាឡើងដើម្បីបំបាត់ការចង់ក្អួត ឈឺក្បាល វិលមុខ ស្ទះច្រមុះ ឈឺពោះ និងការឈឺចាប់តិចតួច។'
      },
      ingredients: [
        'Methyl Salicylate',
        'Menthol',
        'Peppermint Oil',
        'Eucalyptus Oil',
        'Ginger Oil',
        'Clove Oil',
        'Spiked Lavender',
        'Coconut Oil'
      ],
      keyIngredient: {
        name: 'Ginger Oil',
        benefits: 'Spicy and grounding, the ginger oil helps to ease nausea, promote relaxation, and stimulate blood flow.'
      },
      recommendedFor: '✔️ Stress & Tension – Soothes headaches, eases stress, and promotes relaxation.\n✔️ Congestion & Nausea – Clears sinuses, relieves dizziness, and reduces motion sickness.\n✔️ Mental Clarity & Refreshment – Enhances focus and provides a quick energy boost.',
      image: '/images/NB-EnergizingLinimentOil3.jpg',
      category: 'oils',
      useCase: {
        type: ['everyday'],
        benefits: [
          'Nausea relief',
          'Stress reduction',
          'Mental clarity',
          'Aromatherapy benefits'
        ]
      }
    },
    {
      id: 'liniment-roll-on',
      name: {
        en: 'Naga Balm Liniment Roll-On',
        km: 'ណាហ្គាបាមលីនីមិនរ៉ូលអន'
      },
      description: {
        en: 'ROLL N\' GO. The energizing liniment oil in roll-on format. Designed for easy, targeted application.',
        km: 'រ៉ូលហើយទៅ។ ប្រេងលីនីមិនថាមពលក្នុងទម្រង់រ៉ូលអន។'
      },
      ingredients: [
        'Coconut Oil',
        'Oil of Wintergreen',
        'Menthol',
        'Camphor',
        'Eucalyptus Oil',
        'Cypress Oil',
        'Clove Oil'
      ],
      keyIngredient: {
        name: 'Wintergreen Oil',
        benefits: 'A natural analgesic and anti-inflammatory, Wintergreen provides a cooling, numbing effect for instant pain relief, while improving circulation to aid recovery.'
      },
      recommendedFor: '✔️ On-the-Go Pain Relief – No mess, no hassle, perfect for daily use anytime, anywhere.\n✔️ Office Workers & Travelers – Quick targeted relief for neck, shoulders, and lower back tension.\n✔️Athletes & Active Individuals – Ideal for those who rely on their hands to grip, keep your palms oil-free.',
      image: '/images/NB-RollOn.jpg',
      category: 'oils',
      useCase: {
        type: ['active', 'everyday'],
        benefits: [
          'Targeted application',
          'Mess-free relief',
          'Portable solution',
          'Quick absorption'
        ]
      }
    }
  ]

export function getProductsByUseCase(useCase: 'active' | 'everyday') {
  return products.filter(product => product.useCase.type.includes(useCase));
}

export async function getProducts() {
  return products;
}

export async function getProduct(id: string) {
  const product = products.find(p => p.id === id);
  if (!product) return null;
  return product;
}
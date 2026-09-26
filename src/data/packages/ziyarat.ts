import { Package } from './types';

export const ZIYARAT_PACKAGES: Package[] = [
  {
    id: 'mdn-01',
    slug: 'madinah-ziyarat-full-day',
    category: 'ziyarat',
    city: 'Madinah',
    title: 'Madinah Ziyarat 01 - Full Day Spiritual Journey',
    duration: '1 Day',
    description: 'Unfolding the Sanctuary: Your Step-by-Step Itinerary to Sacred Madinah. Move beyond being a tourist and connect deeply with the sanctuary that welcomed the Prophet (PBUH) when the world turned him away.',
    
    // ✅ Main Card Image & Price
    image: '/assets/images/ziyarat/madinah-cover.jpg', 
    priceStarting: 'AED 400', 
    
    highlights: [
      'Comprehensive tour of 15 sacred locations',
      'Guided historical and spiritual insights',
      'Private Chauffeur Service',
      'Refreshments included'
    ],
    
    // ✅ ITINERARY ITEMS (15 Sites from PDF)
    itinerary: [
      {
        title: 'Masjid Al Ghamamah',
        descriptionEn: 'When you step out of the northwestern gate of Masjid Al-Nabawi and walk a short distance, you find yourself in a serene, beautifully landscaped garden. This is the site of Saqifah Bani Sa\'adah. This garden is not merely a place of rest; it is the silent witness to a moment that secured the future of the entire Muslim Ummah. [cite: 80-83]',
        descriptionAr: 'عندما تخرج من البوابة الشمالية الغربية للمسجد النبوي وتمشي مسافة قصيرة، تجد نفسك في حديقة هادئة وجميلة. هذا هو موقع سقيفة بني ساعدة. هذه الحديقة ليست مجرد مكان للراحة؛ إنها الشاهد الصامت على اللحظة التي أمنت مستقبل الأمة الإسلامية بأكملها. [cite: 86-89]',
        images: ['/assets/images/ziyarat/ghamamah.jpg']
      },
      {
        title: 'Masjid Abu Bakr Al Siddiq R.A',
        descriptionEn: 'Tucked away in the serene southwest corner of Masjid Al-Nabawi\'s grand plaza stands a small but profoundly significant mosque. Its elegant structure with an exterior of contrasting black basalt stone and crisp white finish is a beacon of serenity. This is Masjid Abu Bakr Al-Siddiq, a monument to the legacy of faith and obedience. [cite: 97-101]',
        descriptionAr: 'يقع في الركن الجنوبي الغربي الهادئ من الساحة الكبرى للمسجد النبوي... هذا هو مسجد أبو بكر الصديق، وهو نصب تذكاري ليس فقط للخليفة الأول في الإسلام، ولكن أيضًا لتراث الإيمان والطاعة العميق الذي حمله. [cite: 97, 105]',
        images: ['/assets/images/ziyarat/abubakr.jpg']
      },
      {
        title: 'Masjid Ali bin Abi Talib R.A',
        descriptionEn: 'Located on the northwestern side of Madinah, this mosque is named after Ali ibn Abi Talib (R.A.) because it is believed to be the site where he camped during the Battle of the Trench. It is also said to be the location where he heroically killed the famous polytheist warrior, Amr ibn Abd Wud. [cite: 112-114]',
        descriptionAr: 'يقع المسجد في الجهة الشمالية الغربية من المدينة المنورة... سمي المسجد باسم علي بن أبي طالب (رضي الله عنه) لأنه يعتقد أنه الموقع الذي خيم فيه أثناء غزوة الخندق وقتل فيه ببطولة المحارب المشرك الشهير عمرو بن عبد ود. [cite: 120-122]',
        images: ['/assets/images/ziyarat/ali.jpg']
      },
      {
        title: 'House of Sayyidah Fatimah (R.A.)',
        descriptionEn: 'In the heart of Madinah... lies a spiritual footprint of a time long past. It is the site of the House of Sayyidah Fatimah bint Hussain (R.A.). This is a pilgrimage not to a building of stone and wood, but to the memory of a woman of great piety, knowledge, and dignity. [cite: 130-132]',
        descriptionAr: 'في قلب المدينة المنورة... يرقد أثر روحي من زمن غابر. إنه موقع بيت السيدة فاطمة بنت الحسين (رضي الله عنها). إنها زيارة لا إلى مبنى من حجر وخشب، بل إلى ذكرى امرأة عظيمة التقوى والعلم والكرامة. [cite: 135-136]',
        images: ['/assets/images/ziyarat/fatimah.jpg']
      },
      {
        title: 'Masjid al-Fasah',
        descriptionEn: 'On the slopes of Mount Sila... stands a mosque with a name that whispers a story of grace. This is Masjid al-Fasah. It witnessed the Prophet Muhammad\'s (S.A.W.) sincere prayer during a time of great hardship during the Battle of the Trench. [cite: 141-143]',
        descriptionAr: 'على سفوح جبل السلع بالمدينة المنورة... يقف مسجد يحمل اسمه قصة توحي بالرحمة. إنه مسجد الفسح... مكان مقدس شهد صلاة النبي محمد صلى الله عليه وسلم الخاشعة في وقت عصيب أثناء معركة الخندق. [cite: 153-155]',
        images: ['/assets/images/ziyarat/fasah.jpg']
      },
      {
        title: 'Uhud Mountain',
        descriptionEn: 'The entire area—the mountain, the hill, and this cemetery—is a physical landscape that tells the story of immense courage and profound loss during the Battle of Uhud. It is a place to reflect on the sacrifices made for the faith. [cite: 175]',
        descriptionAr: 'المنطقة بأكملها - الجبل والتلة وهذه المقبرة - هي منظر طبيعي يحكي قصة شجاعة هائلة وخسارة فادحة خلال معركة أحد. [cite: 186]',
        images: ['/assets/images/ziyarat/uhud.jpg']
      },
      {
        title: 'Cave of Bani Haram (Ghaar-e-Sajdah)',
        descriptionEn: 'High on the slopes of Mount Sila... lies a small, silent sanctuary carved into the rock. This is the Cave of Bani Haram, known as Ghaar-e-Sajdah. It became a retreat for the Prophet (S.A.W.) to seek solace and strength during the siege. [cite: 193-198]',
        descriptionAr: 'على سفوح جبل السلع... يقع ملاذ صغير هادئ منحوت في الصخر. إنه غار بني حرام، المعروف باسم غار السجود. أصبح هذا الغار ملاذاً للنبي صلى الله عليه وسلم ليلجأ فيه إلى الله طلباً للعزاء والقوة. [cite: 200-205]',
        images: ['/assets/images/ziyarat/cave.jpg']
      },
      {
        title: 'Masjid E Qiblaten',
        descriptionEn: 'This is Masjid Qiblatain, or "The Mosque of the Two Qiblas," holding the unique distinction of being the only mosque where the direction of prayer was changed during the performance of the prayer itself. [cite: 211]',
        descriptionAr: 'إنه مسجد القبلتين... الذي يتميز بكونه المسجد الوحيد الذي غير فيه اتجاه الصلاة أثناء أداء الصلاة نفسها. [cite: 221]',
        images: ['/assets/images/ziyarat/qiblatain.jpg']
      },
      {
        title: 'Masjid Quba',
        descriptionEn: 'This is Masjid Quba, the first mosque ever built in the history of Islam. Its very foundation was laid by the Prophet Muhammad (S.A.W.) himself, making it a timeless symbol of faith and the Hijra. [cite: 231-232]',
        descriptionAr: 'إنه مسجد قباء، أول مسجد بني في تاريخ الإسلام. وضع حجر أساسه النبي محمد صلى الله عليه وسلم بنفسه، مما جعله رمزاً خالداً للإيمان والهجرة. [cite: 241]',
        images: ['/assets/images/ziyarat/quba.jpg']
      },
      {
        title: 'Masjid Suqya',
        descriptionEn: 'Stands a mosque with a name that whispers of preparation and trust. This is Masjid Suqya (meaning "watering"), a testament to its dual purpose: a place for providing water and a final stop before the Battle of Badr. [cite: 253-254]',
        descriptionAr: 'يقف مسجد يحمل اسماً يعكس الاستعداد والثقة. إنه مسجد السقيا... شاهد على غايته المزدوجة: مكان للتزود بالماء ومحطة أخيرة قبل معركة بدر. [cite: 257-258]',
        images: ['/assets/images/ziyarat/suqya.jpg']
      },
      {
        title: 'Ghars Well',
        descriptionEn: 'This is Ghars Well, a small, unassuming well that holds a spiritual weight. It is connected to the last drink of the Prophet (S.A.W.) and the water that prepared him for his final journey. [cite: 263-265]',
        descriptionAr: 'إنه بئر غرس... بئر صغير يحمل في طياته ثقلاً روحياً. يرتبط بآخر رشفة شربها النبي صلى الله عليه وسلم، وبالماء الذي هيأه لرحلته الأخيرة. [cite: 272]',
        images: ['/assets/images/ziyarat/ghars.jpg']
      },
      {
        title: 'Well and Garden of Salman al-Farsi',
        descriptionEn: 'Amidst the lush palm orchards... lies the Well of Al-Faqir, commonly known as the Garden of Salman Al-Farsi. It is a testament to the story of a seeker of truth and the price paid for his freedom by the Prophet (S.A.W.). [cite: 285-287]',
        descriptionAr: 'وسط بساتين النخيل... يقع بئر الفقير، المعروف ببستان سلمان الفارسي. إنه شاهد حي على قصة باحث عن الحق وثمن حريته الذي سدده النبي صلى الله عليه وسلم. [cite: 296-298]',
        images: ['/assets/images/ziyarat/salman.jpg']
      },
      {
        title: 'Masjid Shaikhain (Dir\'a)',
        descriptionEn: 'This is Masjid Shaikhain, known also as Daraa (Shield). It marks the spot of meticulous preparation and solemn review that preceded the Battle of Uhud. [cite: 308-310]',
        descriptionAr: 'إنه مسجد الشيخين، المعروف أيضاً باسم الدرع. يخلد لحظة الاستعداد الدقيق والتأمل الجليل التي سبقت معركة أحد. [cite: 305-306]',
        images: ['/assets/images/ziyarat/shaikhain.jpg']
      },
      {
        title: 'Maqbara Sayyid al-Shuhada',
        descriptionEn: 'At the foot of Mount Uhud lies Maqbara Sayyid al-Shuhada, the "Cemetery of the Master of Martyrs." It honors Hamza ibn Abd al-Muttalib (R.A.) and 70 other companions martyred here. [cite: 313-319]',
        descriptionAr: 'عند سفح جبل أحد تقع مقبرة سيد الشهداء. تحمل هذا الاسم تكريماً لحمزة بن عبد المطلب (رضي الله عنه) وسبعين من الصحابة الذين استشهدوا هنا. [cite: 322-326]',
        images: ['/assets/images/ziyarat/shuhada.jpg']
      },
      {
        title: 'Masjid Manaratayn',
        descriptionEn: 'This is Masjid Al-Manaratayn, marking a pivotal moment in the Prophet\'s migration. It is believed to be the spot where he stopped after Quba, before his triumphant entry into Madinah. [cite: 332-336]',
        descriptionAr: 'إنه مسجد المنارتين... يشير إلى لحظة محورية في الهجرة. يُعتقد أنه المكان الذي توقف فيه النبي بعد قباء، قبل دخوله المدينة المنورة. [cite: 342-346]',
        images: ['/assets/images/ziyarat/manaratayn.jpg']
      }
    ],
    
    // ✅ INCLUSIONS & EXCLUSIONS 
    inclusions: [
      'Professional Guide',
      'Private Vehicle',
      'Chauffeur Services',
      'Refreshments (Mineral Water)'
    ],
    exclusions: [
      'Meals',
      'Personal Expences',
      'Gratuities (Tips)'
    ],
    
    // ✅ TERMS 
    terms: [
      'Payment Term: 100% Advance',
      'Payment via bank transfer to company account',
      'Cancellation Policy: 24 Hours'
    ],
    
    // ✅ VEHICLE PRICING 
    pricing: [
       { name: 'Standard Sedan (Ford Taurus/Camry)', capacity: '2+1 Guests', price: 'AED 400', image: '/assets/images/vehicles/sedan.png' },
       { name: 'Standard MPV (Hyundai H1/Staria)', capacity: '6+1 Guests', price: 'AED 600', image: '/assets/images/vehicles/mpv.png' },
       { name: 'SUV (GMC Yukon XL)', capacity: '6+1 Guests', price: 'AED 1000', image: '/assets/images/vehicles/suv.png' },
       { name: 'Toyota Hiace', capacity: '11+1 Guests', price: 'AED 800', image: '/assets/images/vehicles/hiace.png' },
       { name: 'Toyota Coaster', capacity: '21+1 Guests', price: 'AED 1200', image: '/assets/images/vehicles/coaster.png' },
       { name: 'Luxury Bus', capacity: '48+1 Guests', price: 'AED 2500', image: '/assets/images/vehicles/bus.png' }
    ]
  }
];
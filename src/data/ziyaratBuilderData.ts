export interface ZiyaratSite {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface ZiyaratRoute {
  id: string;
  cityId: 'mak' | 'taif' | 'mad';
  cityName: string;
  name: string;
  duration: string;
  description?: string;
  siteIds: string[];
}

export interface ZiyaratFleetItem {
  id: string;
  name: string;
  capacity: number;
  description: string;
  image: string;
}

export const ZIYARAT_SITES: Record<string, ZiyaratSite> = {
  // Makkah Sites
  "m-khadija": { id: "m-khadija", name: "Dar Sayyeda Khadija (r.a.)", description: "The family home of Prophet Muhammad ﷺ and Sayyeda Khadija (R.A).", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/Background-44-16.png" },
  "ansab": { id: "ansab", name: "Ansab Al-Haram", description: "The historical boundary markers defining the sacred limits of Makkah.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/2-Ansab-Al-Haram.webp" },
  "s-majaz": { id: "s-majaz", name: "Souq al-Majaz", description: "A pre-Islamic seasonal market near Arafat.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-41.png" },
  "m-shubaikah": { id: "m-shubaikah", name: "Maqbara al-Shubaikah", description: "A historic cemetery located near Masjid al-Haram.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/4-Al-Shabeka-Graveyard.webp" },
  "m-library": { id: "m-library", name: "Makkah Library (Birthplace)", description: "The site traditionally recognized as the birthplace of Prophet Muhammad ﷺ.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/5-BirthPlace.webp" },
  "m-shajarah": { id: "m-shajarah", name: "Masjid al-Shajarah", description: "Commemorates the miracle where a tree moved in obedience to the Prophet ﷺ.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/6-Masjid-Al-Shajrah.webp" },
  "m-jinn": { id: "m-jinn", name: "Masjid al-Jinn", description: "The site where a group of jinn listened to the Qur'an and embraced Islam.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/7-Masjid-Al-Jin.webp" },
  "m-mualla": { id: "m-mualla", name: "Grave of Sayyeda Khadija (r.a.)", description: "The resting place of the Prophet's ﷺ first wife located in Jannat al-Mu'alla.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/8-Grave-Of-Khadijah.webp" },
  "m-ijabah": { id: "m-ijabah", name: "Masjid al-Ijabah", description: "Known as the 'place where prayers were answered'.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/9-Masjid-Al-Ejaba.webp" },
  "bir-tuwaa": { id: "bir-tuwaa", name: "Bir Tuwaa", description: "The historic well where Prophet Muhammad ﷺ camped.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/10-Bir-Tuwa.webp" },
  "m-baiah": { id: "m-baiah", name: "Masjid al-Bayah", description: "Commemorates the Pledge of Aqabah made by Muslims from Madinah.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-42.png" },
  "m-khaif": { id: "m-khaif", name: "Masjid al-Kheif", description: "A major mosque in Mina where numerous Prophets have prayed.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/12-Masjid-Al-Khaif.webp" },
  "m-kabasha": { id: "m-kabasha", name: "Masjid al-Kabasha", description: "Associated with Prophet Ibrahim's (AS) ultimate sacrifice.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/13-Masjid-Al-Kabsha-Maqam-E-Ismail.webp" },
  "m-nimrah": { id: "m-nimrah", name: "Masjid al-Namirah", description: "The massive mosque in Arafat where the Khutbah of Arafah is delivered.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/14-Masjid-Al-Nimra-1.webp" },
  "m-rahmah": { id: "m-rahmah", name: "Jabal al-Rahmah", description: "The 'Mountain of Mercy' in Arafat where the Prophet ﷺ supplicated.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/15-Jable-Rehmat.webp" },
  "m-taneem": { id: "m-taneem", name: "Masjid Taneem", description: "A prominent Miqat location just north of Masjid al-Haram.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/16-Masjid-Al-Taneem.webp" },
  "m-jiranah": { id: "m-jiranah", name: "Masjid al-Jiranah", description: "A Miqat location where the Prophet ﷺ entered Ihram.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/17-Masjid-Al-Jiranah.webp" },
  "w-usaylah": { id: "w-usaylah", name: "Wadi al-Usaylah", description: "A historic valley that served as a traditional travel route.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/18-Inscriptions-in-Usaiylah.webp" },
  "museum": { id: "museum", name: "Two Holy Mosques Exhibition", description: "An educational museum preserving architectural heritage.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-32.png" },
  "m-maymunah": { id: "m-maymunah", name: "Grave of Sayyeda Maymunah", description: "The resting place of the Prophet's ﷺ last wife.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/22-Grave-Of-Maimoona.webp" },
  "m-fath": { id: "m-fath", name: "Masjid al-Fath (Jumum)", description: "Commemorates the Prophet's ﷺ route during the Conquest of Makkah.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/23-Masjid-Fath-Al-Jumum.webp" },
  "m-hudaybiah": { id: "m-hudaybiah", name: "Masjid Hudaybiah", description: "Site where the pivotal Treaty of Hudaybiyyah was concluded.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/19-Masjid-Al-Hubaibiyah.webp" },
  "w-hudaybiah": { id: "w-hudaybiah", name: "Well of Hudaybiah", description: "Associated with the miraculous provision of water by the Prophet ﷺ.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/11/20-Well-Of-Hudaibiyah.webp" },
  "z-ruins": { id: "z-ruins", name: "Zubaidha Ruins", description: "Remains of Ain Zubaydah, an Abbasid-era water supply system engineered for pilgrims." },
  "muzdalifa": { id: "muzdalifa", name: "Mashair ul Haram (Muzdalifa)", description: "The sacred plain where pilgrims spend the night under the open sky." },
  "m-hira": { id: "m-hira", name: "Mount Hiraa", description: "The cave where Prophet Muhammad ﷺ received the first divine revelation." },
  "m-thour": { id: "m-thour", name: "Mount Thour", description: "The historic mountain where the Prophet ﷺ and Abu Bakr (RA) sought refuge." },

  // Madinah Sites
  "saqifah": { id: "saqifah", name: "Saqifah Bani Sa‘idah", description: "The historic meeting place for the appointment of the first Caliph.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/1-Saqifaq-Bani-Saada.webp" },
  "m-ghamamah": { id: "m-ghamamah", name: "Masjid al-Ghamamah", description: "Site for Eid and rain-seeking prayers by the Prophet ﷺ.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/2-Masjid-al-Ghammamah.webp" },
  "m-abubakar": { id: "m-abubakar", name: "Masjid Abu Bakar al-Siddiq", description: "Commemorating the legacy and prayers of the first Caliph.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/3-Masjid-e-Abu-Bakr.webp" },
  "m-ali": { id: "m-ali", name: "Masjid Ali bin Abi Talib (r.a.)", description: "Honoring the fourth Rightly Guided Caliph.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/4-Masjid-Ali-Ibn-Abi-Talib.webp" },
  "m-sajdah": { id: "m-sajdah", name: "Masjid al-Sajdah (Abu Dharr)", description: "Associated with a profound prostration of gratitude by the Prophet ﷺ.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/5-Masjid-Al-Sajdah.webp" },
  "m-ijaba-mad": { id: "m-ijaba-mad", name: "Masjid al-Ijaba", description: "The Mosque of Divine Response where special supplications were made.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/6-Masjid-E-Ijabah.webp" },
  "m-shaikhain": { id: "m-shaikhain", name: "Masjid Shaikhain (Dir’a)", description: "The encampment where the army rested before the Battle of Uhud.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/7-MasjidEDaraa.webp" },
  "m-mustrah": { id: "m-mustrah", name: "Masjid Al-Mustrah", description: "A resting place of Prophet Muhammad ﷺ on the return from Uhud.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/8-Masjid-Al-Mushtrah.webp" },
  "j-rumaah": { id: "j-rumaah", name: "Jabal Rumaah", description: "The strategic hill of the archers during the Battle of Uhud.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/08/Dar-E-Seyada-Khadija.webp" },
  "m-shuhada": { id: "m-shuhada", name: "Maqbara Sayyid al-Shuhada", description: "Cemetery housing the martyred companions of Uhud including Hamza (RA).", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/10-Syad-Us-Shuhada.webp" },
  "uhud": { id: "uhud", name: "Uhud Mountain", description: "The beloved mountain of Uhud, site of the momentous battle in early Islam.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/11-Uhd-Mountain.webp" },
  "m-fasah": { id: "m-fasah", name: "Masjid al-Fasah", description: "Where the Prophet ﷺ prayed Zuhr on the day of Uhud.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/12-Masjid-Al-Fasah.webp" },
  "mehras": { id: "mehras", name: "Al-Mehrás", description: "Natural water reservoir where water was brought for the Prophet ﷺ.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/13-Mehras-Un-Nabi.webp" },
  "m-suqya": { id: "m-suqya", name: "Masjid Suqya", description: "The assembly point and head counting of companions before the Battle of Badr.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/14-Masjid-Suqiya.webp" },
  "m-manaratayn": { id: "m-manaratayn", name: "Masjid Manaratayn", description: "The historic mosque of the two minarets.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/15-Masjid-Al-Manaraten.webp" },
  "h-fatimah": { id: "h-fatimah", name: "House of Fatimah bint Hussain", description: "Historic house of the great-granddaughter of the Prophet Muhammad ﷺ.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/16-House-Of-Fatima-Bint-E-Hussain.webp" },
  "urwa": { id: "urwa", name: "Palace of Urwa bin Zubayr (r.a.)", description: "Historic palace and well of Urwa ibn al-Zubayr in Wadi al-Aqiq.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/17-House-Of-Urwah-Ibn-Zubair.webp" },
  "m-dinar": { id: "m-dinar", name: "Masjid Bani Dinar", description: "Neighborhood mosque symbolizing early Muslim community unity.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/18-Masjid-Bani-Dinar.webp" },
  "m-juma": { id: "m-juma", name: "Masjid al-Juma", description: "Site of the first Friday prayer conducted by the Prophet ﷺ after the Hijrah.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/19-Masjid-e-Juma.webp" },
  "m-quba": { id: "m-quba", name: "Masjid Quba", description: "The very first mosque established in Islam; offering 2 rakaats equals an Umrah.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/20-Masjid-Al-quba.webp" },
  "m-musabbah": { id: "m-musabbah", name: "Masjid Musabbah", description: "Historic prayer stop near Quba.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/21-Masjid-Al-Musabbah.webp" },
  "m-noor": { id: "m-noor", name: "Masjid Al Noor", description: "An early historic community mosque.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/22-Masjid-al-Noor_Usbah.webp" },
  "ghars": { id: "ghars", name: "Ghars Well (Bir Ghars)", description: "A blessed spring whose fresh water was praised and drunk by the Prophet ﷺ.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/23-Ghars-Well.webp" },
  "salman": { id: "salman", name: "Garden of Salman al-Farsi (r.a.)", description: "Where 300 date palms were planted to free Salman al-Farsi.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/24-SalmanFarsi_Well.webp" },
  "m-rayah": { id: "m-rayah", name: "Masjid al-Rayah", description: "Where the Prophet's military banner was raised during the Battle of the Trench.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/25-Masjid-Al-Rayah.webp" },
  "seven-m": { id: "seven-m", name: "Seven Masajid (Khandaq)", description: "Complex of historic battle mosques located near Mount Sela during Ghazwa Khandaq.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/26-Seven-Masajid.webp" },
  "m-haram": { id: "m-haram", name: "Masjid Bani Haram", description: "Mosque built by the tribe of Banu Haram who helped dig the trench.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/27-Masjid-e-Bani-Haram.webp" },
  "c-haram": { id: "c-haram", name: "Cave of Bani Haram", description: "Cave where the Prophet ﷺ rested during the construction of the Trench.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/09/28-Cave-Of-Bani-Harram.webp" },
  "m-qiblatain": { id: "m-qiblatain", name: "Masjid Qiblatain", description: "Where the divine revelation was received to redirect the Qibla towards Makkah.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/28-Masjid-Qiblatain.webp" },
  "b-ruma": { id: "b-ruma", name: "Bir Ruma (Well of Uthman)", description: "Well purchased by Uthman ibn Affan (RA) to provide free water to Muslims.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/29-Baer-Al-Ruma.webp" },
  "j-ayr": { id: "j-ayr", name: "Jabal 'Ayr", description: "Prominent mountain marking the southern sacred boundary of Madinah.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/31-Jabl-Ayr.webp" },
  "m-utban": { id: "m-utban", name: "Masjid Utban bin Malik", description: "Home where the Prophet ﷺ led prayer for his visually impaired companion.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/32-Masjid-Atban-Bin-Malik.webp" },
  "g-taakiya": { id: "g-taakiya", name: "Ghaar Taakiya", description: "Cave with historic stone impressions where the Prophet ﷺ rested.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Takiya02.jpg" },
  "b-arees": { id: "b-arees", name: "Bir Arees (Well of the Ring)", description: "Where the silver seal ring of the Prophet ﷺ fell during Caliph Uthman's era.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-3.png" },
  "m-anif": { id: "m-anif", name: "Masjid Bani Anif", description: "Historic stone mosque near Quba.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-10.png" },
  "b-shifa": { id: "b-shifa", name: "Bir Shifa", description: "Historic well known for its clean, refreshing water.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-7-1.png" },
  "b-zafran": { id: "b-zafran", name: "Bir Zafran", description: "Historic well along the ancient Badr trade route.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-7-3.png" },
  "w-rawha": { id: "w-rawha", name: "Wadi al-Rawha", description: "Historic valley where 70 Prophets including Moses passed through.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-6-2.png" },
  "w-khadra": { id: "w-khadra", name: "Wadi Khadra", description: "Lush historic agricultural valley outside Madinah.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/39-Wadi-E-Khadra.webp" },
  "m-barood": { id: "m-barood", name: "Masjid al-Barood", description: "Ancient stone prayer sanctuary.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/40-Masjid-Al-Burood.webp" },
  "umm-iyal": { id: "umm-iyal", name: "Umm al-Iyal", description: "Historic spring and residence developed by Sayyiduna Hasan ibn Ali.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/41-Umm-Al-Iyal.webp" },
  "w-harza": { id: "w-harza", name: "Wadi Harza", description: "Ancient natural valley and caravan trail.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/42-Wadi-E-Harza.webp" },
  "j-dood": { id: "j-dood", name: "Jabal Abu Dood", description: "Historical mountain defining regional boundary markers.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/43-Jabl-E-Abu-Dood.webp" },
  "jabir": { id: "jabir", name: "Home of Jabir (r.a.)", description: "Where the miracle of multiplying food took place during Ghazwa Khandaq." },
  "split-m": { id: "split-m", name: "Split Mountain", description: "Mountain formation associated with prophetic shelter in the Uhud ranges." },
  "qaswa": { id: "qaswa", name: "Qaswa Footprint", description: "Historic stone marking where the Prophet's camel Qaswa rested." },
  "g-ghaba": { id: "g-ghaba", name: "Ghazwa e Ghaba", description: "Site of the historic expedition of Dhi Qarad." },
  "w-jinn": { id: "w-jinn", name: "Wadi Jinn (Wadi al-Baida)", description: "Famous magnetic valley north of Madinah." },
  "sakhrat": { id: "sakhrat", name: "Sakhrat Ul Yammama", description: "A prominent historic milestone on the road to Badr." },
  "m-warqn": { id: "m-warqn", name: "Mount Warqan", description: "Sacred mountain referenced as one of the blessed mountains of Arabia." },
  "g-madhar": { id: "g-madhar", name: "Grave of Sayyadana Madhar", description: "Noble descendant resting sanctuary." },
  "k-hizami": { id: "k-hizami", name: "Khaif Al Hizami", description: "Historic stop and camp along the Badr pilgrimage corridor." },
  "b-shuhada": { id: "b-shuhada", name: "Badar Shuhada Graveyard", description: "The resting place of the 14 blessed martyrs of the Battle of Badr." },
  "b-field": { id: "b-field", name: "Battlefield of Badar", description: "Site of the decisive battle between truth and falsehood in Ramadan 2 AH." },
  "m-arieesh": { id: "m-arieesh", name: "Masjid Arieesh", description: "Command pavilion of Prophet Muhammad ﷺ overlooking the battlefield." },
  "j-malaika": { id: "j-malaika", name: "Jabal Malaika", description: "The sandy hill from where angels descended to aid the believers at Badr." },
  "b-wahoob": { id: "b-wahoob", name: "Bir Wahoob", description: "Historic desert well on the Badr route." },
  "g-nazar": { id: "g-nazar", name: "Grave of Sayyadana Nazar", description: "Historic resting sanctuary." },
  "b-mufarihat": { id: "b-mufarihat", name: "Bir e Mufarihat", description: "Historic water station in the desert." },
  "m-irq": { id: "m-irq", name: "Masjid Irq Zabiya", description: "Historic prayer sanctuary en route to Badr." },
  "m-munsarif": { id: "m-munsarif", name: "Masjid Munsarif", description: "Ancient mosque marking the return trail." },
  "m-zill": { id: "m-zill", name: "Masjid Zill Ushairah", description: "Historical mosque on the Yanbu desert route." },
  "footprint": { id: "footprint", name: "Footprint of Habeeb ﷺ", description: "Preserved stone impression associated with the Prophet ﷺ." },
  "4-springs": { id: "4-springs", name: "4 Historical Springs", description: "Natural springs attributed to the Ahl al-Bayt." },
  "m-radhwa": { id: "m-radhwa", name: "Mount Radhwa", description: "Majestic granite mountain in Yanbu praised in classical Arabic poetry." },
  "ahli-bait": { id: "ahli-bait", name: "Ahl al-Bayt Inscriptions", description: "Ancient rock inscriptions dating back to the early Islamic era." },
  "imam-qasim": { id: "imam-qasim", name: "Imam Qasim Al Rasi Sanctuary", description: "Historical heritage landmark." },
  "w-farah": { id: "w-farah", name: "Wadi Farah & Masjid Burud", description: "Scenic valley with historic prayer spots and natural springs." },

  // Taif Sites
  "t-shuhada": { id: "t-shuhada", name: "Cemetery of Martyred Companions", description: "Resting place of the martyrs who fell during the Siege of Taif.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-17-1.png" },
  "m-addass": { id: "m-addass", name: "Masjid Addas (r.a.)", description: "Commemorates the touching meeting between the Prophet ﷺ and Christian youth Addas in the grape orchard.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-16-3.png" },
  "m-koh": { id: "m-koh", name: "Masjid al-Kou", description: "Ancient mosque where the Prophet ﷺ rested his elbow while praying in Taif.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-16-4.png" },
  "muawiyah": { id: "muawiyah", name: "Muawiyah Dam (Sadd Saysed)", description: "Early Islamic stone engineering dam built during Caliph Muawiyah's era.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-16-5.png" },
  "okaz": { id: "okaz", name: "Historic Souq Okaz", description: "Ancient Arabia's most famous literary and trading marketplace.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-18-5.png" },
  "sidra": { id: "sidra", name: "Masjid Sidra", description: "Historic hillside mosque reflecting early Islamic architecture in Taif.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/08/Dar-E-Seyada-Khadija.webp" },
  "shuhata": { id: "shuhata", name: "Ruins of Halima Saadia's Home", description: "The childhood home where the Prophet ﷺ was raised in the serene hills of Banu Sa'd.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-16-7.png" },
  "m-abbas": { id: "m-abbas", name: "Masjid Abdullah ibn Abbas (r.a.)", description: "Major historical mosque in central Taif named after the Prophet's cousin, the great scholar of the Qur'an.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-18.png" },
  "shaq": { id: "shaq", name: "Shaq e Sadar Valley", description: "Valley associated with the childhood opening and purification of the Prophet's chest." },
  "v-sight": { id: "v-sight", name: "Banu Sa'd Valley Panorama", description: "Scenic panoramic views across the mountainous childhood valleys of the Prophet ﷺ." },
  "g-abbas": { id: "g-abbas", name: "Tomb of Abdullah ibn Abbas", description: "Resting place of the esteemed Companion and Scholar of the Ummah." }
};

export const ZIYARAT_ROUTES: ZiyaratRoute[] = [
  // Makkah
  {
    id: "mak-1",
    cityId: "mak",
    cityName: "Makkah",
    name: "Local City Makkah",
    duration: "4 - 6 Hours",
    description: "Classic sacred tour encompassing the core historical landmarks, caves, and mountains around Makkah.",
    siteIds: ["m-rahmah", "z-ruins", "m-nimrah", "muzdalifa", "m-khaif", "m-baiah", "m-hira", "m-thour", "s-majaz", "w-usaylah", "m-jiranah", "ansab", "m-hudaybiah", "w-hudaybiah", "museum", "m-maymunah"]
  },
  {
    id: "mak-all",
    cityId: "mak",
    cityName: "Makkah",
    name: "All Makkah Sacred Heritage",
    duration: "Full Day / Multi-Day Custom",
    description: "Deep exploration of all historical sites, ancient mosques, and birthplace memorials across Makkah.",
    siteIds: ["m-khadija", "ansab", "s-majaz", "m-shubaikah", "m-library", "m-shajarah", "m-jinn", "m-mualla", "m-ijabah", "bir-tuwaa", "m-baiah", "m-khaif", "m-kabasha", "m-nimrah", "m-rahmah", "m-taneem", "m-jiranah", "w-usaylah", "museum", "m-maymunah", "m-fath", "m-hudaybiah", "w-hudaybiah"]
  },

  // Taif
  {
    id: "taif-1",
    cityId: "taif",
    cityName: "Taif",
    name: "Historic Taif & Banu Sa'd",
    duration: "8 - 10 Hours",
    description: "Excursion to the mountain city of Taif, Halima Saadia's childhood home, Masjid Addas, and Ibn Abbas sanctuary.",
    siteIds: ["shuhata", "shaq", "v-sight", "m-abbas", "g-abbas", "t-shuhada", "m-koh", "m-addass", "muawiyah", "okaz", "sidra"]
  },

  // Madinah
  {
    id: "mad-1",
    cityId: "mad",
    cityName: "Madinah",
    name: "Madinah Local Sacred Highlights",
    duration: "4 - 6 Hours",
    description: "Essential pilgrimage tour visiting Masjid Quba, Mount Uhud, Seven Masajid, Masjid Qiblatain, and Ghars Well.",
    siteIds: ["m-suqya", "m-manaratayn", "h-fatimah", "seven-m", "m-qiblatain", "m-shuhada", "j-ayr", "m-quba", "ghars", "salman"]
  },
  {
    id: "mad-2",
    cityId: "mad",
    cityName: "Madinah",
    name: "Extended Madinah City & Heritage",
    duration: "8 - 10 Hours",
    description: "Comprehensive in-depth pilgrimage of all primary historic mosques, wells, and Uhud battle sites.",
    siteIds: ["m-suqya", "m-manaratayn", "h-fatimah", "jabir", "m-sajdah", "seven-m", "m-qiblatain", "m-shaikhain", "m-mustrah", "m-shuhada", "m-fasah", "g-taakiya", "split-m", "mehras", "uhud", "j-ayr", "m-anif", "m-quba", "b-arees", "ghars", "salman", "qaswa"]
  },
  {
    id: "mad-3",
    cityId: "mad",
    cityName: "Madinah",
    name: "Wadi Jinn & Ghazwa Ghaba",
    duration: "4 - 6 Hours",
    description: "Experience the anti-gravity phenomenon at Wadi al-Baida (Wadi Jinn) and the site of Ghazwa e Ghaba.",
    siteIds: ["g-ghaba", "w-jinn"]
  },
  {
    id: "mad-4",
    cityId: "mad",
    cityName: "Madinah",
    name: "Historical Expedition to Badar",
    duration: "8 - 10 Hours",
    description: "Day-long journey to the legendary battlefield of Badr, visiting the martyrs' graveyard, command post, and Jabal Malaika.",
    siteIds: ["sakhrat", "w-rawha", "m-warqn", "g-madhar", "b-shifa", "k-hizami", "b-shuhada", "b-field", "m-arieesh", "j-malaika", "b-wahoob", "g-nazar", "b-mufarihat", "m-irq", "m-munsarif", "b-zafran"]
  },
  {
    id: "mad-5",
    cityId: "mad",
    cityName: "Madinah",
    name: "Yanbu Al-Nakheel Excursion",
    duration: "10 - 12 Hours",
    description: "Historic journey towards the coastal palms of Yanbu, Mount Radhwa, and ancient oasis springs.",
    siteIds: ["m-zill", "footprint", "4-springs", "m-radhwa"]
  },
  {
    id: "mad-6",
    cityId: "mad",
    cityName: "Madinah",
    name: "Wadi Harza & Early Inscriptions",
    duration: "4 - 6 Hours",
    description: "Exploration of early Islamic rock inscriptions and geographic valleys south of Madinah.",
    siteIds: ["w-harza", "ahli-bait", "imam-qasim"]
  },
  {
    id: "mad-7",
    cityId: "mad",
    cityName: "Madinah",
    name: "Wadi Khidra & Wadi Farah",
    duration: "8 - 10 Hours",
    description: "Historic valley tour visiting agricultural settlements, natural wells, and early sanctuaries.",
    siteIds: ["w-khadra", "w-farah"]
  },
  {
    id: "mad-all",
    cityId: "mad",
    cityName: "Madinah",
    name: "All Madinah Historical Heritage",
    duration: "Full Day / Multi-Day Custom",
    description: "The complete journey across every preserved mosque, well, battlefield, and landmark in Madinah.",
    siteIds: ["saqifah", "m-ghamamah", "m-abubakar", "m-ali", "m-sajdah", "m-ijaba-mad", "m-shaikhain", "m-mustrah", "j-rumaah", "m-shuhada", "uhud", "m-fasah", "mehras", "m-suqya", "m-manaratayn", "h-fatimah", "urwa", "m-dinar", "m-juma", "m-quba", "m-musabbah", "m-noor", "ghars", "salman", "m-rayah", "seven-m", "m-haram", "c-haram", "m-qiblatain", "b-ruma", "j-ayr", "m-utban", "g-taakiya", "b-arees", "m-anif", "b-shifa", "b-zafran", "w-rawha", "w-khadra", "m-barood", "umm-iyal", "w-harza", "j-dood"]
  }
];

export const ZIYARAT_CITIES_DATA = [
  {
    id: 'mak',
    name: 'Makkah Al-Mukarramah',
    shortName: 'Makkah',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=600',
    routeIds: ['mak-1', 'mak-all']
  },
  {
    id: 'taif',
    name: 'Taif Al-Hada',
    shortName: 'Taif',
    image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&q=80&w=600',
    routeIds: ['taif-1']
  },
  {
    id: 'mad',
    name: 'Madinah Al-Munawwarah',
    shortName: 'Madinah',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80&w=600',
    routeIds: ['mad-1', 'mad-2', 'mad-3', 'mad-4', 'mad-5', 'mad-6', 'mad-7', 'mad-all']
  }
];

export const ZIYARAT_FLEET: ZiyaratFleetItem[] = [
  {
    id: 'sedan',
    name: 'Sedan Camry',
    capacity: 2,
    description: 'Executive air-conditioned sedan ideal for solo pilgrims, couples, or small families.',
    image: 'https://media.chromedata.com/MediaGallery/media/MjkzOTU4Xk1lZGlhIEdhbGxlcnk/LMd-9QmYj0RCGAoxWsfyPWl1t1lqVvBOWhYclhW_GkmTSoPJtmjQooeAQy-4AZvqC80rpio2ZaQZSeYea8gHA1JZAMeve7Gpm0P4JEYia9pYaK5dPRINNtNjTzOlaxeUIZI61loFi1vRgiIl4fJLEecm6T2z3C4NeT12INl11yM/cc_2026TOC022075593_01_640_218.png'
  },
  {
    id: 'gmc',
    name: 'GMC Yukon',
    capacity: 6,
    description: 'Spacious luxury SUV with generous luggage room and premium comfort for families.',
    image: 'https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/2-gmc.webp'
  },
  {
    id: 'staria',
    name: 'Hyundai Staria',
    capacity: 9,
    description: 'Modern luxury van with panoramic windows and comfortable seating for medium groups.',
    image: 'https://www.hyundai.com/content/dam/hyundai/ph/en/images/find-a-car/thumbnail/STARIA-HEV.png'
  },
  {
    id: 'hiace',
    name: 'Toyota Hiace',
    capacity: 11,
    description: 'Reliable high-roof group vehicle with ample luggage capacity for extended tours.',
    image: 'https://img.pcauto.com/model/images/touPic/my/Toyota-Granace_4931.png'
  },
  {
    id: 'coaster',
    name: 'Toyota Coaster',
    capacity: 20,
    description: 'High-capacity medium bus with dedicated guide microphone and luggage bay.',
    image: 'https://madinahmakkahtaxi.com/toyota-coaster.jpg'
  },
  {
    id: 'bus49',
    name: '49 Seater Bus',
    capacity: 49,
    description: 'Full-size luxury touring coach with reclining seats and audio system for large delegations.',
    image: '/assets/images/transportation/bus.png'
  }
];

export type ZiyaratRoutePrice = {
  custom?: boolean;
  [vehicleId: string]: number | boolean | undefined;
};

export const ZIYARAT_PRICES: Record<string, ZiyaratRoutePrice> = {
  "mak-1": { sedan: 900, staria: 950, gmc: 1100, hiace: 1000, coaster: 1200, bus49: 1400 },
  "taif-1": { sedan: 1410, staria: 1670, gmc: 1890, hiace: 1740, coaster: 2000, bus49: 3100 },
  "mad-1": { sedan: 900, staria: 950, gmc: 1100, hiace: 1000, coaster: 1200, bus49: 1400 },
  "mad-2": { sedan: 1410, staria: 1670, gmc: 1890, hiace: 1740, coaster: 2000, bus49: 3100 },
  "mad-3": { sedan: 900, staria: 950, gmc: 1100, hiace: 1000, coaster: 1200, bus49: 1400 },
  "mad-4": { sedan: 1410, staria: 1670, gmc: 1890, hiace: 1740, coaster: 2000, bus49: 3100 },
  "mad-5": { sedan: 1510, staria: 1770, gmc: 2340, hiace: 1840, coaster: 2300, bus49: 3500 },
  "mad-6": { sedan: 1000, staria: 1050, gmc: 1300, hiace: 1200, coaster: 1400, bus49: 1600 },
  "mad-7": { sedan: 1410, staria: 1670, gmc: 1890, hiace: 1740, coaster: 2000, bus49: 3100 },
  "mak-all": { custom: true },
  "mad-all": { custom: true }
};

export function getZiyaratRouteFare(routeId: string, vehicleId: string): number | null {
  const p = ZIYARAT_PRICES[routeId];
  if (!p || p.custom) return null;
  const val = p[vehicleId];
  return typeof val === 'number' ? val : null;
}

// ---------------------------------------------------------------------------
// Fleet allocation helpers — shared by the fleet step, route/schedule fare
// displays, the trip summary and the inquiry payload so every surface agrees
// on the same group size and required vehicle count.
// ---------------------------------------------------------------------------

/** Total group size the selected ziyarat/premium fleet vehicle must carry. */
export function getZiyaratGroupPax(
  isUmrahPlus: boolean,
  adultsCount: number,
  childrenCount: number,
  passengerCount: number
): number {
  if (isUmrahPlus) return Math.max(1, (adultsCount || 1) + (childrenCount || 0));
  return Math.max(1, passengerCount || adultsCount || 2);
}

/** Number of vehicles required so every guest rides (round-up, minimum 1). */
export function getRequiredFleetCount(pax: number, capacity: number): number {
  return Math.max(1, Math.ceil(pax / Math.max(1, capacity || 2)));
}

/** Allocated quantity for a chosen builder-fleet vehicle given the current group. */
export function getZiyaratAllocatedQuantity(
  vehicleId: string,
  isUmrahPlus: boolean,
  adultsCount: number,
  childrenCount: number,
  passengerCount: number
): number {
  const pax = getZiyaratGroupPax(isUmrahPlus, adultsCount, childrenCount, passengerCount);
  const capacity = ZIYARAT_FLEET.find(v => v.id === (vehicleId || 'sedan'))?.capacity || 2;
  return getRequiredFleetCount(pax, capacity);
}



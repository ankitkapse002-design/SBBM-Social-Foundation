import { Router, Request, Response } from 'express';
import { rateLimit } from '../middleware/auth';

export const chatRouter = Router();

interface ChatQuery {
  message: string;
  language: 'en' | 'hi' | 'mr';
}

interface ChatResponseData {
  reply: string;
  quickReplies: string[];
  suggestedRoute?: string;
  actionLabel?: string;
}

const KNOWLEDGE_BASE = {
  admission: {
    en: "Vyenkatesh Ashram provides a safe, clean, supportive and dignified living environment for seniors. Accommodation availability and admission procedures must be confirmed directly with our management. Would you like to fill out our online Admission Enquiry form or call our office?",
    hi: "व्यंकटेश आश्रम वरिष्ठ नागरिकों के लिए एक सुरक्षित, स्वच्छ, सहयोगी और गरिमापूर्ण वातावरण प्रदान करता है। प्रवेश प्रक्रिया और रिक्त स्थानों की पुष्टि सीधे प्रबंधन से की जानी चाहिए। क्या आप ऑनलाइन प्रवेश पूछताछ फॉर्म भरना चाहते हैं या हमारे कार्यालय से संपर्क करना चाहेंगे?",
    mr: "व्यंकटेश आश्रम ज्येष्ठ नागरिकांसाठी एक सुरक्षित, स्वच्छ, आश्वासक आणि सन्माननीय वातावरण प्रदान करते. निवास व्यवस्था आणि प्रवेश प्रक्रिया संस्थेच्या व्यवस्थापनाशी थेट संपर्क साधून निश्चित करावी लागते. आपण ऑनलाइन चौकशी अर्ज भरू शकता किंवा आमच्या कार्यालयाशी संपर्क साधू शकता.",
    route: '/admission',
    actionLabel: { en: 'Open Admission Enquiry', hi: 'प्रवेश पूछताछ फॉर्म खोलें', mr: 'प्रवेश चौकशी अर्ज उघडा' }
  },
  location_address: {
    en: "Vyenkatesh Ashram is located at 434, Anjikar Bagh, Mansar Mahuli Road, Village/Post Mahuli, Tehsil Parseoni, District Nagpur, Maharashtra – 441105.\n\nOur Foundation Head Office is at C/o Ashvin V. Anjikar (Anjikar House), Panchpaoli, Timki Chimabai Peth, Nagpur – 440018.\nOfficial Contact: +91 98908 98081.",
    hi: "व्यंकटेश आश्रम का पता: 434, अंजिकार बाग, मानसर माहुली रोड, ग्राम/पोस्ट माहुली, तहसील पारशिवनी, जिला नागपुर, महाराष्ट्र – 441105।\n\nफाउंडेशन मुख्य कार्यालय: अंजिकार हाउस, पांचपावली, टिमकी चिमाबाई पेठ, नागपुर – 440018।\nआधिकारिक संपर्क: +91 98908 98081।",
    mr: "व्यंकटेश आश्रम पत्ता: ४३४, अंजिकार बाग, मानसर माहुली रोड, गाव/पोस्ट माहुली, तालुका पारशिवनी, जिल्हा नागपूर, महाराष्ट्र – ४४११०५.\n\nफाउंडेशन मुख्य कार्यालय: अंजिकार हाऊस, पाचपावली, टिमकी चिमाबाई पेठ, नागपूर – ४४००१८.\nअधिकृत संपर्क: +91 98908 98081.",
    route: '/contact',
    actionLabel: { en: 'View Map & Directions', hi: 'नक्शा और संपर्क देखें', mr: 'नकाशा व संपर्क पहा' }
  },
  about_foundation: {
    en: "SBBM Social Foundation Society was founded in 2015 (Reg No: 332-15-Nag) under the leadership of Mr. Ashwin Vyenkatrao Anjikar and Mrs. Tina Anjikar. We operate Vyenkatesh Ashram as a charitable, non-granted old-age home providing dignified shelter, Go-Seva, naturopathy, and community welfare.",
    hi: "SBBM सोशल फाउंडेशन सोसाइटी की स्थापना 2015 (पंजीकरण: 332-15-नाग) में श्री अश्विन व्यंकटराव अंजिकार और श्रीमती टीना अंजिकार के नेतृत्व में हुई थी। हम व्यंकटेश आश्रम को एक धर्मार्थ, गैर-अनुदानित वृद्धाश्रम के रूप में संचालित करते हैं, जो गरिमापूर्ण आश्रय, गो-सेवा और प्राकृतिक चिकित्सा प्रदान करता है।",
    mr: "SBBM सोशल फाउंडेशन सोसायटीची स्थापना २०१५ (नोंदणी क्र: ३३२-१५-नाग) मध्ये श्री अश्विन व्यंकटराव अंजिकार आणि सौ. टीना अंजिकार यांच्या नेतृत्वाखाली झाली. आम्ही व्यंकटेश आश्रम हे एक सेवाभावी, विनाअनुदानित वृद्धाश्रम म्हणून चालवतो, जे सन्माननीय निवारा, गो-सेवा आणि निसर्गोपचार प्रदान करते.",
    route: '/about',
    actionLabel: { en: 'Learn About Foundation', hi: 'फाउंडेशन के बारे में पढ़ें', mr: 'संस्थेविषयी अधिक जाणून घ्या' }
  },
  goseva: {
    en: "Our Go-Seva Kendra at Vyenkatesh Ashram provides loving shelter, fresh green fodder, and veterinary care for indigenous cows. It offers therapeutic peace for ashram elders and fresh milk for residents.",
    hi: "व्यंकटेश आश्रम में हमारा गो-सेवा केंद्र देसी गायों को स्वच्छ आश्रय, हरा चारा और स्नेहपूर्ण देखभाल प्रदान करता है। यह आश्रम के बुजुर्गों के लिए आत्मिक शांति और शुद्ध दूध प्रदान करता है।",
    mr: "व्यंकटेश आश्रमातील गो-सेवा केंद्र देशी गाईंना स्वच्छ निवारा, हिरवा चारा आणि प्रेमळ सेवा देते. यामुळे आश्रमवासीयांना मानसिक शांतता आणि ताजे दूध मिळते.",
    route: '/services/goseva-kendra',
    actionLabel: { en: 'Explore Go-Seva Kendra', hi: 'गो-सेवा केंद्र देखें', mr: 'गो-सेवा केंद्र पहा' }
  },
  naturopathy: {
    en: "We integrate Naturopathy and gentle morning yoga into ashram life. In the fresh morning air of Anjikar Bagh, residents practice gentle pranayama, receive herbal decoctions from our medicinal garden, and enjoy natural sun exposure.",
    hi: "हम आश्रम के जीवन में प्राकृतिक चिकित्सा और सुबह के हल्के योग को शामिल करते हैं। अंजिकार बाग की स्वच्छ हवा में निवासी प्राणायाम, हर्बल काढ़ा और धूप चिकित्सा का लाभ लेते हैं।",
    mr: "आम्ही आश्रमात निसर्गोपचार आणि सकाळी हलक्या योगासनाचा समावेश करतो. अंजिकार बागेच्या शुद्ध वातावरणात निवासी प्राणायाम, औषधी वनस्पतींचे काढे आणि सूर्यप्रकाशाचा लाभ घेतात.",
    route: '/services/naturopathy',
    actionLabel: { en: 'Naturopathy Details', hi: 'प्राकृतिक चिकित्सा विवरण', mr: 'निसर्गोपचार माहिती' }
  },
  donation: {
    en: "We welcome charitable support through bank contributions, daily grocery provisions (grains, cooking oil, pulses), medicines, blankets, and dry or green fodder for our cows. Formal receipts are issued. Please contact our office directly (+91 98908 98081) for bank account verification.",
    hi: "हम बैंक अंशदान, दैनिक राशन (अनाज, तेल, दालें), दवाइयां, कंबल, और गायों के लिए चारे के माध्यम से आपके सहयोग का स्वागत करते हैं। सभी सहयोगों की आधिकारिक रसीद दी जाती है। कृपया बैंक विवरण के लिए हमारे कार्यालय (+91 98908 98081) से संपर्क करें।",
    mr: "आम्ही बँक देणगी, दैनंदिन किराणा सामान (धान्य, तेल, डाळी), औषधे, चादरी आणि गाईंसाठी चारा या स्वरूपात आपल्या दानाचे स्वागत करतो. सर्व दानांची अधिकृत पावती दिली जाते. बँक तपशीलासाठी कृपया थेट संपर्क साधा: +91 98908 98081.",
    route: '/support',
    actionLabel: { en: 'Support & Donate', hi: 'सहयोग और दान विवरण', mr: 'देणगी व सहकार्य' }
  },
  volunteer: {
    en: "Volunteers are the heart of our community! You can spend time reading to residents, assisting in festival celebrations, conducting music/bhajan sessions, or helping in our garden and gaushala.",
    hi: "स्वयंसेवक हमारे समुदाय की जान हैं! आप बुजुर्गों के साथ बातचीत करने, भजन-कीर्तन में भाग लेने, या हमारे बगीचे और गौशाला में सेवा करने के लिए शामिल हो सकते हैं।",
    mr: "स्वयंसेवक हे आमच्या संस्थेचा आधार आहेत! आपण वृद्धांशी संवाद साधण्यासाठी, भजनात सहभागी होण्यासाठी, किंवा बागेत व गोशाळेत सेवा करण्यासाठी सहभागी होऊ शकता.",
    route: '/volunteer',
    actionLabel: { en: 'Join as Volunteer', hi: 'स्वयंसेवक बनें', mr: 'स्वयंसेवक व्हा' }
  },
  membership: {
    en: "You can create a free website account to interact with our portal, or apply for official foundation society membership. Membership applications are reviewed by the board.",
    hi: "आप हमारे पोर्टल के लिए एक निःशुल्क खाता बना सकते हैं, या आधिकारिक फाउंडेशन सोसाइटी सदस्यता के लिए आवेदन कर सकते हैं।",
    mr: "आपण आमच्या पोर्टलवर विनामूल्य खाते तयार करू शकता, किंवा संस्थेच्या अधिकृत सदस्यत्वासाठी अर्ज करू शकता.",
    route: '/membership',
    actionLabel: { en: 'Membership Details', hi: 'सदस्यता विवरण', mr: 'सदस्यत्व माहिती' }
  }
};

const DEFAULT_QUICK_REPLIES = {
  en: ['Admission Process', 'Ashram Address & Phone', 'Go-Seva Kendra', 'How to Donate', 'Volunteer with us'],
  hi: ['प्रवेश प्रक्रिया', 'आश्रम का पता और फोन', 'गो-सेवा केंद्र', 'दान कैसे करें', 'स्वयंसेवक बनें'],
  mr: ['प्रवेश प्रक्रिया', 'आश्रमाचा पत्ता व फोन', 'गो-सेवा केंद्र', 'देणगी कशी द्यावी', 'स्वयंसेवक व्हा']
};

chatRouter.post('/chat', rateLimit(60000, 30), (req: Request, res: Response) => {
  try {
    const { message, language = 'en' } = req.body as ChatQuery;
    const lang = (language === 'hi' || language === 'mr') ? language : 'en';

    if (!message || message.trim() === '') {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }

    const lower = message.toLowerCase();

    let matchedTopic: keyof typeof KNOWLEDGE_BASE | null = null;

    if (lower.includes('admiss') || lower.includes('join') || lower.includes('old age') || lower.includes('stay') || lower.includes('room') || lower.includes('प्रवेश') || lower.includes('दाखिला') || lower.includes('रहाव')) {
      matchedTopic = 'admission';
    } else if (lower.includes('address') || lower.includes('where') || lower.includes('location') || lower.includes('phone') || lower.includes('contact') || lower.includes('call') || lower.includes('पत्ता') || lower.includes('पता') || lower.includes('फोन') || lower.includes('संपर्क')) {
      matchedTopic = 'location_address';
    } else if (lower.includes('goseva') || lower.includes('cow') || lower.includes('gaushala') || lower.includes('गाय') || lower.includes('गौ') || lower.includes('गोसेवा') || lower.includes('गोशाळा')) {
      matchedTopic = 'goseva';
    } else if (lower.includes('naturopath') || lower.includes('yoga') || lower.includes('health') || lower.includes('medical') || lower.includes('योग') || lower.includes('निसर्गोपचार') || lower.includes('आरोग्य')) {
      matchedTopic = 'naturopathy';
    } else if (lower.includes('donat') || lower.includes('support') || lower.includes('money') || lower.includes('bank') || lower.includes('दान') || lower.includes('मदत') || lower.includes('सहयोग') || lower.includes('देणगी')) {
      matchedTopic = 'donation';
    } else if (lower.includes('volunt') || lower.includes('serve') || lower.includes('seva') || lower.includes('सेवा') || lower.includes('स्वयंसेवक')) {
      matchedTopic = 'volunteer';
    } else if (lower.includes('member') || lower.includes('register') || lower.includes('login') || lower.includes('खाते') || lower.includes('सदस्य')) {
      matchedTopic = 'membership';
    } else if (lower.includes('who') || lower.includes('about') || lower.includes('ashwin') || lower.includes('anjikar') || lower.includes('foundation') || lower.includes('संस्था') || lower.includes('माहिती')) {
      matchedTopic = 'about_foundation';
    }

    if (matchedTopic) {
      const topic = KNOWLEDGE_BASE[matchedTopic];
      const reply = topic[lang];
      const actionLabel = topic.actionLabel[lang];

      res.json({
        success: true,
        reply,
        quickReplies: DEFAULT_QUICK_REPLIES[lang],
        suggestedRoute: topic.route,
        actionLabel,
      });
      return;
    }

    // Default polite response grounded in the official contact number
    const fallbackReplies = {
      en: "Thank you for reaching out! SBBM Social Foundation operates Vyenkatesh Ashram at Anjikar Bagh, Mahuli. For specific requirements or direct management consultations, please call our official helpline at +91 98908 98081.",
      hi: "संपर्क करने के लिए धन्यवाद! SBBM सोशल फाउंडेशन माहुली के अंजिकार बाग में व्यंकटेश आश्रम संचालित करता है। किसी भी विशेष जानकारी के लिए कृपया हमारे आधिकारिक हेल्पलाइन नंबर +91 98908 98081 पर संपर्क करें।",
      mr: "संपर्क केल्याबद्दल धन्यवाद! SBBM सोशल फाउंडेशन माहुली येथील अंजिकार बाग येथे व्यंकटेश आश्रम चालवते. कोणत्याही विशिष्ट माहितीसाठी किंवा मार्गदर्शनासाठी कृपया आमच्या अधिकृत हेल्पलाइनवर संपर्क साधा: +91 98908 98081."
    };

    res.json({
      success: true,
      reply: fallbackReplies[lang],
      quickReplies: DEFAULT_QUICK_REPLIES[lang],
      suggestedRoute: '/contact',
      actionLabel: lang === 'hi' ? 'संपर्क पृष्ठ' : (lang === 'mr' ? 'संपर्क साधा' : 'Contact Us'),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Assistant error: ' + err.message });
  }
});

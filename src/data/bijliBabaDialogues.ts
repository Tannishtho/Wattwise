import { BabaMood, BabaTriggerEvent } from '../types/notification';

export interface BabaDialogue {
  headline: string;
  message: string;
}

export const BIJLI_BABA_DIALOGUES: Record<
  BabaTriggerEvent,
  Record<'NORMAL' | 'ROAST', BabaDialogue>
> = {
  BUDGET_WARNING_75: {
    NORMAL: {
      headline: 'Budget Alert (75% Reached)',
      message: 'Dhyan do dost! Monthly electricity budget ka 75% use ho chuka hai. Non-essential appliances thoda control karo.',
    },
    ROAST: {
      headline: '75% Budget Uda Diya!',
      message: 'Bijli ka bill tera baap bharega kya? 75% budget khatam ho gaya hai, abhi poora mahina baaki hai!',
    },
  },
  BUDGET_CRITICAL_90: {
    NORMAL: {
      headline: 'Critical Budget Warning (90%)',
      message: 'Savdhaan! Aapka monthly budget 90% cross kar gaya hai. Sirf essential appliances hi use karne ki salah di jaati hai.',
    },
    ROAST: {
      headline: '90% Cross Kar Gaya! Sudhar Ja!',
      message: 'Bill 90% cross kar gaya. Ab toh sudhar ja! Candle mangwa loon kya online?',
    },
  },
  BUDGET_OVER_100: {
    NORMAL: {
      headline: 'Budget Exceeded (100%+)',
      message: 'Monthly electricity budget target exceed ho chuka hai. Agle mahine ke expenses adjust karne padenge.',
    },
    ROAST: {
      headline: 'Pocket Mein Chhed Ho Gaya!',
      message: 'Khatam! Tata! Bye-bye! Budget 100% paar ho chuka hai. Bijli vibhag wale ab special respect ke saath bill bhejenge!',
    },
  },
  ALL_APPLIANCES_ON: {
    NORMAL: {
      headline: 'High Simultaneous Load',
      message: 'Ghar ke sabhi appliances ek saath chal rahe hain. Power draw kaafi high ho gaya hai.',
    },
    ROAST: {
      headline: 'Ghar Ko Las Vegas Bana Diya Kya?',
      message: 'Are bhai bhai bhai! Saare ke saare appliances ON kar diye? AC ko Antarctica samajh ke chala raha hai kya?',
    },
  },
  HIGH_CONSUMER_ALERT: {
    NORMAL: {
      headline: 'High Consumer Running',
      message: 'High wattage appliance (AC / Washing Machine) continuously run kar raha hai. Daily cost rapidly badh rahi hai.',
    },
    ROAST: {
      headline: 'Meter Express Speed Se Ghoom Raha Hai!',
      message: 'Meter itni tez ghoom raha hai ki fan ban sakta hai! AC ko 24 degree pe set karo ya band karo bhai.',
    },
  },
  SAVINGS_ACTION_TAKEN: {
    NORMAL: {
      headline: 'Energy Efficient Step!',
      message: 'Bahut badhiya! Appliance optimise karne se estimated monthly bill kam hua hai.',
    },
    ROAST: {
      headline: 'Bijli Baba Khush Hua!',
      message: 'Excellent! Aaj energy consumption kam hua. Bijli Baba khush hua! Aise hi akalmand bano.',
    },
  },
  OUTAGE_TRIGGERED: {
    NORMAL: {
      headline: 'Simulated Power Cut Activated',
      message: 'Power cut initiate ho gaya hai. Backup power pe household switch ho gaya hai. Kripya exactly 3 appliances select karein.',
    },
    ROAST: {
      headline: 'Batti Gul, Meter Chalu!',
      message: 'Power cut ho gaya! Ab samajhdari se sirf TEEN (3) appliances choose kar, warna battery 15 minute mein dum tod degi!',
    },
  },
  INCOMPLETE_SELECTION: {
    NORMAL: {
      headline: 'Emergency Selection Pending',
      message: 'Emergency Mode activate karne ke liye exactly 3 appliances chunein. Abhi selection poora nahi hua hai.',
    },
    ROAST: {
      headline: 'Aadha Kaam Mat Chhodo!',
      message: 'Emergency mein aalsi mat bano! 3 appliances select karne ko bola tha, abhi tak poora nahi kiya?',
    },
  },
  FOURTH_APPLIANCE_REJECTED: {
    NORMAL: {
      headline: 'Strict 3-Appliance Limit',
      message: 'Emergency power mode allows strictly 3 appliances to prevent battery overload. Chautha appliance add nahi ho sakta.',
    },
    ROAST: {
      headline: 'Lalach Buri Bala Hai!',
      message: 'Oye hero! Emergency mein sirf TEEN (3) appliances allowed hain. Chautha lagayega toh inverter blast ho jayega!',
    },
  },
  EMERGENCY_ADVISOR_GENERATED: {
    NORMAL: {
      headline: 'Smart Advisor Evaluation Ready',
      message: 'Smart Emergency Advisor ne sabhi 20 combinations analyse kar liye hain. Sabse safe aur efficient combo recommend kiya gaya hai.',
    },
    ROAST: {
      headline: 'Bijli Baba Ka Formula Lag Gaya!',
      message: 'Computer mahashay ne sabhi 20 permutation & combination check kar liye. Fridge + Fan + Lights hi zindabad hai!',
    },
  },
  NORMAL_POWER_RESTORED: {
    NORMAL: {
      headline: 'Grid Power Restored',
      message: 'Normal electricity supply restore ho gayi hai. Sabhi pre-outage appliances apne purane status pe wapas aa gaye hain.',
    },
    ROAST: {
      headline: 'Bijli Wapas Aa Gayi!',
      message: 'Bijli wapas aa gayi! Shanti bani rahe, normal appliances restore ho gaye hain. Ab chain ki saans lo!',
    },
  },
  MANUAL_TIP_REQUEST: {
    NORMAL: {
      headline: 'Bijli Baba Pro Tip',
      message: 'Tip: AC ko 24°C par chalane se 18°C ke mukable lagbhag 24% electricity save hoti hai.',
    },
    ROAST: {
      headline: 'Gyaan Sun Lo Free Ka',
      message: 'Television standby mode mein bhi bijli pita hai. Switch board se band karne ki aadat daalo, babu!',
    },
  },
};

export const RANDOM_ROAST_QUOTES = [
  "Bijli ka bill tera baap bharega kya?",
  "AC ko Antarctica samajh ke chala raha hai kya?",
  "Bill 90% cross kar gaya. Ab toh sudhar ja!",
  "Power cut ho gaya! Ab samajhdari se teen appliances choose kar.",
  "Excellent! Aaj energy consumption kam hua. Bijli Baba khush hua!",
  "Switch board koi showpiece nahi hai, switch OFF karna bhi seekho!",
  "Meter ghoomne ki awaaz yahan tak aa rahi hai!",
];

export function getBabaDialogue(
  trigger: BabaTriggerEvent,
  mood: BabaMood
): BabaDialogue | null {
  if (mood === 'SILENT') return null;
  const moodKey: 'NORMAL' | 'ROAST' = mood === 'ROAST' ? 'ROAST' : 'NORMAL';
  return BIJLI_BABA_DIALOGUES[trigger]?.[moodKey] || null;
}

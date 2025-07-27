// Translation dictionary for English and Arabic
const translations = {
  en: {
    startGame: "Start Game",
    joinGame: "Join Game",
    clearName: "Clear Saved Name",
    enterName: "Enter your name",
    enterGameCode: "Enter Game Code",
    gameTitle: "Spyfall Game",
    adHere: "🎮 Your Ad Here - Premium Gaming Experience",
    // ...add all other UI strings here
  },
  ar: {
    startGame: "ابدأ اللعبة",
    joinGame: "لعبة الانضمام",
    clearName: "مسح الاسم المحفوظ",
    enterName: "ادخل اسمك",
    enterGameCode: "ادخل رمز اللعبة",
    gameTitle: "لعبة الجاسوس",
    adHere: "🎮 إعلانك هنا - تجربة ألعاب مميزة",
    // ...add all other UI strings here
  }
};

// Utility to get translation
function t(key) {
  const lang = localStorage.getItem('lang') || 'ar';
  return translations[lang][key] || key;
}

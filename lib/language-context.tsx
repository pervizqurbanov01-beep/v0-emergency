"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type Language = "az" | "ru" | "en"

type Translations = {
  // Main Page
  emergencyCall: string
  emergencyRequest: string
  // Form
  reason: string
  selectReason: string
  headache: string
  nausea: string
  fever: string
  chestPain: string
  difficultyBreathing: string
  injury: string
  other: string
  whoIsCallFor: string
  forMe: string
  forSomeoneElse: string
  location: string
  useCurrentLocation: string
  selectOnMap: string
  sendRequest: string
  medicalNotes: string
  enterMedicalNotes: string
  sendRequestConfirmation: string
  medicalHistory: string
  enterMedicalHistory: string
  bloodType: string
  selectBloodType: string
  // Tracking
  trackingAmbulance: string
  ambulanceDispatched: string
  ambulanceEnRoute: string
  ambulanceArriving: string
  ambulanceArrived: string
  callId: string
  minutes: string
  callHistory: string
  cancelledCall: string
  completedCall: string
  noCallsYet: string
  cancelCall: string
  cancelCallTitle: string
  cancelCallConfirmation: string
  no: string
  yesCancelCall: string
  // Profile
  profile: string
  personalInformation: string
  firstName: string
  lastName: string
  phoneNumber: string
  dateOfBirth: string
  day: string
  month: string
  year: string
  gender: string
  selectGender: string
  male: string
  female: string
  otherGender: string
  address: string
  streetAddress: string
  enterAddress: string
  updateLocation: string
  appName: string
  emergency: string
  emergencyDescription: string
  saveProfile: string
  logout: string
  months: Array<{ value: string; label: string }>
  voiceMessage: string
  uploadVoiceMessage: string
  recordMessage: string
  activeCall: string
  reasonDescriptions: Record<string, string>
  logout: string
  // Driver Features
  redirect: string
  acceptCall: string
  yes: string
  // Emergency Service Logo
  emergencyServiceLogo: string
}

const translations: Record<Language, Translations> = {
  en: {
    emergencyCall: "Call Ambulance",
    emergencyRequest: "Emergency Request",
    reason: "Reason",
    selectReason: "Select reason",
    headache: "Headache",
    nausea: "Nausea",
    fever: "Fever",
    chestPain: "Chest Pain",
    difficultyBreathing: "Difficulty Breathing",
    injury: "Injury",
    other: "Other",
    whoIsCallFor: "Who is the call for?",
    forMe: "For me",
    forSomeoneElse: "For someone else",
    location: "Location",
    useCurrentLocation: "Use my current location",
    selectOnMap: "Select location on map",
    sendRequest: "Send Request",
    medicalNotes: "Medical Notes",
    enterMedicalNotes: "Enter any medical conditions or symptoms",
    sendRequestConfirmation: "Are you sure you want to send the emergency request?",
    medicalHistory: "Medical History",
    enterMedicalHistory: "Enter your medical conditions and health history",
    bloodType: "Blood Type",
    selectBloodType: "Select blood type",
    trackingAmbulance: "Tracking Ambulance",
    ambulanceDispatched: "Ambulance Dispatched",
    ambulanceEnRoute: "Ambulance En Route",
    ambulanceArriving: "Ambulance Arriving Soon",
    ambulanceArrived: "Ambulance Has Arrived",
    callId: "Call ID",
    minutes: "min",
    callHistory: "Call History",
    cancelledCall: "Cancelled",
    completedCall: "Completed",
    noCallsYet: "No emergency calls yet",
    profile: "Profile",
    personalInformation: "Personal Information",
    firstName: "First Name",
    lastName: "Last Name",
    phoneNumber: "Phone Number",
    dateOfBirth: "Date of Birth",
    day: "Day",
    month: "Month",
    year: "Year",
    gender: "Gender",
    selectGender: "Select gender",
    male: "Male",
    female: "Female",
    otherGender: "Other",
    address: "Address",
    streetAddress: "Street Address",
    enterAddress: "Enter your address",
    updateLocation: "Update Location on Map",
    appName: "Emergency",
    emergency: "Emergency Medical Assistance",
    emergencyDescription: "If you need emergency medical assistance, click on the button below",
    cancelCall: "Cancel Call",
    cancelCallTitle: "Cancel call?",
    cancelCallConfirmation: "Are you sure you want to cancel this call?",
    no: "No",
    yesCancelCall: "Yes, Cancel",
    saveProfile: "Save",
    logout: "Logout",
    months: [
      { value: "01", label: "January" },
      { value: "02", label: "February" },
      { value: "03", label: "March" },
      { value: "04", label: "April" },
      { value: "05", label: "May" },
      { value: "06", label: "June" },
      { value: "07", label: "July" },
      { value: "08", label: "August" },
      { value: "09", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" },
    ],
    voiceMessage: "Voice Message",
    uploadVoiceMessage: "Upload voice message (optional)",
    recordMessage: "Record a message (optional)",
    activeCall: "Active Emergency Call",
    reasonDescriptions: {
      headache: "Sudden or severe head pain",
      nausea: "Feeling sick or vomiting",
      fever: "High body temperature",
      chestPain: "Chest discomfort or pressure",
      difficultyBreathing: "Shortness of breath",
      injury: "Physical injury or trauma",
      other: "Other medical emergency",
    },
    redirect: "Forward",
    acceptCall: "Accept Call",
    yes: "Yes",
    emergencyServiceLogo: "Emergency Service Logo",
  },
  az: {
    emergencyCall: "Ambulans Çağır",
    emergencyRequest: "Təcili Sorğu",
    reason: "Səbəb",
    selectReason: "Səbəb seçin",
    headache: "Baş ağrısı",
    nausea: "Ürək bulanma",
    fever: "Qızdırma",
    chestPain: "Döş ağrısı",
    difficultyBreathing: "Nəfəs çatışmazlığı",
    injury: "Xəsarət",
    other: "Digər",
    whoIsCallFor: "Zəng kim üçündür?",
    forMe: "Mənim üçün",
    forSomeoneElse: "Başqası üçün",
    location: "Yer",
    useCurrentLocation: "Cari yerimi istifadə et",
    selectOnMap: "Xəritədə yer seçin",
    sendRequest: "Sorğu Göndər",
    medicalNotes: "Tibbi Qeydlər",
    enterMedicalNotes: "Tibbi vəziyyətləri və ya simptomları daxil edin",
    sendRequestConfirmation: "Təcili sorğunu göndərmək istədiyinizdən əminsiniz?",
    medicalHistory: "Tibbi Tarixçə",
    enterMedicalHistory: "Tibbi vəziyyətləri və sağlamlıq tarixçənizi daxil edin",
    bloodType: "Qan Qrupu",
    selectBloodType: "Qan qrupunu seçin",
    trackingAmbulance: "Təcili Yardım İzlənməsi",
    ambulanceDispatched: "Təcili Yardım Göndərildi",
    ambulanceEnRoute: "Təcili Yardım Yoldadır",
    ambulanceArriving: "Təcili Yardım Tezliklə Gəlir",
    ambulanceArrived: "Təcili Yardım Çatdı",
    callId: "Zəng ID",
    minutes: "dəq",
    callHistory: "Çağrı Tarixçəsi",
    cancelledCall: "Ləğv Edilib",
    completedCall: "Tamamlanıb",
    noCallsYet: "Hələ təcili zəng yoxdur",
    profile: "Profil",
    personalInformation: "Şəxsi Məlumat",
    firstName: "Ad",
    lastName: "Soyad",
    phoneNumber: "Telefon Nömrəsi",
    dateOfBirth: "Doğum Tarixi",
    day: "Gün",
    month: "Ay",
    year: "İl",
    gender: "Cins",
    selectGender: "Cins seçin",
    male: "Kişi",
    female: "Qadın",
    otherGender: "Digər",
    address: "Ünvan",
    streetAddress: "Küçə Ünvanı",
    enterAddress: "Ünvanınızı daxil edin",
    updateLocation: "Xəritədə Yeri Yenilə",
    appName: "Təcili Yardım",
    emergency: "Təcili Tibbi Yardım",
    emergencyDescription: "Təcili tibbi yardıma ehtiyacınız varsa, aşağıdakı düyməni basın",
    cancelCall: "Çağırışı Ləğv Et",
    cancelCallTitle: "Çağırışı ləğv et?",
    cancelCallConfirmation: "Bu çağırışı ləğv etmək istədiyinizdən əminsiniz?",
    no: "Xeyr",
    yesCancelCall: "Bəli, Ləğv Et",
    saveProfile: "Yadda Saxla",
    logout: "Çıxış",
    months: [
      { value: "01", label: "Yanvar" },
      { value: "02", label: "Fevral" },
      { value: "03", label: "Mart" },
      { value: "04", label: "Aprel" },
      { value: "05", label: "May" },
      { value: "06", label: "İyun" },
      { value: "07", label: "İyul" },
      { value: "08", label: "Avqust" },
      { value: "09", label: "Sentyabr" },
      { value: "10", label: "Oktyabr" },
      { value: "11", label: "Noyabr" },
      { value: "12", label: "Dekabr" },
    ],
    voiceMessage: "Səsli Mesaj",
    uploadVoiceMessage: "Səsli mesaj yüklə (opsional)",
    recordMessage: "Mesaj qeyd et (opsional)",
    activeCall: "Aktiv Təcili Zəng",
    reasonDescriptions: {
      headache: "Kəskin və ya şiddətli baş ağrısı",
      nausea: "Qusma hissi və ya qusma",
      fever: "Yüksək bədən istiliyinin əlaməti",
      chestPain: "Döş nahiyəsində ağrı və ya sıxılma",
      difficultyBreathing: "Nəfəs çatışmazlığı",
      injury: "Cəsədi xəsarət və ya travma",
      other: "Digər tibbi ehtiyat vəziyyəti",
    },
    redirect: "Yönləndir",
    acceptCall: "Çağrışı Qəbul Et",
    yes: "Bəli",
    emergencyServiceLogo: "Təcili Yardım Xidməti Loqosu",
  },
  ru: {
    emergencyCall: "Вызвать Скорую",
    emergencyRequest: "Экстренный Запрос",
    reason: "Причина",
    selectReason: "Выберите причину",
    headache: "Головная боль",
    nausea: "Тошнота",
    fever: "Лихорадка",
    chestPain: "Боль в груди",
    difficultyBreathing: "Затрудненное дыхание",
    injury: "Травма",
    other: "Другое",
    whoIsCallFor: "Для кого вызов?",
    forMe: "Для меня",
    forSomeoneElse: "Для кого-то еще",
    location: "Местоположение",
    useCurrentLocation: "Использовать текущее местоположение",
    selectOnMap: "Выбрать на карте",
    sendRequest: "Отправить Запрос",
    medicalNotes: "Медицинские заметки",
    enterMedicalNotes: "Введите любые медицинские состояния или симптомы",
    sendRequestConfirmation: "Вы уверены, что хотите отправить экстренный запрос?",
    medicalHistory: "Медицинская история",
    enterMedicalHistory: "Введите ваши медицинские состояния и историю здоровья",
    bloodType: "Группа Крови",
    selectBloodType: "Выберите группу крови",
    trackingAmbulance: "Отслеживание Скорой",
    ambulanceDispatched: "Скорая Отправлена",
    ambulanceEnRoute: "Скорая в Пути",
    ambulanceArriving: "Скорая Приближается",
    ambulanceArrived: "Скорая Прибыла",
    callId: "ID вызова",
    minutes: "мин",
    callHistory: "История Вызовов",
    cancelledCall: "Отменён",
    completedCall: "Завершён",
    noCallsYet: "Экстренных вызовов пока нет",
    profile: "Профиль",
    personalInformation: "Личная Информация",
    firstName: "Имя",
    lastName: "Фамилия",
    phoneNumber: "Номер Телефона",
    dateOfBirth: "Дата Рождения",
    day: "День",
    month: "Месяц",
    year: "Год",
    gender: "Пол",
    selectGender: "Выберите пол",
    male: "Мужской",
    female: "Женский",
    otherGender: "Другой",
    address: "Адрес",
    streetAddress: "Улица",
    enterAddress: "Введите ваш адрес",
    updateLocation: "Обновить Местоположение",
    appName: "Скорая Помощь",
    emergency: "Экстренная Медицинская Помощь",
    emergencyDescription: "Если вам нужна экстренная медицинская помощь, нажмите на кнопку ниже",
    cancelCall: "Отменить Вызов",
    cancelCallTitle: "Отменить вызов?",
    cancelCallConfirmation: "Вы уверены, что хотите отменить этот вызов?",
    no: "Нет",
    yesCancelCall: "Да, Отменить",
    saveProfile: "Сохранить",
    logout: "Выйти",
    months: [
      { value: "01", label: "Январь" },
      { value: "02", label: "Февраль" },
      { value: "03", label: "Март" },
      { value: "04", label: "Апрель" },
      { value: "05", label: "Май" },
      { value: "06", label: "Июнь" },
      { value: "07", label: "Июль" },
      { value: "08", label: "Август" },
      { value: "09", label: "Сентябрь" },
      { value: "10", label: "Октябрь" },
      { value: "11", label: "Ноябрь" },
      { value: "12", label: "Декабрь" },
    ],
    voiceMessage: "Голосовое сообщение",
    uploadVoiceMessage: "Загрузить голосовое сообщение (опционально)",
    recordMessage: "Записать сообщение (опционально)",
    activeCall: "Активный Экстренный Вызов",
    reasonDescriptions: {
      headache: "Внезапная или сильная головная боль",
      nausea: "Чувство тошноты или рвота",
      fever: "Высокая температура тела",
      chestPain: "Боль или давление в груди",
      difficultyBreathing: "Одышка или затрудненное дыхание",
      injury: "Физическая травма или повреждение",
      other: "Другая неотложная медицинская ситуация",
    },
    redirect: "Перенаправить",
    acceptCall: "Принять Вызов",
    yes: "Да",
    emergencyServiceLogo: "Логотип Службы Скорой Помощи",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("az")

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

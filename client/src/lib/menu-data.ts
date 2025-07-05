// Menu categories for filtering and display
export const menuCategories = [
  { id: "all", labelKey: "menu.categories.all" },
  { id: "breakfast", labelKey: "menu.categories.breakfast" },
  { id: "drinks", labelKey: "menu.categories.drinks" },
  { id: "juices", labelKey: "menu.categories.juices" },
  { id: "viennoiserie", labelKey: "menu.categories.viennoiserie" },
  { id: "savory", labelKey: "menu.categories.savory" },
  { id: "desserts", labelKey: "menu.categories.desserts" },
];

// Time slots for reservations
export const reservationTimeSlots = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00", "22:00"
];

// Guest count options for reservations
export const guestCountOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "6+" },
];

// Seating preferences
export const seatingPreferences = [
  { value: "", labelKey: "reservation.form.noPreference" },
  { value: "terrasse", labelKey: "reservation.form.terrace" },
  { value: "interieur", labelKey: "reservation.form.interior" },
  { value: "prive", labelKey: "reservation.form.private" },
];

// Event types for custom cakes
export const eventTypes = [
  { value: "mariage", labelKey: "customCakes.form.eventTypes.mariage" },
  { value: "anniversaire", labelKey: "customCakes.form.eventTypes.anniversaire" },
  { value: "entreprise", labelKey: "customCakes.form.eventTypes.entreprise" },
  { value: "bapteme", labelKey: "customCakes.form.eventTypes.bapteme" },
  { value: "autre", labelKey: "customCakes.form.eventTypes.autre" },
];

// Budget ranges for custom cakes
export const budgetRanges = [
  { value: "", labelKey: "customCakes.form.budgetNotDefined" },
  { value: "500-1000", label: "500 - 1000 DH" },
  { value: "1000-2000", label: "1000 - 2000 DH" },
  { value: "2000-5000", label: "2000 - 5000 DH" },
  { value: "5000+", label: "5000+ DH" },
];

// Gallery images for the photo gallery section
export const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    altKey: "gallery.interior",
    category: "interior"
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    altKey: "gallery.terrace",
    category: "terrace"
  },
  {
    src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    altKey: "gallery.cake",
    category: "food"
  },
  {
    src: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    altKey: "gallery.pastries",
    category: "food"
  },
  {
    src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    altKey: "gallery.breakfast",
    category: "food"
  },
  {
    src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    altKey: "gallery.chef",
    category: "team"
  }
];

// Custom cake gallery images
export const customCakeGalleryImages = [
  {
    src: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    alt: "Wedding cake"
  },
  {
    src: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    alt: "Birthday cake"
  },
  {
    src: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    alt: "Corporate cake"
  },
  {
    src: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    alt: "Artistic cake"
  }
];

// Contact information
export const contactInfo = {
  phone: "+212 5 35 62 34 56",
  whatsapp: "+212 635 623 456",
  email: "contact@assouanfes.com",
  address: "4 Avenue Allal Ben Abdellah",
  city: "Fès, Maroc",
  hours: {
    daily: "7h00 - 23h00",
    delivery: "9h00 - 22h00"
  }
};

// Social media links
export const socialMediaLinks = [
  {
    platform: "facebook",
    url: "https://facebook.com/assouanfes",
    icon: "fab fa-facebook-f",
    color: "bg-blue-600 hover:bg-blue-700"
  },
  {
    platform: "instagram",
    url: "https://instagram.com/assouanfes",
    icon: "fab fa-instagram",
    color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
  },
  {
    platform: "twitter",
    url: "https://twitter.com/assouanfes",
    icon: "fab fa-twitter",
    color: "bg-blue-400 hover:bg-blue-500"
  },
  {
    platform: "youtube",
    url: "https://youtube.com/assouanfes",
    icon: "fab fa-youtube",
    color: "bg-red-600 hover:bg-red-700"
  }
];

// Navigation menu items
export const navigationItems = [
  { href: "#home", labelKey: "nav.home" },
  { href: "#menu", labelKey: "nav.menu" },
  { href: "#gallery", labelKey: "nav.gallery" },
  { href: "#about", labelKey: "nav.about" },
  { href: "#contact", labelKey: "nav.contact" },
];

// Supported languages
export const supportedLanguages = [
  { code: "fr", label: "FR", flag: "🇫🇷", name: "Français" },
  { code: "en", label: "EN", flag: "🇬🇧", name: "English" },
  { code: "ar", label: "AR", flag: "🇲🇦", name: "العربية" },
];

// Restaurant features/specialties
export const restaurantFeatures = [
  { iconKey: "fas fa-utensils", labelKey: "about.freshIngredients" },
  { iconKey: "fas fa-certificate", labelKey: "about.authenticity" },
  { iconKey: "fas fa-lightbulb", labelKey: "about.innovation" },
  { iconKey: "fas fa-heart", labelKey: "about.passion" },
];

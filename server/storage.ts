import { 
  menuItems, 
  reservations, 
  customCakeInquiries, 
  contactMessages,
  type MenuItem,
  type InsertMenuItem,
  type Reservation,
  type InsertReservation,
  type CustomCakeInquiry,
  type InsertCustomCakeInquiry,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  
  // Reservations
  getReservations(): Promise<Reservation[]>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservationStatus(id: number, status: string): Promise<Reservation | undefined>;
  
  // Custom Cake Inquiries
  getCustomCakeInquiries(): Promise<CustomCakeInquiry[]>;
  createCustomCakeInquiry(inquiry: InsertCustomCakeInquiry): Promise<CustomCakeInquiry>;
  updateCustomCakeInquiryStatus(id: number, status: string): Promise<CustomCakeInquiry | undefined>;
  
  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessageStatus(id: number, status: string): Promise<ContactMessage | undefined>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<number, MenuItem>;
  private reservations: Map<number, Reservation>;
  private customCakeInquiries: Map<number, CustomCakeInquiry>;
  private contactMessages: Map<number, ContactMessage>;
  private currentMenuId: number;
  private currentReservationId: number;
  private currentInquiryId: number;
  private currentMessageId: number;

  constructor() {
    this.menuItems = new Map();
    this.reservations = new Map();
    this.customCakeInquiries = new Map();
    this.contactMessages = new Map();
    this.currentMenuId = 1;
    this.currentReservationId = 1;
    this.currentInquiryId = 1;
    this.currentMessageId = 1;
    
    // Initialize with sample menu items
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    const sampleMenuItems: InsertMenuItem[] = [
      {
        name: "Petit-Déjeuner Marocain",
        nameEn: "Moroccan Breakfast",
        nameAr: "إفطار مغربي",
        description: "Pain traditionnel, miel, beurre, confiture maison, olives et thé à la menthe",
        descriptionEn: "Traditional bread, honey, butter, homemade jam, olives and mint tea",
        descriptionAr: "خبز تقليدي، عسل، زبدة، مربى منزلي، زيتون وأتاي بالنعناع",
        price: 45,
        category: "breakfast",
        imageUrl: "https://images.unsplash.com/photo-1506459225024-1428097a7e18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        available: true,
        allergens: ["gluten"]
      },
      {
        name: "Croissants Artisanaux",
        nameEn: "Artisanal Croissants",
        nameAr: "كرواسان حرفي",
        description: "Croissants au beurre, pains au chocolat, chaussons aux pommes, préparés quotidiennement",
        descriptionEn: "Butter croissants, chocolate croissants, apple turnovers, prepared daily",
        descriptionAr: "كرواسان بالزبدة، بان أو شوكولا، تشوسون بالتفاح، محضر يومياً",
        price: 15,
        category: "viennoiserie",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        available: true,
        allergens: ["gluten", "dairy"]
      },
      {
        name: "Gâteaux Signature",
        nameEn: "Signature Cakes",
        nameAr: "كعك مميز",
        description: "Gâteau au chocolat, cheesecake, millefeuille, tiramisu - créations du chef pâtissier",
        descriptionEn: "Chocolate cake, cheesecake, millefeuille, tiramisu - pastry chef creations",
        descriptionAr: "كعكة الشوكولاتة، تشيز كيك، ميلفاي، تيراميسو - إبداعات رئيس الحلوانيين",
        price: 50,
        category: "desserts",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        available: true,
        allergens: ["gluten", "dairy", "eggs"]
      },
      {
        name: "Thé à la Menthe",
        nameEn: "Mint Tea",
        nameAr: "أتاي بالنعناع",
        description: "Thé vert traditionnel à la menthe fraîche, servi dans un verre authentique",
        descriptionEn: "Traditional green tea with fresh mint, served in an authentic glass",
        descriptionAr: "شاي أخضر تقليدي بالنعناع الطازج، يقدم في كأس أصيل",
        price: 15,
        category: "drinks",
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        available: true,
        allergens: []
      },
      {
        name: "Jus de Fruits Frais",
        nameEn: "Fresh Fruit Juices",
        nameAr: "عصائر فواكه طازجة",
        description: "Orange, pomme, carotte, avocat, cocktails de fruits de saison pressés minute",
        descriptionEn: "Orange, apple, carrot, avocado, seasonal fruit cocktails freshly pressed",
        descriptionAr: "برتقال، تفاح، جزر، أفوكادو، كوكتيلات فواكه موسمية معصورة طازجة",
        price: 22,
        category: "juices",
        imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        available: true,
        allergens: []
      },
      {
        name: "Tajine du Chef",
        nameEn: "Chef's Tagine",
        nameAr: "طاجين الشيف",
        description: "Tajine aux légumes de saison, agneau ou poulet, épices traditionnelles, servi avec pain",
        descriptionEn: "Seasonal vegetable tagine, lamb or chicken, traditional spices, served with bread",
        descriptionAr: "طاجين بخضار الموسم، خروف أو دجاج، بهارات تقليدية، يقدم مع الخبز",
        price: 85,
        category: "savory",
        imageUrl: "https://images.unsplash.com/photo-1539136788836-5699e78bfc75?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        available: true,
        allergens: ["gluten"]
      }
    ];

    sampleMenuItems.forEach(item => {
      this.createMenuItem(item);
    });
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.category === category);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuId++;
    const item: MenuItem = { 
      ...insertItem, 
      id,
      imageUrl: insertItem.imageUrl || null,
      available: insertItem.available !== undefined ? insertItem.available : true,
      allergens: (insertItem.allergens as string[]) || null
    };
    this.menuItems.set(id, item);
    return item;
  }

  // Reservations
  async getReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = this.currentReservationId++;
    const reservation: Reservation = { 
      ...insertReservation, 
      id, 
      status: "pending",
      createdAt: new Date(),
      email: insertReservation.email || null,
      preference: insertReservation.preference || null,
      notes: insertReservation.notes || null
    };
    this.reservations.set(id, reservation);
    return reservation;
  }

  async updateReservationStatus(id: number, status: string): Promise<Reservation | undefined> {
    const reservation = this.reservations.get(id);
    if (reservation) {
      reservation.status = status;
      this.reservations.set(id, reservation);
      return reservation;
    }
    return undefined;
  }

  // Custom Cake Inquiries
  async getCustomCakeInquiries(): Promise<CustomCakeInquiry[]> {
    return Array.from(this.customCakeInquiries.values());
  }

  async createCustomCakeInquiry(insertInquiry: InsertCustomCakeInquiry): Promise<CustomCakeInquiry> {
    const id = this.currentInquiryId++;
    const inquiry: CustomCakeInquiry = { 
      ...insertInquiry, 
      id, 
      status: "pending",
      createdAt: new Date(),
      email: insertInquiry.email || null,
      budget: insertInquiry.budget || null,
      inspirationPhotos: (insertInquiry.inspirationPhotos as string[]) || null
    };
    this.customCakeInquiries.set(id, inquiry);
    return inquiry;
  }

  async updateCustomCakeInquiryStatus(id: number, status: string): Promise<CustomCakeInquiry | undefined> {
    const inquiry = this.customCakeInquiries.get(id);
    if (inquiry) {
      inquiry.status = status;
      this.customCakeInquiries.set(id, inquiry);
      return inquiry;
    }
    return undefined;
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentMessageId++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      status: "unread",
      createdAt: new Date(),
      phone: insertMessage.phone || null
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async updateContactMessageStatus(id: number, status: string): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (message) {
      message.status = status;
      this.contactMessages.set(id, message);
      return message;
    }
    return undefined;
  }
}

export const storage = new MemStorage();

export interface IOrderChart {
  count: number;
  status:
    | 'waiting'
    | 'ready'
    | 'on the way'
    | 'delivered'
    | 'could not be delivered';
}

export interface IOrderTotalCount {
  total: number;
  totalDelivered: number;
}

export interface ISalesChart {
  date: string;
  title: 'Order Count' | 'Order Amount';
  value: number;
}

export interface IOrderStatus {
  id: number;
  text: 'Pending' | 'Ready' | 'On The Way' | 'Delivered' | 'Cancelled';
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  gsm: string;
  createdAt: string;
  isActive: boolean;
  avatar: IFile[];
  addresses: IAddress[];
}

export interface IIdentity {
  id: string;
  email: string;
  name: string;
  roleName: string;
  avatar: string;
}

export interface IAddress {
  text: string;
  coordinate?: [string | number, string | number];
  latitude: number;
  longitude: number;
}

export interface IFile {
  lastModified?: number;
  name: string;
  percent?: number;
  size: number;
  status?: 'error' | 'success' | 'done' | 'uploading' | 'removed';
  type: string;
  uid?: string;
  url: string;
}

export interface IEvent {
  date: string;
  status: string;
}

export interface IStore {
   id: number;
  id_almacen: string;
  name: string;
  address: IAddress;
  latitude: number;
  longitude: number;
  cityId: number;
  city: City;
  capacity: number;
  zipCode: number;
  status: statusStore;
  createdAt: Date;
  updatedAt: Date;
  products?: IProduct[];
}

export interface IOrder {
  id: number;
  user: IUser;
  createdAt: string;
  products: IProduct[];
  status: IOrderStatus;
  address: IAddress;
  store: any;
  courier: ICourier;
  events: IEvent[];
  orderNumber: number;
  subtotal: number;
  deliveryDate?: Date
  // address?: IAddress;
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  // images: (IFile & { thumbnailUrl?: string })[];
  createdAt: string;
  // price: number;
  categoryId: number;
  // stock: number;

  // Nuevos campos
  imageUrl: string; // URL de la imagen del producto
  weight: number; // en kilogramos
  dimensionsCm: string; // formato sugerido: "30x20x10"
  dateOfExpiration: string; // formato ISO (YYYY-MM-DD)
  requiredRefrigeration: boolean;
  isFragile: boolean;
  barCode: string;
  status: string;
  unitPrice: number;
  images?: {url: string, name: string}[]
}

export interface ICategory {
  id: number;
  name: string;
  description: string;
  isActive?: boolean;
}

export interface IOrderFilterVariables {
  q?: string;
  store?: string;
  user?: string;
  status?: string[];
}

export interface IUserFilterVariables {
  q: string;
  status: boolean;
  gender: string;
  isActive: boolean | string;
}

export interface ICourierStatus {
  id: number;
  text: 'Available' | 'Offline' | 'On delivery';
}

export interface ICourier {
  id: number;
  name: string;
  // surname: string;
  email: string;
  gender: string;
  phone: string;
  createdAt: string;
  accountNumber: string;
  // licensePlate: string;
  latitude: number;
  longitude: number;
  address: IAddress;
  // avatar: IFile[];
  gsm?: string;
  store: IStore;
  status: ICourierStatus;
  vehicle: IVehicle;
}

export interface IReview {
  id: number;
  order: IOrder;
  user: IUser;
  star: number;
  createDate: string;
  status: 'pending' | 'approved' | 'rejected';
  comment: string[];
}

export interface ITrendingProducts {
  id: number;
  product: IProduct;
  orderCount: number;
}

export type IVehicle = {
  model: string;
  vehicleType: string;
  engineSize: number;
  color: string;
  year: number;
  id: number;
};

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export interface IAvaliableProducts {
  storeId: number;
  storeName: string;
  storeAddress: string;
  storeLatitude: number;
  storeLongitude: number;
  productId: number;
  productName: string;
  productDescription: string;
  unitPrice: number;
  imageUrl: string;
  categoryName: string;
  categoryId: number;
  availableQuantity: number;
}

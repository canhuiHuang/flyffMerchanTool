export interface Merch {
  id: string;
  description: any;
  itemName: any;
  price: any;
  amount: any;
  date: any;
  unlisted?: boolean;
}

export interface Item {
  id: string;
  name?: string;
  description?: string;
  goalPrice?: number;
  [propName: string]: any;
}

export interface Items {
  [propName: string]: Item;
}

export interface Inventory {
  merchIn: Array<Merch>;
  merchOut: Array<Merch>;
  items: Array<Item>;
}

export interface InventoryItem {
  name: string;
  description?: string;
  purchased: number;
  sold: number;
  spent: number;
  sales: number;
  freeMerchAmount: number;
  goalPrice?: number;
}

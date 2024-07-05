export interface Merch {
  description: any;
  itemName: any;
  price: any;
  amount: any;
  date: any;
}

export interface Item {
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

interface IOrder {
  id: number;
  name: string;
  address: string;
  mobilePhone: string;
  dateX: Date;
  date: string;
  timeFrom: string;
  timeTo: string;
  problem: string;
  comment: string;
  user: IUser;
  userDetails?: IUser;
  lat: number;
  lng: number;
  isVisible: boolean;
  color: string;
  currentPlace?: {lat: number, lng: number};
}

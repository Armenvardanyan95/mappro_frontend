interface IOrder {
  id: number;
  name: string;
  address: string;
  mobilePhone: string;
  mobilePhones: string[];
  dateX: Date;
  date: any;
  timeFrom: string;
  timeTo: string;
  problem: string;
  comment: string;
  user: IUser;
  userDetails?: IUser;
  lat: number;
  lng: number;
  isVisible: boolean;
  isSelected: boolean;
  isArchived: boolean;
  color: string;
  rank: number;
  notArchivedRank: number;
  created: string;
  colorMarkerDetails: {image: string, color: string, id: number};
  currentPlace?: {lat: number, lng: number};
}

import { GUID } from "../utility/guid";


export interface IFormRouteInfo {
	initiator: string,
	route: GUID;
	routeBack: string;
	routeBackId: GUID;
	level: number;
	payload?: any;
  }

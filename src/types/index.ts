export enum FreightStatus {
  PENDING = 'pending',
  DISPATCHED = 'dispatched',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered'
}

export const STATUS_LABEL: Record<FreightStatus, string> = {
  [FreightStatus.PENDING]: '待调度',
  [FreightStatus.DISPATCHED]: '已调度',
  [FreightStatus.IN_TRANSIT]: '运输中',
  [FreightStatus.DELIVERED]: '已送达'
};

export const STATUS_FLOW: Record<FreightStatus, FreightStatus | null> = {
  [FreightStatus.PENDING]: FreightStatus.DISPATCHED,
  [FreightStatus.DISPATCHED]: FreightStatus.IN_TRANSIT,
  [FreightStatus.IN_TRANSIT]: FreightStatus.DELIVERED,
  [FreightStatus.DELIVERED]: null
};

export const STATUS_ACTION_LABEL: Record<FreightStatus, string> = {
  [FreightStatus.PENDING]: '调度',
  [FreightStatus.DISPATCHED]: '开始运输',
  [FreightStatus.IN_TRANSIT]: '确认送达',
  [FreightStatus.DELIVERED]: '已完成'
};

export const ALL_STATUSES: FreightStatus[] = [
  FreightStatus.PENDING,
  FreightStatus.DISPATCHED,
  FreightStatus.IN_TRANSIT,
  FreightStatus.DELIVERED
];

export interface StatusLog {
  id: string;
  status: FreightStatus;
  time: string;
  remark?: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  capacity: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
}

export interface FreightOrder {
  id: string;
  orderNo: string;
  customer: string;
  origin: string;
  destination: string;
  cargoName: string;
  cargoWeight: number;
  vehicleId?: string;
  driverId?: string;
  plannedPickupTime: string;
  plannedArrivalTime: string;
  status: FreightStatus;
  estimatedFee: number;
  actualFee?: number;
  statusLogs: StatusLog[];
  createdAt: string;
  updatedAt: string;
}

export interface FreightFormData {
  customer: string;
  origin: string;
  destination: string;
  cargoName: string;
  cargoWeight: number | '';
  plannedPickupTime: string;
  plannedArrivalTime: string;
  estimatedFee: number | '';
}

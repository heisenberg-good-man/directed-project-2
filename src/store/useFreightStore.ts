import { create } from 'zustand';
import { Driver, FreightFormData, FreightOrder, FreightStatus, STATUS_FLOW, Vehicle } from '@/types';
import { generateId, generateOrderNo, storage } from '@/utils/storage';
import { mockDrivers, mockOrders, mockVehicles } from '@/utils/mock';

interface FreightState {
  orders: FreightOrder[];
  vehicles: Vehicle[];
  drivers: Driver[];
  initialized: boolean;

  init: () => void;
  getOrderById: (id: string) => FreightOrder | undefined;
  getVehicleById: (id?: string) => Vehicle | undefined;
  getDriverById: (id?: string) => Driver | undefined;
  createOrder: (data: FreightFormData) => FreightOrder;
  updateOrder: (id: string, data: FreightFormData) => void;
  deleteOrder: (id: string) => void;
  dispatchOrder: (id: string, vehicleId: string, driverId: string) => void;
  advanceStatus: (id: string) => void;
  searchOrders: (keyword: string, status?: FreightStatus | '') => FreightOrder[];
  getStatusCounts: () => Record<FreightStatus, number>;
}

export const useFreightStore = create<FreightState>((set, get) => ({
  orders: [],
  vehicles: [],
  drivers: [],
  initialized: false,

  init() {
    if (get().initialized) return;

    const orders = storage.get<FreightOrder[]>('orders', mockOrders);
    const vehicles = storage.get<Vehicle[]>('vehicles', mockVehicles);
    const drivers = storage.get<Driver[]>('drivers', mockDrivers);

    set({ orders, vehicles, drivers, initialized: true });
  },

  getOrderById(id) {
    return get().orders.find(o => o.id === id);
  },

  getVehicleById(id) {
    if (!id) return undefined;
    return get().vehicles.find(v => v.id === id);
  },

  getDriverById(id) {
    if (!id) return undefined;
    return get().drivers.find(d => d.id === id);
  },

  createOrder(data) {
    const now = new Date().toISOString();
    const newOrder: FreightOrder = {
      id: generateId(),
      orderNo: generateOrderNo(),
      customer: data.customer,
      origin: data.origin,
      destination: data.destination,
      cargoName: data.cargoName,
      cargoWeight: Number(data.cargoWeight),
      plannedPickupTime: data.plannedPickupTime,
      plannedArrivalTime: data.plannedArrivalTime,
      status: FreightStatus.PENDING,
      estimatedFee: Number(data.estimatedFee),
      statusLogs: [
        {
          id: generateId(),
          status: FreightStatus.PENDING,
          time: now,
          remark: '创建运单'
        }
      ],
      createdAt: now,
      updatedAt: now
    };
    const orders = [newOrder, ...get().orders];
    set({ orders });
    storage.set('orders', orders);
    return newOrder;
  },

  updateOrder(id, data) {
    const now = new Date().toISOString();
    const orders = get().orders.map(o =>
      o.id === id
        ? {
            ...o,
            customer: data.customer,
            origin: data.origin,
            destination: data.destination,
            cargoName: data.cargoName,
            cargoWeight: Number(data.cargoWeight),
            plannedPickupTime: data.plannedPickupTime,
            plannedArrivalTime: data.plannedArrivalTime,
            estimatedFee: Number(data.estimatedFee),
            updatedAt: now
          }
        : o
    );
    set({ orders });
    storage.set('orders', orders);
  },

  deleteOrder(id) {
    const orders = get().orders.filter(o => o.id !== id);
    set({ orders });
    storage.set('orders', orders);
  },

  dispatchOrder(id, vehicleId, driverId) {
    const now = new Date().toISOString();
    const orders = get().orders.map(o => {
      if (o.id !== id) return o;
      const vehicle = get().getVehicleById(vehicleId);
      const driver = get().getDriverById(driverId);
      return {
        ...o,
        vehicleId,
        driverId,
        status: FreightStatus.DISPATCHED,
        statusLogs: [
          ...o.statusLogs,
          {
            id: generateId(),
            status: FreightStatus.DISPATCHED,
            time: now,
            remark: `分配车辆${vehicle?.plateNumber || ''}、司机${driver?.name || ''}`
          }
        ],
        updatedAt: now
      };
    });
    set({ orders });
    storage.set('orders', orders);
  },

  advanceStatus(id) {
    const now = new Date().toISOString();
    const orders = get().orders.map(o => {
      if (o.id !== id) return o;
      const nextStatus = STATUS_FLOW[o.status];
      if (!nextStatus) return o;
      const remarkMap: Record<FreightStatus, string> = {
        [FreightStatus.PENDING]: '',
        [FreightStatus.DISPATCHED]: '',
        [FreightStatus.IN_TRANSIT]: '车辆已出发',
        [FreightStatus.DELIVERED]: '货物已送达并签收'
      };
      return {
        ...o,
        status: nextStatus,
        actualFee: nextStatus === FreightStatus.DELIVERED ? o.estimatedFee : o.actualFee,
        statusLogs: [
          ...o.statusLogs,
          {
            id: generateId(),
            status: nextStatus,
            time: now,
            remark: remarkMap[nextStatus] || '状态变更'
          }
        ],
        updatedAt: now
      };
    });
    set({ orders });
    storage.set('orders', orders);
  },

  searchOrders(keyword, status) {
    let result = get().orders;
    if (status) {
      result = result.filter(o => o.status === status);
    }
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      result = result.filter(
        o =>
          o.orderNo.toLowerCase().includes(kw) ||
          o.customer.toLowerCase().includes(kw) ||
          o.cargoName.toLowerCase().includes(kw) ||
          o.origin.toLowerCase().includes(kw) ||
          o.destination.toLowerCase().includes(kw)
      );
    }
    return result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  getStatusCounts() {
    const counts: Record<FreightStatus, number> = {
      [FreightStatus.PENDING]: 0,
      [FreightStatus.DISPATCHED]: 0,
      [FreightStatus.IN_TRANSIT]: 0,
      [FreightStatus.DELIVERED]: 0
    };
    get().orders.forEach(o => {
      counts[o.status]++;
    });
    return counts;
  }
}));

import { Driver, FreightOrder, FreightStatus, Vehicle } from '@/types';

export const mockVehicles: Vehicle[] = [
  { id: 'v1', plateNumber: '粤B·A12345', model: '东风天龙', capacity: 20 },
  { id: 'v2', plateNumber: '粤B·B67890', model: '解放J6P', capacity: 18 },
  { id: 'v3', plateNumber: '粤B·C54321', model: '重汽豪沃', capacity: 25 },
  { id: 'v4', plateNumber: '粤B·D09876', model: '福田欧曼', capacity: 15 },
  { id: 'v5', plateNumber: '粤B·E13579', model: '陕汽德龙', capacity: 22 }
];

export const mockDrivers: Driver[] = [
  { id: 'd1', name: '张建国', phone: '13800138001' },
  { id: 'd2', name: '李德胜', phone: '13800138002' },
  { id: 'd3', name: '王志强', phone: '13800138003' },
  { id: 'd4', name: '刘振华', phone: '13800138004' },
  { id: 'd5', name: '陈大勇', phone: '13800138005' }
];

const now = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

export const mockOrders: FreightOrder[] = [
  {
    id: 'o1',
    orderNo: 'FY202606011001',
    customer: '深圳市恒通电子有限公司',
    origin: '深圳市南山区科技园',
    destination: '广州市白云区物流园',
    cargoName: '电子元器件',
    cargoWeight: 8.5,
    vehicleId: 'v1',
    driverId: 'd1',
    plannedPickupTime: new Date(now - 2 * dayMs).toISOString(),
    plannedArrivalTime: new Date(now - 1 * dayMs).toISOString(),
    status: FreightStatus.DELIVERED,
    estimatedFee: 2800,
    actualFee: 2850,
    statusLogs: [
      { id: 's1', status: FreightStatus.PENDING, time: new Date(now - 3 * dayMs).toISOString(), remark: '创建运单' },
      { id: 's2', status: FreightStatus.DISPATCHED, time: new Date(now - 2.5 * dayMs).toISOString(), remark: '分配车辆粤B·A12345、司机张建国' },
      { id: 's3', status: FreightStatus.IN_TRANSIT, time: new Date(now - 2 * dayMs).toISOString(), remark: '车辆已出发' },
      { id: 's4', status: FreightStatus.DELIVERED, time: new Date(now - 1 * dayMs).toISOString(), remark: '货物已送达并签收' }
    ],
    createdAt: new Date(now - 3 * dayMs).toISOString(),
    updatedAt: new Date(now - 1 * dayMs).toISOString()
  },
  {
    id: 'o2',
    orderNo: 'FY202606052002',
    customer: '东莞鑫达机械制造',
    origin: '东莞市长安镇工业园',
    destination: '深圳市龙岗区坪山街道',
    cargoName: '机械设备',
    cargoWeight: 15.2,
    vehicleId: 'v2',
    driverId: 'd2',
    plannedPickupTime: new Date(now).toISOString(),
    plannedArrivalTime: new Date(now + 1 * dayMs).toISOString(),
    status: FreightStatus.IN_TRANSIT,
    estimatedFee: 3500,
    statusLogs: [
      { id: 's5', status: FreightStatus.PENDING, time: new Date(now - 1 * dayMs).toISOString(), remark: '创建运单' },
      { id: 's6', status: FreightStatus.DISPATCHED, time: new Date(now - 0.5 * dayMs).toISOString(), remark: '分配车辆粤B·B67890、司机李德胜' },
      { id: 's7', status: FreightStatus.IN_TRANSIT, time: new Date(now - 1 * 60 * 60 * 1000).toISOString(), remark: '车辆已出发' }
    ],
    createdAt: new Date(now - 1 * dayMs).toISOString(),
    updatedAt: new Date(now - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'o3',
    orderNo: 'FY202606073003',
    customer: '佛山顺达建材贸易',
    origin: '佛山市顺德区乐从镇',
    destination: '珠海市香洲区',
    cargoName: '建材瓷砖',
    cargoWeight: 12,
    vehicleId: 'v3',
    driverId: 'd3',
    plannedPickupTime: new Date(now + 0.5 * dayMs).toISOString(),
    plannedArrivalTime: new Date(now + 1.5 * dayMs).toISOString(),
    status: FreightStatus.DISPATCHED,
    estimatedFee: 4200,
    statusLogs: [
      { id: 's8', status: FreightStatus.PENDING, time: new Date(now - 0.5 * dayMs).toISOString(), remark: '创建运单' },
      { id: 's9', status: FreightStatus.DISPATCHED, time: new Date(now - 2 * 60 * 60 * 1000).toISOString(), remark: '分配车辆粤B·C54321、司机王志强' }
    ],
    createdAt: new Date(now - 0.5 * dayMs).toISOString(),
    updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'o4',
    orderNo: 'FY202606084004',
    customer: '广州华南食品批发',
    origin: '广州市番禺区',
    destination: '深圳市宝安区福永街道',
    cargoName: '食品饮料',
    cargoWeight: 6,
    plannedPickupTime: new Date(now + 1 * dayMs).toISOString(),
    plannedArrivalTime: new Date(now + 2 * dayMs).toISOString(),
    status: FreightStatus.PENDING,
    estimatedFee: 1800,
    statusLogs: [
      { id: 's10', status: FreightStatus.PENDING, time: new Date(now - 30 * 60 * 1000).toISOString(), remark: '创建运单' }
    ],
    createdAt: new Date(now - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'o5',
    orderNo: 'FY202606085005',
    customer: '惠州汇通服装有限公司',
    origin: '惠州市惠城区',
    destination: '东莞市虎门镇',
    cargoName: '服装纺织品',
    cargoWeight: 4.5,
    plannedPickupTime: new Date(now + 0.8 * dayMs).toISOString(),
    plannedArrivalTime: new Date(now + 1.2 * dayMs).toISOString(),
    status: FreightStatus.PENDING,
    estimatedFee: 1500,
    statusLogs: [
      { id: 's11', status: FreightStatus.PENDING, time: new Date(now - 10 * 60 * 1000).toISOString(), remark: '创建运单' }
    ],
    createdAt: new Date(now - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 10 * 60 * 1000).toISOString()
  }
];

import {
  LargeBoxy,
  LargeFlat,
  LargeLow,
  LargeTanker,
} from "@/components/models/large-truck";
import {
  MediumBoxy,
  MediumLow,
  MediumTanker,
  MediumFlat,
} from "@/components/models/medium-truck";
import {
  SmallBoxy,
  SmallFlat,
  SmallLow,
} from "@/components/models/small-truck";
import Bus from "@/components/models/bus";
import { CarTrailerBox, CarTrailerLow } from "@/components/models/car-trailer";

const TrailersTypes = [
  {
    id: "large_box",
    name: "Naczepa plandeka",
    size: [2.5, 2.7, 13.6],
    model: LargeBoxy,
    icon: "/vehicles/large-box.svg",
  },
  {
    id: "large_low",
    name: "Naczepa burtowa",
    size: [2.5, 0.5, 13.6],
    model: LargeLow,
    icon: "/vehicles/large-low.svg",
  },
  {
    id: "large_tanker",
    name: "Naczepa cysterna",
    size: [13.6, 1, 2.5],
    model: LargeTanker,
    icon: "/vehicles/large-tanker.svg",
  },
  {
    id: "large_flat",
    name: "Naczepa płaska",
    size: [2.5, 0.1, 13.6],
    model: LargeFlat,
    icon: "/vehicles/large-flat.svg",
  },
];

const MediumTypes = [
  {
    id: "medium_box",
    name: "Dostawczy od 12t - plandeka",
    size: [2.5, 2.7, 6.6],
    model: MediumBoxy,
    icon: "/vehicles/medium-box.svg",
  },
  {
    id: "medium_low",
    name: "Dostawczy od 12t - burtowa",
    size: [2.5, 0.5, 6.6],
    model: MediumLow,
    icon: "/vehicles/medium-low.svg",
  },
  {
    id: "medium_tanker",
    name: "Dostawczy od 12t - cysterna",
    size: [2.5, 1, 6.6],
    model: MediumTanker,
    icon: "/vehicles/medium-tanker.svg",
  },
  {
    id: "medium_flat",
    name: "Dostawczy od 12t - płaska",
    size: [2.5, 0.1, 6.6],
    model: MediumFlat,
    icon: "/vehicles/medium-flat.svg",
  },
];

const SmallTypes = [
  {
    id: "small_box",
    name: "Dostawczy do 12t - plandeka",
    size: [2.1, 2.4, 3.5],
    model: SmallBoxy,
    icon: "/vehicles/small-box.svg",
  },
  {
    id: "small_low",
    name: "Dostawczy do 12t - burtowa",
    size: [2.1, 0.5, 3.5],
    model: SmallLow,
    icon: "/vehicles/small-low.svg",
  },
  {
    id: "small_flat",
    name: "Dostawczy do 12t - płaska",
    size: [2.1, 0.1, 3.5],
    model: SmallFlat,
    icon: "/vehicles/small-flat.svg",
  },
];

const BusTypes = [
  {
    id: "bus",
    name: "Dostawczy do 3.5t - bus",
    size: [2.1, 1.8, 3.5],
    model: Bus,
    icon: "/vehicles/bus.svg",
  },
];

const CarTrailerTypes = [
  {
    id: "car_trailer_box",
    name: "Przyczepka samochodowa - plandeka",
    size: [1.8, 2, 2.8],
    model: CarTrailerBox,
    icon: "/vehicles/car-trailer-box.svg",
  },
  {
    id: "car_trailer_low",
    name: "Przyczepka samochodowa - burtowa",
    size: [1.8, 0.5, 2.5],
    model: CarTrailerLow,
    icon: "/vehicles/car-trailer-low.svg",
  },
];

export const VehicleNames = {
  car_trailer_box: "Przyczepka samochodowa - plandeka",
  car_trailer_low: "Przyczepka samochodowa - burtowa",
  small_box: "Dostawczy do 12t - plandeka",
  small_low: "Dostawczy do 12t - burtowa",
  small_flat: "Dostawczy do 12t - płaska",
  medium_box: "Dostawczy od 12t - plandeka",
  medium_low: "Dostawczy od 12t - burtowa",
  medium_tanker: "Dostawczy od 12t - cysterna",
  medium_flat: "Dostawczy od 12t - płaska",
  large_box: "Naczepa plandeka",
  large_low: "Naczepa burtowa",
  large_tanker: "Naczepa cysterna",
  large_flat: "Naczepa płaska",
  bus: "Dostawczy do 3.5t - bus",
};

export const VehicleIcons = {
  car_trailer_box: "/vehicles/car-trailer-box.svg",
  car_trailer_low: "/vehicles/car-trailer-low.svg",
  small_box: "/vehicles/small-box.svg",
  small_low: "/vehicles/small-low.svg",
  small_flat: "/vehicles/small-flat.svg",
  medium_box: "/vehicles/medium-box.svg",
  medium_low: "/vehicles/medium-low.svg",
  medium_tanker: "/vehicles/medium-tanker.svg",
  medium_flat: "/vehicles/medium-flat.svg",
  large_box: "/vehicles/large-box.svg",
  large_low: "/vehicles/large-low.svg",
  large_tanker: "/vehicles/large-tanker.svg",
  large_flat: "/vehicles/large-flat.svg",
  bus: "/vehicles/bus.svg",
};

export type VehiclesTableType = {
  id: string;
  name: string;
  width: number;
  height: number;
  length: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  type: string;
  place_address: string;
  place_lat: number;
  place_lng: number;
};

export const VehicleModels = [
  ...TrailersTypes,
  ...MediumTypes,
  ...SmallTypes,
  ...BusTypes,
  ...CarTrailerTypes,
];

const Vehicles = {
  trailers: TrailersTypes,
  medium: MediumTypes,
  small: SmallTypes,
  bus: BusTypes,
  carTrailer: CarTrailerTypes,
};

export type Vehicle = typeof Vehicles;

export default Vehicles;

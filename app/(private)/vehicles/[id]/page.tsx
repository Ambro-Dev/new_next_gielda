import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GoBack from "@/components/ui/go-back";
import { Separator } from "@/components/ui/separator";
import { axiosInstance } from "@/lib/axios";
import { VehiclesTableType } from "@/lib/types/vehicles";
import { User2 } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

import { VehicleIcons } from "@/lib/types/vehicles";
import VehicleMap from "./vehicle-map";
import { VehicleVizualization } from "@/components/VehicleVisualization";
import { VehicleModels } from "@/lib/types/vehicles";
import SendMessage from "./send-message";

type Props = {
  params: {
    id: string;
  };
};

const getVihicle = async (
  id: string
): Promise<
  VehiclesTableType & {
    user: {
      id: string;
      username: string;
      name: string;
      surname: string;
      school?: string;
      phoneNumber?: string | number;
    };
    allVehicles: number;
    allTransports: number;
  }
> => {
  try {
    const response = await axiosInstance.get(`api/vehicles/info?id=${id}`);
    return response.data;
  } catch (error) {
    notFound();
  }
};

const Page = async (props: Props) => {
  const vehicleId = props.params.id;

  const vehicle = await getVihicle(vehicleId);

  const vehicleData = Object.values(VehicleModels).find(
    (item) => item.id === vehicle.type
  );

  return (
    <div className="p-5 space-y-4">
      <GoBack className="bg-white drop-shadow-lg" />
      <div>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
          <Card className="p-3 space-y-3 drop-shadow-lg">
            <div className="grid grid-cols-3">
              <div className="flex justify-center">
                <Avatar className="w-16 h-16 border-[1px] drop-shadow-sm">
                  <AvatarFallback>
                    <User2 className="w-10 h-10" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="col-span-2 py-3 flex justify-center flex-col">
                <CardTitle className="text-xl">
                  {vehicle.user.name} {vehicle.user.surname}
                </CardTitle>
                <CardContent className="text-sm">
                  {vehicle.user.school}
                </CardContent>
                <div className="flex space-x-2 justify-center">
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-sm">Pojazdy</span>
                    <span className="font-semibold">{vehicle.allVehicles}</span>
                  </div>
                  <div>
                    <Separator orientation="vertical" />
                  </div>

                  <div className="flex flex-col justify-center items-center">
                    <span className="text-sm">Transporty</span>
                    <span className="font-semibold">
                      {vehicle.allTransports || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <CardFooter className="flex flex-col space-y-4">
              <span className="text-sm text-center">
                Możesz wysłać wiadomość do właściciela pojazdu, aby skontaktować
                się z nim w sprawie transportu.
              </span>
              <SendMessage userId={vehicle.user.id} vehicleId={vehicleId} />
            </CardFooter>
          </Card>
          <Card className="p-3 space-y-3 drop-shadow-lg">
            <CardTitle className="py-0 flex justify-center">
              <Image
                src={VehicleIcons[vehicle.type as keyof typeof VehicleIcons]}
                width={150}
                height={100}
                alt={vehicle.type}
              />
            </CardTitle>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between gap-2 items-center">
                  <span className="text-sm">Typ pojazdu:</span>
                  <span className="font-semibold text-sm text-end">
                    {vehicle.name}
                  </span>
                </div>
                <div className="flex justify-between gap-2 items-center">
                  <span className="text-sm">Miejscowość:</span>
                  <span className="font-semibold text-sm text-end">
                    {vehicle.place_address}
                  </span>
                </div>
                <div className="flex justify-between gap-2 items-center">
                  <span className="text-sm">Wymiary:</span>
                  <span className="font-semibold text-sm text-end">
                    {vehicle.width}m x {vehicle.height}m x {vehicle.length}m
                  </span>
                </div>
                {vehicle.type.includes("tanker") ? (
                  <>
                    <div className="flex justify-between gap-2 items-center">
                      <span className="text-sm">Promień cysterny:</span>
                      <span className="font-semibold text-sm text-end">
                        {vehicle.height / 2} m
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 items-center">
                      <span className="text-sm">Objętość:</span>
                      <span className="font-semibold text-sm text-end">
                        {Math.round(
                          Math.PI *
                            ((vehicle.width / 2) * (vehicle.width / 2)) *
                            vehicle.length *
                            1000
                        )}{" "}
                        l
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between gap-2 items-center">
                      <span className="text-sm">Powierzchnia:</span>
                      <span className="font-semibold text-sm text-end">
                        {Math.round(vehicle.width * vehicle.length)} m2
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 items-center">
                      <span className="text-sm">Pojemność:</span>
                      <span className="font-semibold text-sm text-end">
                        {Math.round(
                          vehicle.width * vehicle.length * vehicle.height
                        )}{" "}
                        m3
                      </span>
                    </div>
                  </>
                )}
                {vehicle.type.includes("flat") ||
                  (vehicle.type.includes("low") && (
                    <div className="flex justify-between gap-2 items-center">
                      <span className="text-sm">Powierzchnia:</span>
                      <span className="font-semibold text-sm text-end">
                        {Math.round(vehicle.width * vehicle.length)} m2
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 lg:row-span-2 drop-shadow-lg sm:max-h-[500px] max-h-[300px]">
            <VehicleVizualization
              VehicleModel={vehicleData!.model}
              vehicleSize={[
                vehicle.type.includes("tanker")
                  ? vehicle.length
                  : vehicle.width,
                vehicle.type.includes("tanker")
                  ? vehicle.height / 2
                  : vehicle.height,
                vehicle.type === "medium_tanker"
                  ? vehicle.length
                  : vehicle.type.includes("tanker")
                  ? vehicle.height / 2
                  : vehicle.length,
              ]}
              vehicleType={vehicle.type}
            />
          </Card>
          <Card className="lg:col-span-2 md:row-span-2 drop-shadow-lg order-last sm:order-none">
            <VehicleMap
              point={{
                lat: vehicle.place_lat,
                lng: vehicle.place_lng,
              }}
            />
          </Card>
          <Card className="p-3 space-y-3 lg:col-span-2 drop-shadow-lg">
            <CardTitle className="text-xl px-3">Opis pojazdu</CardTitle>
            <CardContent>
              <span className="font-semibold text-sm">
                {vehicle.description}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;

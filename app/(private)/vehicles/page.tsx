import { columns } from "./columns";
import { DataTable } from "./data-table";
import { VehiclesTableType } from "@/lib/types/vehicles";
import { axiosInstance } from "@/lib/axios";
import { Card } from "@/components/ui/card";
import GoBack from "@/components/ui/go-back";

async function getData(): Promise<VehiclesTableType[]> {
  try {
    const res = await axiosInstance.get("api/vehicles");
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Page() {
  const data = await getData();

  return (
    <Card className="mb-5">
      <GoBack className="m-6" />
      <div className="container mx-auto pb-10">
        <DataTable columns={columns} data={data} />
      </div>
    </Card>
  );
}

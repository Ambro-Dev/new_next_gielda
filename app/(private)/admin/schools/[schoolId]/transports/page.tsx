import { RecentTransports } from "@/components/dashboard/recent-transports";
import { axiosInstance } from "@/lib/axios";
import React from "react";
import { TransportsTable } from "./transports-table";
import { columns } from "./colums";

type Transport = {
  id: string;
  description: string;
  createdAt: Date;
  vehicle: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    username: string;
  };
  _count: {
    objects: number;
  };
};

type Props = {
  params: {
    schoolId: string;
  };
};

const getSchoolTransports = async (schoolId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/schools/school/transports?schoolId=${schoolId}`
    );
    const data = response.data;
    return data.transports;
  } catch (error) {}
};

const SchoolTransports = async (props: Props) => {
  const transportsData = await getSchoolTransports(
    String(props.params.schoolId)
  );

  const transports = await transportsData.map((transport: Transport) => {
    const formatedDate = new Date(transport.createdAt).toLocaleDateString(
      "pl-PL"
    );
    return {
      id: transport.id,
      vehicle: transport.vehicle.name,
      category: transport.category.name,
      creator: transport.creator.username,
      objects: transport._count.objects,
      createdAt: formatedDate,
    };
  });

  return (
    <TransportsTable
      columns={columns}
      transports={transports}
      school={props.params.schoolId}
    />
  );
};

export default SchoolTransports;

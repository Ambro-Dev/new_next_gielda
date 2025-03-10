import React from "react";
import { StudentsTable } from "./students-table";
import { columns } from "./columns";
import { axiosInstance } from "@/lib/axios";
import { AddStudentForm } from "./add-student-form";

interface PageProps {
  params: {
    schoolId: string;
  };
}

async function getStudents(schoolId: string) {
  try {
    const res = await axiosInstance.get(
      `/api/schools/students?schoolId=${schoolId}`
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const Students = async (props: PageProps) => {
  const data = await getStudents(props.params.schoolId);
  return (
    <div>
      <StudentsTable
        columns={columns}
        data={data}
        schoolId={props.params.schoolId}
      />
      <div className="w-full px-10 pb-10">
        <AddStudentForm schoolId={props.params.schoolId} />
      </div>
    </div>
  );
};

export default Students;

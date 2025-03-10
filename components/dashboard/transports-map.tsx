import { Transport } from "@/app/(private)/transport/page";
import CardWithMap from "@/components/CardWithMap";
import React from "react";

const TransportsMap = ({ transports }: { transports: Transport[] }) => {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-8 lg:w-4/5 w-full">
      {transports &&
        transports.map((item) => {
          return <CardWithMap key={item.id} transport={item} />;
        })}
    </div>
  );
};

export default TransportsMap;

"use client";

import React from "react";
import { useMessages } from "@/app/context/message-provider";

type Props = {};

const OfferIndicatior = (props: Props) => {
  const { offers, messages, offerMessages } = useMessages();

  return (
    <>
      {offers.length + messages.length + offerMessages.length > 0 && (
        <div className="absolute z-10 top-0 right-3 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
          {offers.length + messages.length + offerMessages.length}
        </div>
      )}
    </>
  );
};

export default OfferIndicatior;

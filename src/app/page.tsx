'use client'

import { useState } from "react";
import ViewMarket from "./component/view-market";
import useMarket, { MarketProvider } from "./hooks/use-market";


export default function Home() {
  return (
    <MarketProvider>
      <div>
        <ViewMarket/>
      </div>
    </MarketProvider>
  );
}

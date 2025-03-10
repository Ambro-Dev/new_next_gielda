import React from "react";

import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

type Props = {
  setPlace: (place: {
    lat: number;
    lng: number;
    formatted_address: string;
  }) => void;
  placeholder?: string;
};

const PlaceSelector = ({ setPlace, placeholder }: Props) => {
  const [open, setOpen] = React.useState(false);

  const [currentValue, setCurrentValue] = React.useState("");

  const {
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    requestOptions: {
      types: ["geocode"],
    },
  });

  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();
    setCurrentValue(val);

    const results = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(results[0]);
    setPlace({ lat, lng, formatted_address: results[0].formatted_address });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between capitalize"
        >
          {currentValue
            ? currentValue
            : placeholder
            ? placeholder
            : "Szukaj miejsca..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={placeholder ? placeholder : "Szukaj miejsca..."}
            onValueChange={(e) => setValue(e)}
          />
          <CommandEmpty>Nie znaleziono miejsca.</CommandEmpty>
          <CommandGroup>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <CommandItem key={place_id} onSelect={handleSelect}>
                  {description}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PlaceSelector;

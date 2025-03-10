import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  data: { label: string; name: string }[];
  onChange: (name: string) => void;
  value: string;
  title: string;
};

const SelectBox = (props: Props) => {
  const { data, onChange, title, value } = props;
  return (
    <Select onValueChange={(e) => onChange(e)} defaultValue={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Wybierz..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          {data.map((item) => (
            <SelectItem key={item.label} value={item.name}>
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectBox;

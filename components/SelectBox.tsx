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
  data: { id: string; name: string }[];
  onChange: (id: string) => void;
  title: string;
  defaultValue?: string;
};

const SelectBox = (props: Props) => {
  const { data, onChange, title, defaultValue } = props;
  return (
    <Select onValueChange={(e) => onChange(e)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={defaultValue ? defaultValue : "Wybierz..."} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          {data.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectBox;

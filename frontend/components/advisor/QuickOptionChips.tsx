import { Option } from '@/lib/advisorFlow';

interface Props {
  options: Option[];
  onSelect: (o: Option) => void;
}

export default function QuickOptionChips({ options, onSelect }: Props) {
  return (
    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
      {options.map(o => (
        <button
          type="button"
          key={o.id}
          onClick={() => onSelect(o)}
          className="whitespace-nowrap bg-neutral-700 hover:bg-neutral-600 text-sm px-4 py-2 rounded-full"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

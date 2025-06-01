interface Props {
    label: string;
    disabled?: boolean;
    onClick: () => void;
  }
  export default function PrimaryButton({ label, disabled, onClick }: Props) {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        className={`w-full mt-6 py-3 rounded-md font-semibold
          ${disabled
            ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
            : 'bg-[#CCA94F] text-black hover:opacity-90'}`}
      >
        {label}
      </button>
    );
  }
  
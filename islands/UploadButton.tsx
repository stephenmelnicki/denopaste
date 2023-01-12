import { useSignal } from "@preact/signals";

interface UploadButtonProps {
  onClick: () => Promise<void>;
}

export default function UploadButton(props: UploadButtonProps) {
  const isUploading = useSignal(false);

  const onClick = (event: MouseEvent) => {
    event.preventDefault();

    isUploading.value = true;
    props.onClick().finally(() => isUploading.value = false);
  };

  return (
    <button
      onClick={onClick}
      disabled={isUploading.value}
      class="px-3 py-2 inline-block border-2 border-gray-500 rounded transition-colors hover:(bg-green-100 border-green-500 text-green-800) disabled:(opacity-40 cursor-not-allowed)"
    >
      {isUploading.value ? "Uploading..." : "Upload"}
    </button>
  );
}

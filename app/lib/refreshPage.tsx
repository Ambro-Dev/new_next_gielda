import { useRouter } from "next/navigation";

const RefreshPage = () => {
  const router = useRouter();
  const refresh = () => {
    router.refresh();
  };

  refresh();
};

export default RefreshPage;
